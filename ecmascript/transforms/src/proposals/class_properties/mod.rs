use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::sync::Arc;
use swc_common::{Fold, FoldWith, Mark, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn class_properties(helpers: Arc<Helpers>) -> impl Pass + Clone {
    ClassProperties {
        helpers,
        marker: Mark::fresh(Mark::root()),
    }
}

#[derive(Clone)]
struct ClassProperties {
    helpers: Arc<Helpers>,
    marker: Mark,
}

impl<T: StmtLike> Fold<Vec<T>> for ClassProperties
where
    T: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match T::try_into_stmt(stmt) {
                Err(node) => buf.push(node.fold_with(self)),
                Ok(stmt) => {
                    let stmt = stmt.fold_children(self);
                    // Fold class
                    match stmt {
                        Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare: false,
                        })) => {
                            let stmts = self.fold_class(ident.clone(), class);
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
    fn fold_class(&mut self, ident: Ident, class: Class) -> Vec<Stmt> {
        let has_super = class.super_class.is_some();

        let (mut constructor_stmts, mut extra_stmts, mut members, mut constructor) =
            (vec![], vec![], vec![], None);

        for member in class.body {
            match member {
                ClassMember::PrivateMethod(..)
                | ClassMember::Method(..)
                | ClassMember::TsIndexSignature(..) => members.push(member),

                ClassMember::ClassProp(prop) => {
                    if prop.value.is_none() {
                        continue;
                    }

                    if prop.is_static {
                        unimplemented!("static property")
                    } else {
                        self.helpers.define_property();
                        constructor_stmts.push(Stmt::Expr(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("_defineProperty").as_callee(),
                            args: vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                match *prop.key {
                                    Expr::Ident(i) => Lit::Str(Str {
                                        span: i.span,
                                        value: i.sym,
                                        has_escape: false,
                                    })
                                    .as_arg(),
                                    _ => prop.key.as_arg(),
                                },
                                prop.value.unwrap().as_arg(),
                            ],
                            type_args: Default::default(),
                        })));
                    }
                }
                ClassMember::PrivateProp(prop) => {
                    if prop.value.is_none() {
                        continue;
                    }

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
                                                value: prop.value.unwrap(),
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

        let mut constructor = constructor.unwrap_or_else(|| Constructor {
            span: DUMMY_SP,
            key: PropName::Ident(quote_ident!("constructor")),
            accessibility: Default::default(),
            is_optional: false,
            params: if has_super {
                vec![PatOrTsParamProp::Pat(Pat::Rest(RestPat {
                    dot3_token: DUMMY_SP,
                    arg: box Pat::Ident(quote_ident!("args")),
                    type_ann: Default::default(),
                }))]
            } else {
                vec![]
            },
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: if has_super {
                    vec![Stmt::Expr(box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: ExprOrSuper::Super(DUMMY_SP),
                        args: vec![ExprOrSpread {
                            spread: Some(DUMMY_SP),
                            expr: box Expr::Ident(quote_ident!("args")),
                        }],
                        type_args: Default::default(),
                    }))]
                } else {
                    vec![]
                },
            }),
        });
        constructor
            .body
            .as_mut()
            .unwrap()
            .stmts
            .append(&mut constructor_stmts);

        members.push(ClassMember::Constructor(constructor));

        extra_stmts.insert(
            0,
            Stmt::Decl(Decl::Class(ClassDecl {
                ident: ident.clone(),
                declare: false,
                class: Class {
                    body: members,
                    ..class
                },
            })),
        );

        extra_stmts
    }
}
