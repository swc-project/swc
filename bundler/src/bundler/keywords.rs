use crate::id::Id;
use std::collections::HashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[derive(Default)]
pub struct KeywordRenamer {
    renamed: HashMap<Id, Ident>,
}

impl KeywordRenamer {
    /// Returns `Some(new_ident)` if it should be renamed.
    fn renamed(&mut self, id: &Ident) -> Option<Ident> {
        if id.sym == js_word!("import") {
            return None;
        }

        if !id.is_reserved_for_es3() {
            return None;
        }

        Some(
            self.renamed
                .entry(id.into())
                .or_insert_with(|| private_ident!(id.span, format!("__{}", id.sym)))
                .clone(),
        )
    }
}

impl VisitMut for KeywordRenamer {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        match n {
            Pat::Ident(n) => {
                if let Some(renamed) = self.renamed(&n) {
                    *n = renamed;
                }

                return;
            }
            _ => {}
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(n) => {
                if let Some(renamed) = self.renamed(&n) {
                    *n = renamed;
                }
                return;
            }
            _ => {}
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self)
        }
    }

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        if let Some(renamed) = self.renamed(&n.orig) {
            n.orig = renamed;
        }
    }
}
