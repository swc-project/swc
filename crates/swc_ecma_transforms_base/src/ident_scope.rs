use std::{cell::RefCell, rc::Rc};

use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, SyntaxContext};
use swc_ecma_ast::{Pat, VarDecl, VarDeclKind};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[derive(Debug, Default, Clone, PartialEq, Eq, Hash)]
pub struct IdentScope {
    ctxt: SyntaxContext,
    sym: JsWord,
}

impl From<(JsWord, SyntaxContext)> for IdentScope {
    fn from((sym, ctxt): (JsWord, SyntaxContext)) -> Self {
        IdentScope { sym, ctxt }
    }
}

pub type IdentScopeRecord = Rc<RefCell<AHashSet<IdentScope>>>;

pub fn unscope_ident_collector(unblock_ident: IdentScopeRecord) -> impl Fold {
    as_folder(UnblockIdentCollector { unblock_ident })
}

struct UnblockIdentCollector {
    unblock_ident: IdentScopeRecord,
}

impl VisitMut for UnblockIdentCollector {
    noop_visit_mut_type!();

    fn visit_mut_var_decl(&mut self, var: &mut VarDecl) {
        var.visit_mut_children_with(self);

        if var.kind != VarDeclKind::Var {
            for decl in var.decls.iter() {
                if let Pat::Ident(name) = &decl.name {
                    self.unblock_ident
                        .borrow_mut()
                        .remove(&(name.id.sym.clone(), name.id.span.ctxt()).into());
                }
            }
        } else {
            for decl in var.decls.iter() {
                if let Pat::Ident(name) = &decl.name {
                    self.unblock_ident
                        .borrow_mut()
                        .insert((name.id.sym.clone(), name.id.span.ctxt()).into());
                }
            }
        }
    }
}
