use std::{cell::RefCell, rc::Rc};

use is_macro::Is;
use swc_common::collections::AHashMap;
use swc_ecma_ast::{Id, VarDecl, VarDeclKind};
use swc_ecma_utils::collect_decls;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Is, Hash)]
pub enum IdentScopeKind {
    /// `var`
    Var,
    /// `let` or `const`
    Block,
    /// `var` but should be block scoped
    BlockVar,
    Unresolved,
}

impl Default for IdentScopeKind {
    fn default() -> Self {
        IdentScopeKind::Unresolved
    }
}

impl From<VarDeclKind> for IdentScopeKind {
    fn from(value: VarDeclKind) -> Self {
        if value == VarDeclKind::Var {
            Self::Var
        } else {
            Self::Block
        }
    }
}

pub type IdentScopeRecord = Rc<RefCell<AHashMap<Id, IdentScopeKind>>>;

pub fn ident_scope_collector(ident_scope_record: IdentScopeRecord) -> impl Fold {
    as_folder(IdentScopeCollector { ident_scope_record })
}

struct IdentScopeCollector {
    ident_scope_record: IdentScopeRecord,
}

impl VisitMut for IdentScopeCollector {
    noop_visit_mut_type!();

    fn visit_mut_var_decl(&mut self, var_decl: &mut VarDecl) {
        var_decl.visit_mut_children_with(self);

        let kind = var_decl.kind.into();

        collect_decls(var_decl).into_iter().for_each(|id| {
            self.ident_scope_record.borrow_mut().insert(id, kind);
        });
    }
}
