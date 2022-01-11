use super::Optimizer;
use crate::{
    compress::util::negate,
    mode::Mode,
    util::{make_bool, ValueExt},
};
use swc_atoms::js_word;
use swc_common::{util::take::Take, EqIgnoreSpan};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Type, Value};
use Value::Known;

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    ///
    /// - `'12' === `foo` => '12' == 'foo'`
    pub(super) fn optimize_bin_operator(&mut self, e: &mut BinExpr) {
        if !self.options.comparisons {
            return;
        }

        match e.op {
            op!("===") | op!("==") | op!("!==") | op!("!=") => {
                if e.left.is_ident() && e.left.eq_ignore_span(&e.right) {
                    let id: Ident = e.left.clone().ident().unwrap();
                    if let Some(t) = self.typeofs.get(&id.to_id()) {
                        match *t {
                            js_word!("object") | js_word!("function") => {
                                e.left = Box::new(make_bool(
                                    e.span,
                                    e.op == op!("===") || e.op == op!("=="),
                                ));
                                e.right.take();
                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }

            _ => {}
        }

        if e.op == op!("===") || e.op == op!("!==") {
            if (e.left.is_ident() || e.left.is_member()) && e.left.eq_ignore_span(&e.right) {
                self.changed = true;
                tracing::debug!("Reducing comparison of same variable ({})", e.op);

                e.op = if e.op == op!("===") {
                    op!("==")
                } else {
                    op!("!=")
                };
                return;
            }
        }

        let lt = e.left.get_type();
        let rt = e.right.get_type();

        if e.op == op!("===") {
            if let Known(lt) = lt {
                if let Known(rt) = rt {
                    if lt == rt {
                        e.op = op!("==");
                        self.changed = true;
                        tracing::debug!(
                            "Reduced `===` to `==` because types of operands are identical"
                        )
                    }
                }
            }
        }
    }

    ///
    /// - `1 == 1` => `true`
    /// - `1 == 2` => `false`
    pub(super) fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        if n.op != op!("==") && n.op != op!("!=") {
            return None;
        }
        let flag = n.op == op!("!=");
        let mut make_lit_bool = |value: bool| {
            self.changed = true;
            Some(Expr::Lit(Lit::Bool(Bool {
                span: n.span,
                value: flag ^ value,
            })))
        };
        match (n.left.get_type().opt()?, n.right.get_type().opt()?) {
            // Abort if types differ, or one of them is unknown.
            (lt, rt) if lt != rt => {}
            (Type::Obj, Type::Obj) => {}
            (Type::Num, Type::Num) => {
                let l = n.left.as_number().opt()?;
                let r = n.right.as_number().opt()?;
                tracing::debug!("Optimizing: literal comparison => num");
                return make_lit_bool(l == r);
            }
            (Type::Str, Type::Str) => {
                let l = &n.left.as_string().opt()?;
                let r = &n.right.as_string().opt()?;
                tracing::debug!("Optimizing: literal comparison => str");
                return make_lit_bool(l == r);
            }
            (_, _) => {
                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;
                tracing::debug!("Optimizing: literal comparison => bool");
                return make_lit_bool(l == r);
            }
        };

        None
    }

    ///
    /// - `!!(a in b)` => `a in b`
    /// - `!!(function() {})()` => `!(function() {})()`
    pub(super) fn optimize_bangbang(&mut self, e: &mut Expr) {
        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => match &**arg {
                    Expr::Unary(UnaryExpr { op: op!("!"), .. })
                    | Expr::Bin(BinExpr { op: op!("in"), .. })
                    | Expr::Bin(BinExpr {
                        op: op!("instanceof"),
                        ..
                    })
                    | Expr::Bin(BinExpr { op: op!("=="), .. })
                    | Expr::Bin(BinExpr { op: op!("!="), .. })
                    | Expr::Bin(BinExpr { op: op!("==="), .. })
                    | Expr::Bin(BinExpr { op: op!("!=="), .. })
                    | Expr::Bin(BinExpr { op: op!("<="), .. })
                    | Expr::Bin(BinExpr { op: op!("<"), .. })
                    | Expr::Bin(BinExpr { op: op!(">="), .. })
                    | Expr::Bin(BinExpr { op: op!(">"), .. }) => {
                        if let Known(Type::Bool) = arg.get_type() {
                            self.changed = true;
                            tracing::debug!("Optimizing: `!!expr` => `expr`");
                            *e = *arg.take();
                        }

                        return;
                    }

                    _ => {}
                },
                _ => {}
            },
            _ => {}
        }
    }

    /// TODO: Optimize based on the type.
    pub(super) fn negate_twice(&mut self, e: &mut Expr) {
        self.negate(e);
        self.negate(e);
    }

    pub(super) fn negate(&mut self, e: &mut Expr) {
        self.changed = true;
        negate(e, self.ctx.in_bool_ctx)
    }

    /// This method does
    ///
    /// - `x *= 3` => `x = 3 * x`
    /// - `x = 3 | x` `x |= 3`
    /// - `x = 3 & x` => `x &= 3;`
    /// - `x ^= 3` => `x = 3 ^ x`
    pub(super) fn compress_bin_assignment_to_right(&mut self, e: &mut AssignExpr) {
        if e.op != op!("=") {
            return;
        }

        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => &i.id,
                _ => return,
            },
        };

        let (op, left) = match &mut *e.right {
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => match &**right {
                Expr::Ident(r) if lhs.sym == r.sym && lhs.span.ctxt == r.span.ctxt => {
                    // We need this check because a function call like below can change value of
                    // operand.
                    //
                    // x = g() * x;

                    match &**left {
                        Expr::This(..) | Expr::Ident(..) | Expr::Lit(..) => {}
                        _ => return,
                    }

                    (op, left)
                }
                _ => return,
            },
            _ => return,
        };

        let op = match op {
            BinaryOp::Mul => {
                op!("*=")
            }
            BinaryOp::BitOr => {
                op!("|=")
            }
            BinaryOp::BitXor => {
                op!("^=")
            }
            BinaryOp::BitAnd => {
                op!("&=")
            }
            _ => return,
        };

        tracing::debug!("Compressing: `e = 3 & e` => `e &= 3`");

        self.changed = true;
        e.op = op;
        e.right = left.take();
    }

    /// Remove meaningless literals in a binary expressions.
    ///
    /// # Parameters
    ///
    ///  - `in_bool_ctx`: True for expressions casted to bool.
    ///
    /// # Examples
    ///
    /// - `x() && true` => `!!x()`
    pub(super) fn compress_logical_exprs_as_bang_bang(&mut self, e: &mut Expr, in_bool_ctx: bool) {
        if !self.options.conditionals && !self.options.reduce_vars {
            return;
        }

        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        match bin.op {
            op!("&&") | op!("||") => {
                self.compress_logical_exprs_as_bang_bang(&mut bin.left, true);
                self.compress_logical_exprs_as_bang_bang(&mut bin.right, true);
            }

            _ => {}
        }

        let lt = bin.left.get_type();
        if !in_bool_ctx {
            match lt {
                // Don't change type
                Known(Type::Bool) => {}
                _ => return,
            }
        }

        let rt = bin.right.get_type();
        match rt {
            Known(Type::Bool) => {}
            _ => return,
        }

        match bin.op {
            op!("&&") => {
                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if rb {
                    self.changed = true;
                    tracing::debug!("Optimizing: e && true => !!e");

                    self.negate_twice(&mut bin.left);
                    *e = *bin.left.take();
                } else {
                    self.changed = true;
                    tracing::debug!("Optimizing: e && false => e");

                    *e = *bin.left.take();
                }
            }
            op!("||") => {
                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if !rb {
                    self.changed = true;
                    tracing::debug!("Optimizing: e || false => !!e");

                    self.negate_twice(&mut bin.left);
                    *e = *bin.left.take();
                }
            }
            _ => {}
        }
    }

    ///
    /// - `!(x == y)` => `x != y`
    /// - `!(x === y)` => `x !== y`
    pub(super) fn compress_negated_bin_eq(&self, e: &mut Expr) {
        let unary = match e {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. }) => e,
            _ => return,
        };

        match &mut *unary.arg {
            Expr::Bin(BinExpr {
                op: op @ op!("=="),
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: op @ op!("==="),
                left,
                right,
                ..
            }) => {
                *e = Expr::Bin(BinExpr {
                    span: unary.span,
                    op: if *op == op!("==") {
                        op!("!=")
                    } else {
                        op!("!==")
                    },
                    left: left.take(),
                    right: right.take(),
                })
            }
            _ => {}
        }
    }

    pub(super) fn optimize_nullish_coalescing(&mut self, e: &mut Expr) {
        let (l, r) = match e {
            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => (&mut **left, &mut **right),
            _ => return,
        };

        match l {
            Expr::Lit(Lit::Null(..)) => {
                tracing::debug!("Removing null from lhs of ??");
                self.changed = true;
                *e = r.take();
                return;
            }
            Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::BigInt(..))
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Regex(..)) => {
                tracing::debug!("Removing rhs of ?? as lhs cannot be null nor undefined");
                self.changed = true;
                *e = l.take();
                return;
            }
            _ => {}
        }
    }

    /// `typeof b !== 'undefined'` => `b != void 0`
    pub(super) fn compress_typeofs(&mut self, e: &mut Expr) {
        if !self.options.typeofs {
            return;
        }

        match e {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
                ..
            }) => match &**arg {
                Expr::Ident(arg) => {
                    if let Some(value) = self.typeofs.get(&arg.to_id()).cloned() {
                        tracing::debug!(
                            "Converting typeof of variable to literal as we know the value"
                        );
                        self.changed = true;
                        *e = Expr::Lit(Lit::Str(Str {
                            span: *span,
                            value,
                            has_escape: false,
                            kind: Default::default(),
                        }));
                        return;
                    }
                }

                Expr::Arrow(..) | Expr::Fn(..) => {
                    tracing::debug!("Converting typeof to 'function' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        value: js_word!("function"),
                        has_escape: false,
                        kind: Default::default(),
                    }));
                    return;
                }

                Expr::Array(..) | Expr::Object(..) => {
                    tracing::debug!("Converting typeof to 'object' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        value: js_word!("object"),
                        has_escape: false,
                        kind: Default::default(),
                    }));
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }
}
