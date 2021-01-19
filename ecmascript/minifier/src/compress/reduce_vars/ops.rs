use super::Reducer;
use crate::util::ValueExt;
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
            }) => {
                self.optimize_expr_in_bool_ctx(&mut **arg);

                match &**arg {
                    Expr::Lit(Lit::Num(Number { value, .. })) => {
                        self.changed = true;
                        *n = Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: if *value == 0.0 { 1.0 } else { 0.0 },
                        }))
                    }
                    _ => {}
                }
            }

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
                _ => {}
            },
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

        e.op = op;
        e.right = left.take();
    }
}
