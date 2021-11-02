use super::Pure;
use crate::{compress::util::is_pure_undefined, mode::Mode};
use swc_common::util::take::Take;
use swc_ecma_ast::*;

impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn remove_invalid(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.remove_invalid(left);
                self.remove_invalid(right);

                if left.is_invalid() {
                    *e = *right.take();
                    self.remove_invalid(e);
                    return;
                } else if right.is_invalid() {
                    *e = *left.take();
                    self.remove_invalid(e);
                    return;
                }
            }
            _ => {}
        }
    }

    pub(super) fn drop_undefined_from_return_arg(&mut self, s: &mut ReturnStmt) {
        match s.arg.as_deref() {
            Some(e) => {
                if is_pure_undefined(e) {
                    self.changed = true;
                    tracing::debug!("Dropped `undefined` from `return undefined`");
                    s.arg.take();
                }
            }
            None => {}
        }
    }

    pub(super) fn remove_useless_return(&mut self, stmts: &mut Vec<Stmt>) {
        if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts.last() {
            self.changed = true;
            tracing::debug!("misc: Removing useless return");
            stmts.pop();
        }
    }

    /// Removes last return statement. This should be callled only if the return
    /// value of function is ignored.
    ///
    /// Returns true if something is modified.
    fn drop_return_value(&mut self, stmts: &mut Vec<Stmt>) -> bool {
        // TODO(kdy1): (maybe) run optimization again if it's removed.

        for s in stmts.iter_mut() {
            match s {
                Stmt::Return(ReturnStmt {
                    arg: arg @ Some(..),
                    ..
                }) => {
                    self.ignore_return_value(arg.as_deref_mut().unwrap());

                    match arg.as_deref() {
                        Some(Expr::Invalid(..)) => {
                            *arg = None;
                        }

                        _ => {}
                    }
                }
                _ => {}
            }
        }

        if let Some(last) = stmts.last_mut() {
            self.drop_return_value_of_stmt(last)
        } else {
            false
        }
    }

    /// Returns true if something is modified.
    fn drop_return_value_of_stmt(&mut self, s: &mut Stmt) -> bool {
        match s {
            Stmt::Block(s) => self.drop_return_value(&mut s.stmts),
            Stmt::Return(ret) => {
                self.changed = true;
                if cfg!(feature = "debug") {
                    tracing::trace!("Dropping `return` token");
                }

                let span = ret.span;
                match ret.arg.take() {
                    Some(arg) => {
                        *s = Stmt::Expr(ExprStmt { span, expr: arg });
                    }
                    None => {
                        *s = Stmt::Empty(EmptyStmt { span });
                    }
                }

                true
            }

            Stmt::Labeled(s) => self.drop_return_value_of_stmt(&mut s.body),
            Stmt::If(s) => {
                let c = self.drop_return_value_of_stmt(&mut s.cons);
                let a = s
                    .alt
                    .as_deref_mut()
                    .map(|s| self.drop_return_value_of_stmt(s))
                    .unwrap_or_default();

                c || a
            }

            Stmt::Try(s) => {
                let a = if s.finalizer.is_none() {
                    self.drop_return_value(&mut s.block.stmts)
                } else {
                    false
                };

                let b = s
                    .finalizer
                    .as_mut()
                    .map(|s| self.drop_return_value(&mut s.stmts))
                    .unwrap_or_default();

                a || b
            }

            _ => false,
        }
    }

    pub(super) fn ignore_return_value(&mut self, e: &mut Expr) {
        match e {
            Expr::Seq(e) => {
                self.drop_useless_ident_ref_in_seq(e);

                if let Some(last) = e.exprs.last_mut() {
                    // Non-last elements are already processed.
                    self.ignore_return_value(&mut **last);
                }
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match &mut **callee {
                Expr::Fn(callee) => {
                    if callee.ident.is_none() {
                        if let Some(body) = &mut callee.function.body {
                            if self.options.side_effects {
                                self.drop_return_value(&mut body.stmts);
                            }
                        }
                    }
                }

                _ => {
                    unreachable!()
                }
            },

            _ => {}
        }
    }
}
