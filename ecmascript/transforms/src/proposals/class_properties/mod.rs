use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{alias_ident_for, default_constructor, ExprFactory, ModuleItemLike, StmtLike},
};
use ast::*;
use std::{iter, sync::Arc};
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Mark, DUMMY_SP};

#[cfg(test)]
mod tests;

///
///
///
///
/// # Impl note
///
/// We use custom helper to handle export defaul class
pub fn class_properties(helpers: Arc<Helpers>) -> impl Pass + Clone {
    ClassProperties {
        helpers,
        mark: Mark::fresh(Mark::root()),
    }
}

#[derive(Clone)]
struct ClassProperties {
    helpers: Arc<Helpers>,
    mark: Mark,
}

impl<T> Fold<Vec<T>> for ClassProperties
where
    T: StmtLike + ModuleItemLike + FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match T::try_into_stmt(stmt) {
                Err(node) => match node.try_into_module_decl() {
                    Ok(decl) => {
                        let decl = decl.fold_children(self);

                        match decl {
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl::Class(
                                ClassExpr {
                                    ident: Some(ident),
                                    class,
                                },
                            )) => {
                                let (vars, decl, stmts) = self.fold_class(ident.clone(), class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(T::from_stmt(Stmt::Decl(decl)));
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportNamed(
                                        NamedExport {
                                            span: DUMMY_SP,
                                            specifiers: vec![ExportSpecifier {
                                                span: DUMMY_SP,
                                                orig: ident,
                                                exported: Some(quote_ident!("default")),
                                            }],
                                            src: None,
                                        },
                                    )) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                            }
                            ModuleDecl::ExportDecl(Decl::Class(ClassDecl {
                                ident,
                                declare: false,
                                class,
                            })) => {
                                let (vars, decl, stmts) = self.fold_class(ident, class);
                                if !vars.is_empty() {
                                    buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vars,
                                        declare: false,
                                    }))));
                                }
                                buf.push(
                                    match T::try_from_module_decl(ModuleDecl::ExportDecl(decl)) {
                                        Ok(t) => t,
                                        Err(..) => unreachable!(),
                                    },
                                );
                                buf.extend(stmts.into_iter().map(T::from_stmt));
                            }
                            _ => buf.push(match T::try_from_module_decl(decl) {
                                Ok(t) => t,
                                Err(..) => unreachable!(),
                            }),
                        };
                    }
                    Err(..) => unreachable!(),
                },
                Ok(stmt) => {
                    let stmt = stmt.fold_children(self);
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let (vars, decl, stmts) = self.fold_class(ident, class);
                            if !vars.is_empty() {
                                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: vars,
                                    declare: false,
                                }))));
                            }
                            buf.push(T::from_stmt(Stmt::Decl(decl)));
                            buf.extend(stmts.into_iter().map(T::from_stmt));
                        }
                        _ => buf.push(T::from_stmt(stmt)),
                    }
                }
            }
        }

        buf
    }
}

impl ClassProperties {
    fn fold_class(&mut self, ident: Ident, class: Class) -> (Vec<VarDeclarator>, Decl, Vec<Stmt>) {
        let has_super = class.super_class.is_some();

        let (mut constructor_stmts, mut vars, mut extra_stmts, mut members, mut constructor) =
            (vec![], vec![], vec![], vec![], None);

        for member in class.body {
            match member {
                ClassMember::PrivateMethod(..) | ClassMember::TsIndexSignature(..) => {
                    members.push(member)
                }

                ClassMember::Method(method) => {
                    // we handle computed key here to preserve the execution order
                    let key = match method.key {
                        PropName::Computed(expr) => {
                            let ident =
                                quote_ident!(DUMMY_SP.apply_mark(Mark::fresh(self.mark)), "tmp");
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone()),
                                init: Some(expr),
                                definite: false,
                            });
                            // We use computed because `classes` pass converts PropName::Ident to
                            // string.
                            PropName::Computed(box Expr::Ident(ident))
                        }
                        _ => method.key,
                    };
                    members.push(ClassMember::Method(Method { key, ..method }))
                }

                ClassMember::ClassProp(prop) => {
                    let key = match *prop.key {
                        Expr::Ident(ref i) if !prop.computed => Lit::Str(Str {
                            span: i.span,
                            value: i.sym.clone(),
                            has_escape: false,
                        })
                        .as_arg(),

                        _ => {
                            let mut ident = alias_ident_for(&prop.key, "_ref");
                            ident.span = ident.span.apply_mark(Mark::fresh(self.mark));
                            // Handle computed property
                            vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident.clone()),
                                init: Some(prop.key),
                                definite: false,
                            });
                            ident.as_arg()
                        }
                    };
                    let value = match prop.value {
                        Some(v) => v.as_arg(),
                        _ => quote_ident!("undefined").as_arg(),
                    };
                    self.helpers.define_property();
                    let callee = quote_ident!("_defineProperty").as_callee();

                    if prop.is_static {
                        extra_stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee,
                            args: vec![ident.clone().as_arg(), key, value],
                            type_args: Default::default(),
                        })))
                    } else {
                        constructor_stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee,
                            args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), key, value],
                            type_args: Default::default(),
                        })));
                    }
                }
                ClassMember::PrivateProp(prop) => {
                    let value = match prop.value {
                        Some(v) => v,
                        _ => box quote_ident!("undefined").into(),
                    };

                    if prop.is_static {
                        extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                definite: false,
                                name: Pat::Ident(ident.clone()),
                                init: Some(if prop.is_static {
                                    box Expr::New(NewExpr {
                                        span: DUMMY_SP,
                                        callee: box Expr::Ident(quote_ident!("WeakMap")),
                                        args: Some(vec![]),
                                        type_args: Default::default(),
                                    })
                                } else {
                                    box Expr::Object(ObjectLit {
                                        span: DUMMY_SP,
                                        props: vec![
                                            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value: box Expr::Lit(Lit::Bool(Bool {
                                                    span: DUMMY_SP,
                                                    value: true,
                                                })),
                                            })),
                                            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                                key: PropName::Ident(quote_ident!("value")),
                                                value,
                                            })),
                                        ],
                                    })
                                }),
                            }],
                        })));
                    //TODO: constructor_stmts.push()
                    } else {

                    }
                }

                ClassMember::Constructor(c) => constructor = Some(c),
            }
        }

        let mut constructor = constructor.unwrap_or_else(|| default_constructor(has_super));
        dbg!(constructor_stmts.len());
        {
            // Allow using super multiple time
            let mut folder = DefinePropertyInjector {
                constructor_stmts,
                injected: false,
            };
            constructor.body = constructor.body.fold_with(&mut folder);

            if !folder.injected {
                // there was no super() call
                constructor
                    .body
                    .as_mut()
                    .unwrap()
                    .stmts
                    .append(&mut folder.constructor_stmts)
            }
        }

        members.push(ClassMember::Constructor(constructor));

        (
            vars,
            Decl::Class(ClassDecl {
                ident: ident.clone(),
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            }),
            extra_stmts,
        )
    }
}

struct DefinePropertyInjector {
    injected: bool,
    constructor_stmts: Vec<Stmt>,
}

impl Fold<Vec<Stmt>> for DefinePropertyInjector {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let stmts = stmts.fold_children(self);

        stmts.move_flat_map(|stmt| match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => {
                self.injected = true;
                iter::once(stmt).chain(self.constructor_stmts.clone())
            }
            _ => iter::once(stmt).chain(vec![]),
        })
    }
}

impl Fold<Function> for DefinePropertyInjector {
    fn fold(&mut self, n: Function) -> Function {
        n
    }
}
