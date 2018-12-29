use ast::*;
use swc_common::{Fold, FoldWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-display-name`
///
/// Add displayName to React.createClass calls
pub fn display_name() -> impl Fold<Module> {
    DisplayName
}

struct DisplayName;

impl Fold<VarDeclarator> for DisplayName {
    fn fold(&mut self, decl: VarDeclarator) -> VarDeclarator {
        match decl.name {
            Pat::Ident(ref ident) => {
                let init = decl.init.fold_with(&mut Folder {
                    name: Some(box Expr::Lit(Lit::Str(Str {
                        span: ident.span,
                        value: ident.sym.clone(),
                        has_escape: false,
                    }))),
                });

                return VarDeclarator { init, ..decl };
            }
            _ => decl,
        }
    }
}

impl Fold<AssignExpr> for DisplayName {
    fn fold(&mut self, expr: AssignExpr) -> AssignExpr {
        let expr = expr.fold_children(self);

        if expr.op != op!("=") {
            return expr;
        }

        match expr.left {
            PatOrExpr::Pat(box Pat::Ident(ref ident))
            | PatOrExpr::Expr(box Expr::Ident(ref ident)) => {
                let right = expr.right.fold_with(&mut Folder {
                    name: Some(box Expr::Lit(Lit::Str(Str {
                        span: ident.span,
                        value: ident.sym.clone(),
                        has_escape: false,
                    }))),
                });

                return AssignExpr { right, ..expr };
            }
            _ => expr,
        }
    }
}

impl Fold<Prop> for DisplayName {
    fn fold(&mut self, prop: Prop) -> Prop {
        let prop = prop.fold_children(self);

        match prop {
            Prop::KeyValue(KeyValueProp { key, value }) => {
                let value = value.fold_with(&mut Folder {
                    name: Some(match key {
                        PropName::Ident(ref i) => box Expr::Lit(Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                        })),
                        PropName::Str(ref s) => box Expr::Lit(Lit::Str(s.clone())),
                        PropName::Num(n) => box Expr::Lit(Lit::Num(n)),
                        PropName::Computed(ref expr) => expr.clone(),
                    }),
                });

                Prop::KeyValue(KeyValueProp { key, value })
            }
            _ => prop,
        }
    }
}

struct Folder {
    name: Option<Box<Expr>>,
}

impl Fold<ObjectLit> for Folder {
    /// Don't recurse into object.
    fn fold(&mut self, node: ObjectLit) -> ObjectLit {
        node
    }
}
impl Fold<ArrayLit> for Folder {
    /// Don't recurse into array.
    fn fold(&mut self, node: ArrayLit) -> ArrayLit {
        node
    }
}

impl Fold<Expr> for Folder {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Call(call) => {
                if is_create_class_call(&call) {
                    let name = match self.name.take() {
                        Some(name) => name,
                        None => return Expr::Call(call),
                    };
                    Expr::Call(add_display_name(call, name))
                } else {
                    Expr::Call(call)
                }
            }
            _ => expr,
        }
    }
}

fn is_create_class_call(call: &CallExpr) -> bool {
    match call.callee {
        ExprOrSuper::Expr(box Expr::Member(MemberExpr {
            obj:
                ExprOrSuper::Expr(box Expr::Ident(Ident {
                    sym: js_word!("React"),
                    ..
                })),
            prop:
                box Expr::Ident(Ident {
                    sym: js_word!("createClass"),
                    ..
                }),
            computed: false,
            ..
        }))
        | ExprOrSuper::Expr(box Expr::Ident(Ident {
            sym: js_word!("createReactClass"),
            ..
        })) => true,
        _ => false,
    }
}

fn add_display_name(mut call: CallExpr, name: Box<Expr>) -> CallExpr {
    let props = match call.args.first_mut() {
        Some(&mut ExprOrSpread {
            expr: box Expr::Object(ObjectLit { ref mut props, .. }),
            ..
        }) => props,
        _ => return call,
    };

    for prop in &*props {
        if is_key_display_name(&*prop) {
            return call;
        }
    }

    props.push(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
        key: PropName::Ident(quote_ident!("displayName")),
        value: name,
    })));

    call
}

fn is_key_display_name(prop: &PropOrSpread) -> bool {
    match *prop {
        PropOrSpread::Prop(ref prop) => match **prop {
            Prop::Shorthand(ref i) => &*i.sym == "displayName",
            Prop::Method(MethodProp { ref key, .. })
            | Prop::Getter(GetterProp { ref key, .. })
            | Prop::Setter(SetterProp { ref key, .. })
            | Prop::KeyValue(KeyValueProp { ref key, .. }) => match *key {
                PropName::Ident(ref i) => &*i.sym == "displayName",
                PropName::Str(ref s) => &*s.value == "displayName",
                PropName::Num(..) => false,
                PropName::Computed(..) => false,
            },
            Prop::Assign(..) => unreachable!("invalid syntax"),
        },
        _ => false,
        // TODO(kdy1): maybe.. handle spead
    }
}
