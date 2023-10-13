use swc_common::{collections::AHashMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) fn rename(map: AHashMap<Id, Id>) -> Rename {
    Rename { map }
}

pub(super) struct Rename {
    map: AHashMap<Id, Id>,
}

#[swc_trace]
impl VisitMut for Rename {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        // fast path.
        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        if let Some(id) = self.map.get(&i.to_id()) {
            *i = Ident::new(id.0.clone(), i.span.with_ctxt(id.1));
        }
    }

    fn visit_mut_member_prop(&mut self, n: &mut MemberProp) {
        if let MemberProp::Computed(n) = n {
            n.visit_mut_with(self);
        }
    }

    fn visit_mut_object_pat_prop(&mut self, i: &mut ObjectPatProp) {
        match i {
            ObjectPatProp::Assign(p) => {
                p.value.visit_mut_with(self);

                let orig = p.key.clone();
                p.key.visit_mut_with(self);

                if orig.to_id() == p.key.to_id() {
                    return;
                }

                match p.value.take() {
                    Some(default) => {
                        *i = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(orig),
                            value: Box::new(Pat::Assign(AssignPat {
                                span: DUMMY_SP,
                                left: Box::new(Pat::Ident(p.key.clone().into())),
                                right: default,
                            })),
                        });
                    }
                    None => {
                        *i = ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: PropName::Ident(orig),
                            value: Box::new(Pat::Ident(p.key.clone().into())),
                        });
                    }
                }
            }

            _ => {
                i.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        if let Prop::Shorthand(ident) = n {
            if let Some(id) = self.map.get(&ident.to_id()) {
                *n = KeyValueProp {
                    key: PropName::Ident(ident.clone()),
                    value: Box::new(Ident::new(id.0.clone(), ident.span.with_ctxt(id.1)).into()),
                }
                .into();
            }

            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(n) = n {
            n.visit_mut_with(self);
        }
    }
}
