use std::{cell::RefCell, rc::Rc};

use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_ast::{Pat, VarDecl, VarDeclKind};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[derive(Debug, Default, Clone, PartialEq, Eq, Hash)]
pub struct IdentScope {
    sym: JsWord,
    ctxt: SyntaxContext,
}

impl From<(JsWord, SyntaxContext)> for IdentScope {
    fn from((sym, ctxt): (JsWord, SyntaxContext)) -> Self {
        IdentScope { sym, ctxt }
    }
}

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

pub type IdentScopeRecord = Rc<RefCell<AHashMap<IdentScope, IdentScopeKind>>>;

pub fn unscope_ident_collector(ident_scope_record: IdentScopeRecord) -> impl Fold {
    as_folder(UnblockIdentCollector { ident_scope_record })
}

struct UnblockIdentCollector {
    ident_scope_record: IdentScopeRecord,
}

impl VisitMut for UnblockIdentCollector {
    noop_visit_mut_type!();

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.visit_mut_children_with(self);

        for decl in var.decls.iter() {
            if let Pat::Ident(name) = &decl.name {
                self.ident_scope_record
                    .borrow_mut()
                    .entry(IdentScope {
                        sym: name.id.sym.clone(),
                        ctxt: name.id.span.ctxt(),
                    })
                    .or_insert_with(|| var.kind.into());
            }
        }
    }
}
