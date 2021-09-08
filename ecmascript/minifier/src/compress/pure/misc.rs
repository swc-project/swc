use super::Pure;
use crate::{compress::util::is_pure_undefined, mode::Mode};
use swc_ecma_ast::*;

impl<M> Pure<'_, M>
where
    M: Mode,
{
    pub(super) fn drop_undefined_from_return_arg(&mut self, s: &mut ReturnStmt) {
        match s.arg.as_deref() {
            Some(e) => {
                if is_pure_undefined(e) {
                    self.changed = true;
                    log::debug!("Dropped `undefined` from `return undefined`");
                    s.arg.take();
                }
            }
            None => {}
        }
    }

    pub(super) fn remove_useless_return(&mut self, stmts: &mut Vec<Stmt>) {
        if let Some(Stmt::Return(ReturnStmt { arg: None, .. })) = stmts.last() {
            self.changed = true;
            log::debug!("misc: Removing useless return");
            stmts.pop();
        }
    }

    /// Removes last return statement. This should be callled only if the return
    /// value of function is ignored.
    ///
    /// Returns true if something is modified.
    fn drop_return_value(&mut self, stmts: &mut Vec<Stmt>) -> bool {
        // TODO(kdy1): (maybe) run optimization again if it's removed.

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
                let a = self.drop_return_value(&mut s.block.stmts);
                let b = s
                    .handler
                    .as_mut()
                    .map(|c| self.drop_return_value(&mut c.body.stmts))
                    .unwrap_or_default();
                let c = s
                    .finalizer
                    .as_mut()
                    .map(|s| self.drop_return_value(&mut s.stmts))
                    .unwrap_or_default();

                a || b || c
            }

            _ => false,
        }
    }

    pub(super) fn ignore_return_value(&mut self, e: &mut Expr) {
        match e {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match &mut **callee {
                Expr::Fn(callee) => {
                    if let Some(body) = &mut callee.function.body {
                        self.drop_return_value(&mut body.stmts);
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
