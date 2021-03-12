use crate::id::Id;
use crate::util::MapWithMut;
use ahash::AHashMap;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

#[derive(Default)]
pub struct KeywordRenamer {
    renamed: AHashMap<Id, Ident>,
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

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        f.function.visit_mut_with(self);
        if let Some(renamed) = self.renamed(&f.ident) {
            f.ident = renamed;
        }
    }

    fn visit_mut_class_decl(&mut self, c: &mut ClassDecl) {
        c.class.visit_mut_with(self);
        if let Some(renamed) = self.renamed(&c.ident) {
            c.ident = renamed;
        }
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(i) => {
                if let Some(renamed) = self.renamed(&i) {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(i.clone()),
                        value: Box::new(Expr::Ident(renamed)),
                    });
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        n.visit_mut_children_with(self);

        match n {
            ObjectPatProp::Assign(pat) => {
                if let Some(renamed) = self.renamed(&pat.key) {
                    match &mut pat.value {
                        Some(default) => {
                            *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(pat.key.take()),
                                value: Box::new(Pat::Assign(AssignPat {
                                    span: pat.span,
                                    left: Box::new(Pat::Ident(renamed.into())),
                                    right: default.take(),
                                    type_ann: None,
                                })),
                            });
                        }
                        None => {
                            *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(pat.key.take()),
                                value: Box::new(Pat::Ident(renamed.into())),
                            })
                        }
                    }
                }
            }
            _ => {}
        }
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        match n {
            Pat::Ident(n) => {
                if let Some(renamed) = self.renamed(&n.id) {
                    *n = renamed.into();
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

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.decorators.visit_mut_with(self);
        n.value.visit_mut_with(self);
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.decorators.visit_mut_with(self);
        n.value.visit_mut_with(self);
    }
}
