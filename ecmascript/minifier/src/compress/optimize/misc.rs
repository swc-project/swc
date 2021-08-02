use super::{util::is_valid_identifier, Optimizer};
use swc_ecma_ast::*;

impl Optimizer<'_> {
    pub(super) fn optimize_prop_name(&mut self, name: &mut PropName) {
        match name {
            PropName::Str(s) => {
                if s.value.is_reserved() || s.value.is_reserved_in_es3() {
                    return;
                }

                if is_valid_identifier(&s.value, false) {
                    self.changed = true;
                    log::debug!("misc: Optimizing string property name");
                    *name = PropName::Ident(Ident {
                        span: s.span,
                        sym: s.value.clone(),
                        optional: false,
                    });
                    return;
                }
            }
            _ => {}
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
