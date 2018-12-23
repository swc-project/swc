use crate::{
    compat::helpers::Helpers,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-async-to-generator`
///
/// ## In
///
/// ```js
/// async function foo() {
///   await bar();
/// }
/// ```
///
/// ## Out
///
/// ```js
/// var _asyncToGenerator = function (fn) {
///   ...
/// };
/// var foo = _asyncToGenerator(function* () {
///   yield bar();
/// });
/// ```
pub fn async_to_generator(helpers: Arc<Helpers>) -> impl Fold<Module> {
    AsyncToGenerator {
        helpers,
        ..Default::default()
    }
}

#[derive(Default)]
struct AsyncToGenerator {
    helpers: Arc<Helpers>,
}
struct Actual {
    helpers: Arc<Helpers>,
    extra_stmts: Vec<Stmt>,
}

impl<T: StmtLike> Fold<Vec<T>> for AsyncToGenerator
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut actual = Actual {
                        helpers: self.helpers.clone(),
                        extra_stmts: vec![],
                    };
                    let stmt = stmt.fold_with(&mut actual);

                    buf.extend(actual.extra_stmts.into_iter().map(T::from_stmt));
                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}

impl Fold<ClassMethod> for Actual {
    fn fold(&mut self, m: ClassMethod) -> ClassMethod {
        if m.kind != ClassMethodKind::Method || !m.function.is_async {
            return m;
        }
        let params = m.function.params.clone();

        let expr = make_fn_ref(
            &self.helpers,
            FnExpr {
                ident: None,
                function: m.function,
            },
        );
        ClassMethod {
            function: Function {
                span: m.span,
                is_async: false,
                is_generator: false,
                params,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: expr.as_callee(),
                            args: vec![],
                        })),
                    })],
                },
            },
            ..m
        }
    }
}

impl Fold<Expr> for Actual {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            // Optimization for iife.
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::Fn(fn_expr)),
                args,
            }) => {
                if !args.is_empty() || !fn_expr.function.is_async {
                    return Expr::Call(CallExpr {
                        span,
                        callee: ExprOrSuper::Expr(box Expr::Fn(fn_expr)),
                        args,
                    });
                }

                return make_fn_ref(&self.helpers, fn_expr);
            }
            _ => {}
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Fn(
                expr @ FnExpr {
                    function: Function { is_async: true, .. },
                    ..
                },
            ) => {
                let function = self.fold_fn(expr.ident.clone(), expr.function, false);
                let body = BlockStmt {
                    span: DUMMY_SP,
                    stmts: self
                        .extra_stmts
                        .drain(..)
                        .chain(function.body.stmts)
                        .collect(),
                };

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Expr::Fn(FnExpr {
                        ident: None,
                        function: Function { body, ..function },
                    })
                    .as_callee(),
                    args: vec![],
                })
            }
            _ => expr,
        }
    }
}

impl Fold<FnDecl> for Actual {
    fn fold(&mut self, f: FnDecl) -> FnDecl {
        let f = f.fold_children(self);
        if !f.function.is_async {
            return f;
        }

        let function = self.fold_fn(Some(f.ident.clone()), f.function, true);
        FnDecl {
            ident: f.ident,
            function,
        }
    }
}

impl Actual {
    #[inline(always)]
    fn fold_fn(&mut self, raw_ident: Option<Ident>, f: Function, is_decl: bool) -> Function {
        let span = f.span();
        let params = f.params.clone();
        let ident = raw_ident.clone().unwrap_or_else(|| quote_ident!("ref"));

        let mark = Mark::fresh(Mark::root());
        let real_fn_ident = quote_ident!(ident.span.apply_mark(mark), format!("_{}", ident.sym));
        let right = make_fn_ref(
            &self.helpers,
            FnExpr {
                ident: None,
                function: f,
            },
        );

        if is_decl {
            let real_fn = FnDecl {
                ident: real_fn_ident.clone(),
                function: Function {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            Stmt::Expr(box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(real_fn_ident.clone())),
                                op: op!("="),
                                right: box right,
                            })),
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(box real_fn_ident.clone().apply(
                                    DUMMY_SP,
                                    box ThisExpr { span: DUMMY_SP }.into(),
                                    vec![quote_ident!("arguments").as_arg()],
                                )),
                            }),
                        ],
                    },
                    params: vec![],
                    is_async: false,
                    is_generator: false,
                },
            };
            self.extra_stmts.push(Stmt::Decl(Decl::Fn(real_fn)));
        } else {
            self.extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(real_fn_ident.clone()),
                    init: Some(box right),
                }],
            })));
        }

        let apply = Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(box real_fn_ident.apply(
                DUMMY_SP,
                box Expr::This(ThisExpr { span: DUMMY_SP }),
                vec![quote_ident!("arguments").as_arg()],
            )),
        });
        Function {
            span,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: if is_decl {
                    vec![apply]
                } else {
                    vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box Expr::Fn(FnExpr {
                            ident: raw_ident,
                            function: Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                params: vec![],
                                body: BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![apply],
                                },
                            },
                        })),
                    })]
                },
            },
            params: params.clone(),
            is_generator: false,
            is_async: false,
        }
    }
}

struct AwaitToYield;

impl Fold<Function> for AwaitToYield {
    /// Don't recurse into function.
    fn fold(&mut self, f: Function) -> Function {
        f
    }
}

impl Fold<Expr> for AwaitToYield {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Await(AwaitExpr { span, arg }) => Expr::Yield(YieldExpr {
                span,
                delegate: false,
                arg: Some(arg),
            }),
            _ => expr,
        }
    }
}

/// Creates
///
/// `_asyncToGenerator(function*() {})` from `async function() {}`;
fn make_fn_ref(helpers: &Helpers, mut expr: FnExpr) -> Expr {
    expr.function.body = expr.function.body.fold_with(&mut AwaitToYield);

    assert!(expr.function.is_async);
    expr.function.is_async = false;
    expr.function.is_generator = true;

    let span = expr.span();
    helpers.async_to_generator.store(true, Ordering::Relaxed);

    Expr::Call(CallExpr {
        span,
        callee: quote_ident!("_asyncToGenerator").as_callee(),
        args: vec![expr.as_arg()],
    })
}
