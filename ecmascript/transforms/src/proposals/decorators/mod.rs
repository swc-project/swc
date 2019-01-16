use crate::{
    helpers::Helpers,
    util::{alias_ident_for, ExprFactory},
};
use ast::*;
use std::{iter, mem, sync::Arc};
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Mark, DUMMY_SP};

#[cfg(test)]
mod tests;

/// ## Simple class decorator
///
/// ```js
/// 
/// @annotation
/// class MyClass { }
///
/// function annotation(target) {
///    target.annotated = true;
/// }
/// ```
///
/// ## Class decorator
///
/// ```js
/// @isTestable(true)
/// class MyClass { }
///
/// function isTestable(value) {
///    return function decorator(target) {
///       target.isTestable = value;
///    }
/// }
/// ```
///
/// ## Class method decorator
///
/// ```js
/// class C {
///   @enumerable(false)
///   method() { }
/// }
///
/// function enumerable(value) {
///   return function (target, key, descriptor) {
///      descriptor.enumerable = value;
///      return descriptor;
///   }
/// }
/// ```
pub fn decorators(helpers: Arc<Helpers>) -> impl Fold<Module> {
    Decorators { helpers }
}

struct Decorators {
    helpers: Arc<Helpers>,
}

impl Fold<Stmt> for Decorators {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            Stmt::Decl(Decl::Class(ClassDecl {
                ident,
                declare: false,
                mut class,
            })) => {
                if class.decorators.is_empty() {
                    return Stmt::Decl(Decl::Class(ClassDecl {
                        ident,
                        declare: false,
                        class,
                    }));
                }
                let mark = Mark::fresh(Mark::root());
                let initialize = quote_ident!(DUMMY_SP.apply_mark(mark), "_initialize");
                let super_class_ident = match class.super_class {
                    Some(ref expr) => Some(alias_ident_for(expr, "_Super")),
                    None => None,
                };
                let super_class_expr = class.super_class;
                class.super_class = super_class_ident.clone().map(|i| box Expr::Ident(i));

                {
                    let initialize_call = Stmt::Expr(box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: initialize.clone().as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                        type_args: Default::default(),
                    }));

                    // Inject initialize
                    let pos = class.body.iter().position(|member| match *member {
                        ClassMember::Constructor(Constructor { body: Some(..), .. }) => true,
                        _ => false,
                    });

                    match pos {
                        Some(pos) => match class.body[pos] {
                            ClassMember::Constructor(ref mut c) => match c.body {
                                Some(ref mut body) => {
                                    // inject _initialize(this) after **all** super call

                                    let mut injector = InitializeInjector { initialize_call };
                                    let stmts = mem::replace(&mut body.stmts, vec![]);
                                    body.stmts = stmts.fold_with(&mut injector)
                                }
                                None => unreachable!(),
                            },
                            _ => unreachable!(),
                        },
                        None => {
                            class.body.push(ClassMember::Constructor(Constructor {
                                span: DUMMY_SP,
                                key: PropName::Ident(quote_ident!("constructor")),
                                is_optional: false,
                                accessibility: Default::default(),
                                params: vec![],
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![initialize_call],
                                }),
                            }));
                        }
                    }
                };

                let decorate_call = box Expr::Call(make_decorate_call(
                    class.decorators,
                    iter::once({
                        // function(_initialize) {}
                        FnExpr {
                            ident: None,
                            function: Function {
                                span: DUMMY_SP,

                                params: iter::once(Pat::Ident(initialize.clone()))
                                    .chain(super_class_ident.map(Pat::Ident))
                                    .collect(),

                                decorators: Default::default(),
                                is_async: false,
                                is_generator: false,

                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![
                                        // 'use strict';
                                        Stmt::Expr(box Expr::Lit(Lit::Str(quote_str!(
                                            "use strict"
                                        )))),
                                        Stmt::Decl(Decl::Class(ClassDecl {
                                            ident: ident.clone(),
                                            class: Class {
                                                decorators: Default::default(),
                                                ..class
                                            },
                                            declare: false,
                                        })),
                                        Stmt::Return(ReturnStmt {
                                            span: DUMMY_SP,
                                            arg: Some(box Expr::Object(ObjectLit {
                                                span: DUMMY_SP,
                                                props: vec![
                                                    PropOrSpread::Prop(box Prop::KeyValue(
                                                        KeyValueProp {
                                                            key: PropName::Ident(quote_ident!("F")),
                                                            value: box Expr::Ident(ident.clone()),
                                                        },
                                                    )),
                                                    PropOrSpread::Prop(box Prop::KeyValue(
                                                        KeyValueProp {
                                                            key: PropName::Ident(quote_ident!("d")),
                                                            value: box Expr::Array(ArrayLit {
                                                                span: DUMMY_SP,
                                                                elems: vec![],
                                                            }),
                                                        },
                                                    )),
                                                ],
                                            })),
                                        }),
                                    ],
                                }),

                                return_type: Default::default(),
                                type_params: Default::default(),
                            },
                        }
                        .as_arg()
                    })
                    .chain(super_class_expr.map(|e| e.as_arg())),
                ));

                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(ident),
                        definite: false,
                        init: Some(decorate_call),
                    }],
                }))
            }
            _ => stmt,
        }
    }
}

fn make_decorate_call(
    decorators: Vec<Decorator>,
    args: impl Iterator<Item = ExprOrSpread>,
) -> CallExpr {
    CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, babelHelpers.decorate).as_callee(),
        args: iter::once(
            ArrayLit {
                span: DUMMY_SP,
                elems: decorators
                    .into_iter()
                    .map(|dec| Some(dec.expr.as_arg()))
                    .collect(),
            }
            .as_arg(),
        )
        .chain(args)
        .collect(),
        type_args: Default::default(),
    }
}

struct InitializeInjector {
    initialize_call: Stmt,
}

impl Fold<Vec<Stmt>> for InitializeInjector {
    fn fold(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        let stmts = stmts.fold_children(self);

        stmts.move_flat_map(|stmt| match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => iter::once(stmt).chain(Some(self.initialize_call.clone())),
            _ => iter::once(stmt).chain(None),
        })
    }
}

impl Fold<Function> for InitializeInjector {
    fn fold(&mut self, n: Function) -> Function {
        n
    }
}
