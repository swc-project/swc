use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::quote_str;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn duplicate_keys() -> impl Fold + VisitMut {
    as_folder(DuplicateKeys)
}

struct DuplicateKeys;

#[swc_trace]
impl VisitMut for DuplicateKeys {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Object(ObjectLit { props, .. }) = expr {
            let mut folder = PropFolder::default();
            props.visit_mut_with(&mut folder);
        }
    }
}

#[derive(Default)]
struct PropFolder {
    getter_props: AHashSet<JsWord>,
    setter_props: AHashSet<JsWord>,
}

#[swc_trace]
impl VisitMut for PropFolder {
    noop_visit_mut_type!();

    /// Noop
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        match prop {
            Prop::Shorthand(ident) => {
                //
                if !self.getter_props.insert(ident.sym.clone())
                    || !self.setter_props.insert(ident.sym.clone())
                {
                    *prop = Prop::KeyValue(KeyValueProp {
                        key: PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: quote_str!(ident.sym.clone()).into(),
                        }),
                        value: Box::new(Expr::Ident(ident.clone())),
                    })
                }
            }

            Prop::Assign(..) => unreachable!("assign property in object literal is invalid"),

            Prop::Getter(..) => prop.visit_mut_children_with(&mut PropNameFolder {
                props: &mut self.getter_props,
            }),
            Prop::Setter(..) => prop.visit_mut_children_with(&mut PropNameFolder {
                props: &mut self.setter_props,
            }),
            _ => {
                prop.visit_mut_children_with(&mut PropNameFolder {
                    props: &mut self.getter_props,
                });
                prop.visit_mut_children_with(&mut PropNameFolder {
                    props: &mut self.setter_props,
                })
            }
        }
    }
}

struct PropNameFolder<'a> {
    props: &'a mut AHashSet<JsWord>,
}

#[swc_trace]
impl<'a> VisitMut for PropNameFolder<'a> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    fn visit_mut_prop_name(&mut self, name: &mut PropName) {
        let span = name.span();

        match name {
            PropName::Ident(ident) => {
                if !self.props.insert(ident.sym.clone()) {
                    *name = PropName::Computed(ComputedPropName {
                        span,
                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                            span,
                            raw: None,
                            value: ident.sym.clone(),
                        }))),
                    })
                }
            }
            PropName::Str(s) => {
                if !self.props.insert(s.value.clone()) {
                    *name = PropName::Computed(ComputedPropName {
                        span: s.span,
                        expr: s.clone().into(),
                    })
                }
            }
            PropName::Computed(ComputedPropName { expr, .. }) => {
                // Computed property might collide
                if let Expr::Lit(Lit::Str(Str { ref value, .. })) = &**expr {
                    self.props.insert(value.clone());
                }
            }
            _ => {}
        }
    }
}
