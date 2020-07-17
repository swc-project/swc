use std::collections::HashSet;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

pub fn duplicate_keys() -> impl Fold {
    DuplicateKeys
}

struct DuplicateKeys;

noop_fold_type!(DuplicateKeys);

impl Fold<Expr> for DuplicateKeys {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

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

noop_fold_type!(PropFolder);

impl Fold<Expr> for PropFolder {
    fn fold(&mut self, node: Expr) -> Expr {
        node
    }
}

impl Fold<Prop> for PropFolder {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(ident) => {
                //
                if !self.getter_props.insert(ident.sym.clone())
                    || !self.setter_props.insert(ident.sym.clone())
                {
                    Prop::KeyValue(KeyValueProp {
                        key: PropName::Computed(ComputedPropName {
                            span: ident.span,
                            expr: box Expr::Lit(Lit::Str(quote_str!(ident.sym.clone()))),
                        }),
                        value: box Expr::Ident(ident),
                    })
                } else {
                    Prop::Shorthand(ident)
                }
            }

            Prop::Assign(..) => unreachable!("assign property in object literal is invalid"),

            Prop::Getter(..) => prop.fold_children(&mut PropNameFolder {
                props: &mut self.getter_props,
            }),
            Prop::Setter(..) => prop.fold_children(&mut PropNameFolder {
                props: &mut self.setter_props,
            }),
            _ => {
                let prop = prop.fold_children(&mut PropNameFolder {
                    props: &mut self.getter_props,
                });
                prop.fold_children(&mut PropNameFolder {
                    props: &mut self.setter_props,
                })
            }
        }
    }
}

struct PropNameFolder<'a> {
    props: &'a mut HashSet<JsWord>,
}
impl<'a> Fold<Expr> for PropNameFolder<'a> {
    fn fold(&mut self, node: Expr) -> Expr {
        node
    }
}

impl<'a> Fold<PropName> for PropNameFolder<'a> {
    fn fold(&mut self, name: PropName) -> PropName {
        let span = name.span();

        match name {
            PropName::Ident(ident) => {
                if !self.props.insert(ident.sym.clone()) {
                    PropName::Computed(ComputedPropName {
                        span,
                        expr: box Expr::Lit(Lit::Str(Str {
                            span,
                            value: ident.sym,
                            has_escape: false,
                        })),
                    })
                } else {
                    PropName::Ident(ident)
                }
            }
            PropName::Str(s) => {
                if !self.props.insert(s.value.clone()) {
                    PropName::Computed(ComputedPropName {
                        span: s.span,
                        expr: box Expr::Lit(Lit::Str(s)),
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
