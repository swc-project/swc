use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_str;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn duplicate_keys() -> impl Fold {
    DuplicateKeys
}

struct DuplicateKeys;

impl Fold for DuplicateKeys {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Object(ObjectLit { span, props }) => {
                let mut folder = PropFolder::default();

                ObjectLit {
                    span,
                    props: props.fold_with(&mut folder),
                }
                .into()
            }
            _ => expr,
        }
    }
}

#[derive(Default)]
struct PropFolder {
    getter_props: HashSet<JsWord>,
    setter_props: HashSet<JsWord>,
}

impl Fold for PropFolder {
    noop_fold_type!();

    fn fold_expr(&mut self, node: Expr) -> Expr {
        node
    }

    fn fold_prop(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(ident) => {
                //
                if !self.getter_props.insert(ident.sym.clone())
                    || !self.setter_props.insert(ident.sym.clone())
                {
                    Prop::KeyValue(KeyValueProp {
                        key: PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: Box::new(Expr::Lit(Lit::Str(quote_str!(ident.sym.clone())))),
                        }),
                        value: Box::new(Expr::Ident(ident)),
                    })
                } else {
                    Prop::Shorthand(ident)
                }
            }

            Prop::Assign(..) => unreachable!("assign property in object literal is invalid"),

            Prop::Getter(..) => prop.fold_children_with(&mut PropNameFolder {
                props: &mut self.getter_props,
            }),
            Prop::Setter(..) => prop.fold_children_with(&mut PropNameFolder {
                props: &mut self.setter_props,
            }),
            _ => {
                let prop = prop.fold_children_with(&mut PropNameFolder {
                    props: &mut self.getter_props,
                });
                prop.fold_children_with(&mut PropNameFolder {
                    props: &mut self.setter_props,
                })
            }
        }
    }
}

struct PropNameFolder<'a> {
    props: &'a mut HashSet<JsWord>,
}
impl<'a> Fold for PropNameFolder<'a> {
    noop_fold_type!();

    fn fold_expr(&mut self, node: Expr) -> Expr {
        node
    }

    fn fold_prop_name(&mut self, name: PropName) -> PropName {
        let span = name.span();

        match name {
            PropName::Ident(ident) => {
                if !self.props.insert(ident.sym.clone()) {
                    PropName::Computed(ComputedPropName {
                        span,
                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                            span,
                            value: ident.sym,
                            has_escape: false,
                            kind: Default::default(),
                        }))),
                    })
                } else {
                    PropName::Ident(ident)
                }
            }
            PropName::Str(s) => {
                if !self.props.insert(s.value.clone()) {
                    PropName::Computed(ComputedPropName {
                        span: s.span,
                        expr: Box::new(Expr::Lit(Lit::Str(s))),
                    })
                } else {
                    PropName::Str(s)
                }
            }
            PropName::Computed(ComputedPropName { span, expr }) => {
                // Computed property might collide
                match *expr {
                    Expr::Lit(Lit::Str(Str { ref value, .. })) => {
                        self.props.insert(value.clone());
                    }
                    _ => {}
                }
                PropName::Computed(ComputedPropName { span, expr })
            }
            _ => name,
        }
    }
}
