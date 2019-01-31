use crate::pass::Pass;
use ast::*;
use fnv::FnvHashSet;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Spanned};

#[cfg(test)]
mod tests;

pub fn duplicate_keys() -> impl Pass + Clone + Copy {
    DuplicateKeys
}

#[derive(Default, Clone, Copy)]
struct DuplicateKeys;

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
    getter_props: FnvHashSet<JsWord>,
    setter_props: FnvHashSet<JsWord>,
}

impl Fold<Prop> for PropFolder {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(ident) => {
                //
                if !self.getter_props.insert(ident.sym.clone())
                    || !self.setter_props.insert(ident.sym.clone())
                {
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
    props: &'a mut FnvHashSet<JsWord>,
}

impl<'a> Fold<PropName> for PropNameFolder<'a> {
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
            PropName::Computed(box expr) => {
                // Computed property might collide
                match expr {
                    Expr::Lit(Lit::Str(Str { ref value, .. })) => {
                        self.props.insert(value.clone());
                    }
                    _ => {}
                }
                PropName::Computed(box expr)
            }
            _ => name,
        }
    }
}
