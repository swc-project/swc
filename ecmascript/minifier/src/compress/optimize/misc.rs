use super::Optimizer;
use swc_ecma_ast::*;
use unicode_xid::UnicodeXID;

impl Optimizer<'_> {
    pub(super) fn optimize_prop_name(&mut self, name: &mut PropName) {
        match name {
            PropName::Str(s) => {
                if s.value.is_reserved() || s.value.is_reserved_in_es3() {
                    return;
                }

                if s.value.starts_with(|c: char| c.is_xid_start())
                    && s.value.chars().all(|c: char| c.is_xid_continue())
                {
                    self.changed = true;
                    log::trace!("misc: Optimizing string property name");
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
            log::trace!("misc: Removing useless return");
            stmts.pop();
        }
    }
}
