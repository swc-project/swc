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
}
