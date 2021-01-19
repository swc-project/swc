use super::Reducer;
use crate::util::ValueExt;
use std::mem::swap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;

impl Reducer {
    pub(super) fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        match n.op {
            op!("==") | op!("!=") => {
                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;

                let value = if n.op == op!("==") { l == r } else { l != r };

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

    /// This method converts `!1` to `0`.
    pub(super) fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr) {
        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => match &**arg {
                Expr::Lit(Lit::Num(Number { value, .. })) => {
                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                    }))
                }
                _ => {}
            },

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => match &**arg {
                Expr::Ident(..) => {
                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: 1.0,
                    }))
                }
                _ => {
                    // Return value of typeof is always truthy
                    let true_expr = Box::new(Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: 1.0,
                    })));
                    self.changed = true;
                    *n = Expr::Seq(SeqExpr {
                        span: *span,
                        exprs: vec![arg.take(), true_expr],
                    })
                }
            },

            Expr::Lit(Lit::Str(s)) => {
                self.changed = true;
                *n = Expr::Lit(Lit::Num(Number {
                    span: s.span,
                    value: if s.value.is_empty() { 0.0 } else { 1.0 },
                }));
            }

            Expr::Lit(Lit::Num(num)) => {
                if num.value == 1.0 || num.value == 0.0 {
                    return;
                }

                self.changed = true;
                *n = Expr::Lit(Lit::Num(Number {
                    span: num.span,
                    value: if num.value == 0.0 { 0.0 } else { 1.0 },
                }));
            }

            _ => {}
        }
    }

    /// Creates `!e` where e is the expression passed as an argument.
    ///
    /// # Note
    ///
    /// This method returns `!e` if `!!e` is given as a argument.
    ///
    /// TODO: Handle special cases like !1 or !0
    pub(super) fn negate(&mut self, e: &mut Expr) {
        let arg = Box::new(e.take());

        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Unary(UnaryExpr { op: op!("!"), .. }) => {
                    *e = *arg.take();
                    return;
                }
                _ => {}
            },
            _ => {}
        }

        *e = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: op!("!"),
            arg,
        });
    }

    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e) => {
                match &mut *e.arg {
                    Expr::Seq(SeqExpr { exprs, .. }) => {
                        if exprs.is_empty() {
                            return;
                        }

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

        self.changed = true;
        e.op = op;
        e.right = left.take();
    }

    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        // Swap lhs and rhs in certain conditions.
        match expr {
            Expr::Bin(test) => {
                match test.op {
                    op!("==") | op!("!=") => {}
                    _ => return,
                }

                match (&*test.left, &*test.right) {
                    (&Expr::Ident(..), &Expr::Lit(..)) => {
                        self.changed = true;
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
    /// - `x() && true` => `!!x()`
    pub(super) fn optimize_logical_exprs(&mut self, e: &mut Expr) {
        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };
    }
}
