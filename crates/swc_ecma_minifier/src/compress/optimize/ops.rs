use swc_atoms::js_word;
use swc_common::{util::take::Take, EqIgnoreSpan};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};
use Value::Known;

use super::Optimizer;
use crate::{
    compress::util::negate,
    mode::Mode,
    util::{make_bool, ValueExt},
};

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
                report_change!("Reducing comparison of same variable ({})", e.op);

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
                        report_change!(
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
                report_change!("Optimizing: literal comparison => num");
                return make_lit_bool(l == r);
            }
            (Type::Str, Type::Str) => {
                let l = &n.left.as_string().opt()?;
                let r = &n.right.as_string().opt()?;
                report_change!("Optimizing: literal comparison => str");
                return make_lit_bool(l == r);
            }
            (_, _) => {
                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;
                report_change!("Optimizing: literal comparison => bool");
                return make_lit_bool(l == r);
            }
        };

        None
    }

    ///
    /// - `!!(a in b)` => `a in b`
    /// - `!!(function() {})()` => `!(function() {})()`
    pub(super) fn optimize_bangbang(&mut self, e: &mut Expr) {
        if let Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) = e
        {
            if let Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) = &mut **arg
            {
                match &**arg {
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
                            report_change!("Optimizing: `!!expr` => `expr`");
                            *e = *arg.take();
                        }
                    }

                    _ => {}
                }
            }
        }
    }

    /// TODO: Optimize based on the type.
    pub(super) fn negate_twice(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        self.negate(e, is_ret_val_ignored);
        self.negate(e, is_ret_val_ignored);
    }

    pub(super) fn negate(&mut self, e: &mut Expr, is_ret_val_ignored: bool) {
        negate(e, self.ctx.in_bool_ctx, is_ret_val_ignored)
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

        report_change!("Compressing: `e = 3 & e` => `e &= 3`");

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
                    report_change!("Optimizing: e && true => !!e");

                    self.negate_twice(&mut bin.left, false);
                    *e = *bin.left.take();
                } else {
                    self.changed = true;
                    report_change!("Optimizing: e && false => e");

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
                    report_change!("Optimizing: e || false => !!e");

                    self.negate_twice(&mut bin.left, false);
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
                report_change!("Removing null from lhs of ??");
                self.changed = true;
                *e = r.take();
            }
            Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::BigInt(..))
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Regex(..)) => {
                report_change!("Removing rhs of ?? as lhs cannot be null nor undefined");
                self.changed = true;
                *e = l.take();
            }
            _ => {}
        }
    }

    /// `typeof b !== 'undefined'` => `b != void 0`
    pub(super) fn compress_typeofs(&mut self, e: &mut Expr) {
        if !self.options.typeofs {
            return;
        }

        if let Expr::Unary(UnaryExpr {
            span,
            op: op!("typeof"),
            arg,
            ..
        }) = e
        {
            match &**arg {
                Expr::Ident(arg) => {
                    if let Some(value) = self.typeofs.get(&arg.to_id()).cloned() {
                        report_change!(
                            "Converting typeof of variable to literal as we know the value"
                        );
                        self.changed = true;
                        *e = Expr::Lit(Lit::Str(Str {
                            span: *span,
                            raw: None,
                            value,
                        }));
                    }
                }

                Expr::Arrow(..) | Expr::Fn(..) => {
                    report_change!("Converting typeof to 'function' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        raw: None,
                        value: js_word!("function"),
                    }));
                }

                Expr::Array(..) | Expr::Object(..) => {
                    report_change!("Converting typeof to 'object' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        raw: None,
                        value: js_word!("object"),
                    }));
                }
                _ => {}
            }
        }
    }
}
