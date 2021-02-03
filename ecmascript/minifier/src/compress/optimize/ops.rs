use super::Optimizer;
use crate::util::ValueExt;
use std::mem::swap;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value;
use Value::Known;

impl Optimizer {
    pub(super) fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        match n.op {
            op!("==") | op!("!=") => {
                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;

                let value = if n.op == op!("==") { l == r } else { l != r };

                log::trace!("Optimizing: literal comparison => bool");
                self.changed = true;
                return Some(Expr::Lit(Lit::Bool(Bool {
                    span: n.span,
                    value,
                })));
            }
            _ => {}
        }

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
                        log::trace!("Optimizing: `!!expr` => `expr`");
                        *e = *arg.take();
                        return;
                    }

                    _ => {}
                },
                _ => {}
            },
            _ => {}
        }
    }

    pub(super) fn optimize_expr_in_str_ctx(&mut self, n: &mut Expr) {
        match n {
            Expr::Lit(Lit::Str(..)) => return,
            _ => {}
        }

        let span = n.span();
        let value = n.as_string();
        if let Known(value) = value {
            *n = Expr::Lit(Lit::Str(Str {
                span,
                value: value.into(),
                has_escape: false,
                kind: Default::default(),
            }))
        }
    }

    /// TODO: Optimize based on the type.
    pub(super) fn negate_twice(&mut self, e: &mut Expr) {
        self.negate(e);
        self.negate(e);
    }

    /// Creates `!e` where e is the expression passed as an argument.
    ///
    /// # Note
    ///
    /// This method returns `!e` if `!!e` is given as a argument.
    ///
    /// TODO: Handle special cases like !1 or !0
    pub(super) fn negate(&mut self, e: &mut Expr) {
        self.changed = true;
        let arg = Box::new(e.take());

        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Unary(UnaryExpr { op: op!("!"), .. }) => {
                    log::trace!("negate: !!bool => !bool");
                    *e = *arg.take();
                    return;
                }
                Expr::Bin(BinExpr { op: op!("in"), .. })
                | Expr::Bin(BinExpr {
                    op: op!("instanceof"),
                    ..
                }) => {
                    log::trace!("negate: !bool => bool");
                    *e = *arg.take();
                    return;
                }
                _ => {}
            },
            _ => {}
        }

        log::trace!("negate: e => !e");

        *e = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: op!("!"),
            arg,
        });
    }

    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(
                e @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => {
                match &mut *e.arg {
                    Expr::Seq(SeqExpr { exprs, .. }) => {
                        if exprs.is_empty() {
                            return;
                        }
                        log::trace!("optimizing negated sequences");

                        {
                            let last = exprs.last_mut().unwrap();
                            self.optimize_expr_in_bool_ctx(last);
                            // Negate last element.
                            self.negate(last);
                        }

                        *n = *e.arg.take();
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// This method does
    ///
    /// - `x *= 3` => `x = 3 * x`
    /// - `x = 3 | x` `x |= 3`
    /// - `x = 3 & x` => `x &= 3;`
    /// - `x ^= 3` => `x = 3 ^ x`
    pub(super) fn compress_bin_assignment_to_right(&mut self, e: &mut AssignExpr) {
        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => i,
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

        log::trace!("Compressing: `e = 3 & e` => `e &= 3`");

        self.changed = true;
        e.op = op;
        e.right = left.take();
    }

    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        // Swap lhs and rhs in certain conditions.
        match expr {
            Expr::Bin(test) => {
                match test.op {
                    op!("==") | op!("!=") | op!("&") | op!("^") | op!("*") => {}
                    _ => return,
                }

                match (&*test.left, &*test.right) {
                    (&Expr::Ident(..), &Expr::Lit(..)) => {
                        self.changed = true;
                        log::trace!("Swapping operands of binary exprssion");
                        swap(&mut test.left, &mut test.right);
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// Remove meaningless literals in a binary expressions.
    ///
    ///
    /// # Examples
    ///
    /// - `x() && true` => `!!x()`
    pub(super) fn compress_logical_exprs_as_bang_bang(&mut self, e: &mut Expr) {
        if !self.options.conditionals && !self.options.reduce_vars {
            return;
        }

        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        match bin.op {
            op!("&&") => {
                let rt = bin.right.get_type();
                match rt {
                    Known(Type::Bool) => {}
                    _ => return,
                }

                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                log::trace!("Optimizing: e && true => !!e");

                if rb {
                    self.negate(&mut bin.left);
                    self.negate(&mut bin.left);
                    *e = *bin.left.take();
                }
            }
            op!("||") => {}
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
                log::trace!("Removing null from lhs of ??");
                self.changed = true;
                *e = r.take();
                return;
            }
            Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::BigInt(..))
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Regex(..)) => {
                log::trace!("Removing rhs of ?? as lhs cannot be null nor undefined");
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
                        log::trace!(
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
                    log::trace!("Converting typeof to 'function' as we know the value");
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
                    log::trace!("Converting typeof to 'object' as we know the value");
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
