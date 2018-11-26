use ast::*;
use crate::compat::helpers::Helpers;
use std::{collections::HashSet, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Spanned};

#[cfg(test)]
mod tests;

pub fn duplicate_keys(helpers: Arc<Helpers>) -> impl Fold<Module> {
    DupKeys { helpers }
}

#[derive(Default)]
struct DupKeys {
    helpers: Arc<Helpers>,
}

impl Fold<Expr> for DupKeys {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Object(ObjectLit { span, props }) => {
                let mut folder = PropNameFolder::default();

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
struct PropNameFolder {
    props: HashSet<JsWord>,
}

impl Fold<Prop> for PropNameFolder {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(ident) => {
                //
                if !self.props.insert(ident.sym.clone()) {
                    return Prop::KeyValue(KeyValueProp {
                        key: PropName::Computed(box Expr::Lit(Lit::Str(quote_str!(ident
                            .sym
                            .clone())))),
                        value: box Expr::Ident(ident),
                    });
                } else {
                    Prop::Shorthand(ident)
                }
            }
            _ => prop.fold_children(self),
        }
    }
}

impl Fold<PropName> for PropNameFolder {
    fn fold(&mut self, name: PropName) -> PropName {
        let span = name.span();

        match name {
            PropName::Ident(ident) => {
                if !self.props.insert(ident.sym.clone()) {
                    return PropName::Computed(box Expr::Lit(Lit::Str(Str {
                        span,
                        value: ident.sym.clone(),
                        has_escape: false,
                    })));
                } else {
                    PropName::Ident(ident)
                }
            }
            PropName::Str(s) => {
                if !self.props.insert(s.value.clone()) {
                    return PropName::Computed(box Expr::Lit(Lit::Str(s.clone())));
                } else {
                    PropName::Str(s)
                }
            }
            _ => name,
        }
    }
}
