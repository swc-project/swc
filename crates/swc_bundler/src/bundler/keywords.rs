use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::id::Id;

#[derive(Default)]
pub struct KeywordRenamer {
    renamed: AHashMap<Id, Ident>,
}

impl KeywordRenamer {
    /// Returns `Some(new_ident)` if it should be renamed.
    fn renamed(&mut self, id: &Ident) -> Option<Ident> {
        if id.sym == "import" {
            return None;
        }

        if !(id.is_reserved() || id.is_reserved_in_strict_mode(true) || id.is_reserved_in_es3()) {
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
    noop_visit_mut_type!(fail);

    fn visit_mut_binding_ident(&mut self, n: &mut BindingIdent) {
        if let Some(new) = self.renamed(&n.id) {
            n.ctxt = new.ctxt;
            n.sym = new.sym;
        }
    }

    fn visit_mut_class_decl(&mut self, c: &mut ClassDecl) {
        c.class.visit_mut_with(self);
        if let Some(renamed) = self.renamed(&c.ident) {
            c.ident = renamed;
        }
    }

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        if n.key.is_computed() {
            n.key.visit_mut_with(self);
        }

        n.decorators.visit_mut_with(self);
        n.value.visit_mut_with(self);
    }

    fn visit_mut_export_named_specifier(&mut self, n: &mut ExportNamedSpecifier) {
        let orig = match &n.orig {
            ModuleExportName::Ident(ident) => ident,
            ModuleExportName::Str(..) => unimplemented!("module string names unimplemented"),
        };
        if let Some(renamed) = self.renamed(orig) {
            n.orig = ModuleExportName::Ident(renamed);
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if let Expr::Ident(n) = n {
            if let Some(renamed) = self.renamed(n) {
                *n = renamed;
            }
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        f.function.visit_mut_with(self);
        if let Some(renamed) = self.renamed(&f.ident) {
            f.ident = renamed;
        }
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        if let ObjectPatProp::Assign(pat) = n {
            if let Some(renamed) = self.renamed(&pat.key) {
                match &mut pat.value {
                    Some(default) => {
                        *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(pat.key.take().into()),
                            value: AssignPat {
                                span: pat.span,
                                left: Box::new(renamed.into()),
                                right: default.take(),
                            }
                            .into(),
                        });
                    }
                    None => {
                        *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(pat.key.take().into()),
                            value: renamed.into(),
                        })
                    }
                }
            }
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        if let Pat::Ident(n) = n {
            if let Some(renamed) = self.renamed(&n.id) {
                *n = renamed.into();
            }

            return;
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        n.decorators.visit_mut_with(self);
        n.value.visit_mut_with(self);
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(i) => {
                if let Some(renamed) = self.renamed(i) {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.clone().into()),
                        value: renamed.into(),
                    });
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }
}
