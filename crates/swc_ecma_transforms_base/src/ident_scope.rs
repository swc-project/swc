use std::{cell::RefCell, rc::Rc};

use is_macro::Is;
use swc_common::collections::AHashMap;
use swc_ecma_ast::{
    AssignPatProp, Expr, Id, Ident, KeyValuePatProp, PropName, VarDecl, VarDeclKind,
};
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

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

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.visit_mut_children_with(self);

        let mut pat_visitor = PatVisitor {
            ident_scope_record: self.ident_scope_record.clone(),
            ident_scope_kind: var.kind.into(),
        };

        for decl in var.decls.iter() {
            decl.name.visit_with(&mut pat_visitor);
        }
    }
}

struct PatVisitor {
    ident_scope_record: IdentScopeRecord,
    ident_scope_kind: IdentScopeKind,
}

impl Visit for PatVisitor {
    noop_visit_type!();

    /// No-op (we don't care about expressions)
    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_ident(&mut self, ident: &Ident) {
        self.ident_scope_record
            .borrow_mut()
            .entry(ident.to_id())
            .or_insert_with(|| self.ident_scope_kind);
    }

    /// No-op (we don't care about expressions)
    fn visit_prop_name(&mut self, _: &PropName) {}

    /// let { x: y } = z;
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp) {
        n.value.visit_with(self);
    }

    /// let { x = y } = z;
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        n.key.visit_with(self);
    }
}
