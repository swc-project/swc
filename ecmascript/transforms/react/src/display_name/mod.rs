use std::ops::DerefMut;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-display-name`
///
/// Add displayName to React.createClass calls
pub fn display_name() -> impl Fold + VisitMut {
    as_folder(DisplayName)
}

struct DisplayName;

impl VisitMut for DisplayName {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.visit_mut_children_with(self);

        if expr.op != op!("=") {
            return;
        }

        if let Some(Expr::Member(MemberExpr {
            prop,
            computed: false,
            ..
        })) = expr.left.as_expr()
        {
            if let Expr::Ident(ref prop) = &**prop {
                expr.right.visit_mut_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: prop.span,
                        value: prop.sym.clone(),
                        has_escape: false,
                        kind: Default::default(),
                    })))),
                });
                return;
            }
        }

        if let Some(ident) = expr.left.as_ident() {
            expr.right.visit_mut_with(&mut Folder {
                name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                    span: ident.span,
                    value: ident.sym.clone(),
                    has_escape: false,
                    kind: Default::default(),
                })))),
            });
        }
    }

    fn visit_mut_module_decl(&mut self, decl: &mut ModuleDecl) {
        decl.visit_mut_children_with(self);

        match decl {
            ModuleDecl::ExportDefaultExpr(e) => {
                e.visit_mut_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: "input".into(),
                        has_escape: false,
                        kind: Default::default(),
                    })))),
                });
            }
            _ => {}
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        prop.visit_mut_children_with(self);

        match prop {
            Prop::KeyValue(KeyValueProp { key, value }) => {
                value.visit_mut_with(&mut Folder {
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
                        PropName::Num(n) => Box::new(Expr::Lit(Lit::Num(*n))),
                        PropName::BigInt(ref b) => Box::new(Expr::Lit(Lit::BigInt(b.clone()))),
                        PropName::Computed(ref c) => c.expr.clone(),
                    }),
                });
            }
            _ => {}
        }
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        match decl.name {
            Pat::Ident(ref ident) => {
                decl.init.visit_mut_with(&mut Folder {
                    name: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: ident.id.span,
                        value: ident.id.sym.clone(),
                        has_escape: false,
                        kind: StrKind::Normal {
                            contains_quote: false,
                        },
                    })))),
                });
            }
            _ => {}
        }
    }
}

struct Folder {
    name: Option<Box<Expr>>,
}

impl VisitMut for Folder {
    noop_visit_mut_type!();

    /// Don't recurse into array.
    fn visit_mut_array_lit(&mut self, _: &mut ArrayLit) {}

    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        expr.visit_mut_children_with(self);

        if is_create_class_call(&expr) {
            let name = match self.name.take() {
                Some(name) => name,
                None => return,
            };
            add_display_name(expr, name)
        }
    }
    /// Don't recurse into object.
    fn visit_mut_object_lit(&mut self, _: &mut ObjectLit) {}
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

fn add_display_name(call: &mut CallExpr, name: Box<Expr>) {
    let props = match call.args.first_mut() {
        Some(&mut ExprOrSpread { ref mut expr, .. }) => match expr.deref_mut() {
            Expr::Object(ObjectLit { ref mut props, .. }) => props,
            _ => return,
        },
        _ => return,
    };

    for prop in &*props {
        if is_key_display_name(&*prop) {
            return;
        }
    }

    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
        key: PropName::Ident(quote_ident!("displayName")),
        value: name,
    }))));
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
