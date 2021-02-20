use std::ops::DerefMut;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::AsOptExpr;
use swc_ecma_transforms_base::ext::PatOrExprExt;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-display-name`
///
/// Add displayName to React.createClass calls
pub fn display_name() -> impl Fold {
    DisplayName
}

struct DisplayName;

impl Fold for DisplayName {
    noop_fold_type!();

    fn fold_assign_expr(&mut self, expr: AssignExpr) -> AssignExpr {
        let expr = expr.fold_children_with(self);

        if expr.op != op!("=") {
            return expr;
        }

        if let Some(Expr::Member(MemberExpr {
            prop,
            computed: false,
            ..
        })) = expr.left.as_expr()
        {
            if let Expr::Ident(ref prop) = &**prop {
                let right = expr.right.fold_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: prop.span,
                        value: prop.sym.clone(),
                        has_escape: false,
                        kind: Default::default(),
                    })))),
                });
                return AssignExpr { right, ..expr };
            }
        }

        if let Some(ident) = expr.left.as_ident() {
            let right = expr.right.fold_with(&mut Folder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: ident.span,
                    value: ident.sym.clone(),
                    has_escape: false,
                    kind: Default::default(),
                })))),
            });

            return AssignExpr { right, ..expr };
        }

        expr
    }

    fn fold_module_decl(&mut self, decl: ModuleDecl) -> ModuleDecl {
        let decl = decl.fold_children_with(self);

        match decl {
            ModuleDecl::ExportDefaultExpr(e) => {
                ModuleDecl::ExportDefaultExpr(e.fold_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: "input".into(),
                        has_escape: false,
                        kind: Default::default(),
                    })))),
                }))
            }
            _ => decl,
        }
    }

    fn fold_prop(&mut self, prop: Prop) -> Prop {
        let prop = prop.fold_children_with(self);

        match prop {
            Prop::KeyValue(KeyValueProp { key, value }) => {
                let value = value.fold_with(&mut Folder {
                    name: Some(match key {
                        PropName::Ident(ref i) => Box::new(Expr::Lit(Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                            kind: StrKind::Normal {
                                contains_quote: false,
                            },
                        }))),
                        PropName::Str(ref s) => Box::new(Expr::Lit(Lit::Str(s.clone()))),
                        PropName::Num(n) => Box::new(Expr::Lit(Lit::Num(n))),
                        PropName::BigInt(ref b) => Box::new(Expr::Lit(Lit::BigInt(b.clone()))),
                        PropName::Computed(ref c) => c.expr.clone(),
                    }),
                });

                Prop::KeyValue(KeyValueProp { key, value })
            }
            _ => prop,
        }
    }
    fn fold_var_declarator(&mut self, decl: VarDeclarator) -> VarDeclarator {
        match decl.name {
            Pat::Ident(ref ident) => {
                let init = decl.init.fold_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: ident.id.span,
                        value: ident.id.sym.clone(),
                        has_escape: false,
                        kind: StrKind::Normal {
                            contains_quote: false,
                        },
                    })))),
                });

                VarDeclarator { init, ..decl }
            }
            _ => decl,
        }
    }
}

struct Folder {
    name: Option<Box<Expr>>,
}

impl Fold for Folder {
    noop_fold_type!();

    /// Don't recurse into array.
    fn fold_array_lit(&mut self, node: ArrayLit) -> ArrayLit {
        node
    }

    fn fold_call_expr(&mut self, expr: CallExpr) -> CallExpr {
        let expr = expr.fold_children_with(self);

        if is_create_class_call(&expr) {
            let name = match self.name.take() {
                Some(name) => name,
                None => return expr,
            };
            add_display_name(expr, name)
        } else {
            expr
        }
    }
    /// Don't recurse into object.
    fn fold_object_lit(&mut self, node: ObjectLit) -> ObjectLit {
        node
    }
}

fn is_create_class_call(call: &CallExpr) -> bool {
    let callee = match &call.callee {
        ExprOrSuper::Super(_) => return false,
        ExprOrSuper::Expr(callee) => &**callee,
    };

    match callee {
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            prop,
            computed: false,
            ..
        }) => match &**obj {
            Expr::Ident(Ident {
                sym: js_word!("React"),
                ..
            }) => match &**prop {
                Expr::Ident(Ident {
                    sym: js_word!("createClass"),
                    ..
                }) => return true,
                _ => {}
            },
            _ => {}
        },
        Expr::Ident(Ident {
            sym: js_word!("createReactClass"),
            ..
        }) => return true,
        _ => {}
    }

    false
}

fn add_display_name(mut call: CallExpr, name: Box<Expr>) -> CallExpr {
    let props = match call.args.first_mut() {
        Some(&mut ExprOrSpread { ref mut expr, .. }) => match expr.deref_mut() {
            Expr::Object(ObjectLit { ref mut props, .. }) => props,
            _ => return call,
        },
        _ => return call,
    };

    for prop in &*props {
        if is_key_display_name(&*prop) {
            return call;
        }
    }

    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
        key: PropName::Ident(quote_ident!("displayName")),
        value: name,
    }))));

    call
}

fn is_key_display_name(prop: &PropOrSpread) -> bool {
    match *prop {
        PropOrSpread::Prop(ref prop) => match **prop {
            Prop::Shorthand(ref i) => i.sym == js_word!("displayName"),
            Prop::Method(MethodProp { ref key, .. })
            | Prop::Getter(GetterProp { ref key, .. })
            | Prop::Setter(SetterProp { ref key, .. })
            | Prop::KeyValue(KeyValueProp { ref key, .. }) => match *key {
                PropName::Ident(ref i) => i.sym == js_word!("displayName"),
                PropName::Str(ref s) => s.value == js_word!("displayName"),
                PropName::Num(..) => false,
                PropName::BigInt(..) => false,
                PropName::Computed(..) => false,
            },
            Prop::Assign(..) => unreachable!("invalid syntax"),
        },
        _ => false,
        // TODO(kdy1): maybe.. handle spread
    }
}
