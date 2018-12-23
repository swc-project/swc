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
                    let stmt = stmt.fold_with(self);

                    buf.push(T::from_stmt(stmt));
                    buf.extend(self.extra_stmts.drain(..).map(T::from_stmt))
                }
            }
        }

        buf
    }
}

// impl Fold<Expr> for AsyncToGenerator {
//     fn fold(&mut self, expr: Expr) -> Expr {
//         let expr = expr.fold_children(self);

//         match expr {
//             Expr::Fn(_) => {
//                 let fn_ref = make_fn_ref(&self.helpers, expr);

//                 CallExpr {
//                     span: DUMMY_SP,
//                     callee: fn_ref.as_callee(),
//                     args: vec![],
//                 }
//                 .into()
//             }
//             _ => expr,
//         }
//     }
// }

impl Fold<FnDecl> for AsyncToGenerator {
    fn fold(&mut self, f: FnDecl) -> FnDecl {
        if !f.function.is_async {
            return f;
        }
        let f = f.fold_children(self);

        let span = f.span();
        let ident = f.ident;

        let real_fn_ident = quote_ident!(
            ident.span.apply_mark(Mark::fresh(Mark::root())),
            format!("_{}", ident.sym)
        );
        let right = make_fn_ref(
            &self.helpers,
            Expr::Fn(FnExpr {
                ident: None,
                function: f.function,
            }),
        );

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
        println!("EXTRA!",);
        self.extra_stmts.push(Stmt::Decl(Decl::Fn(real_fn)));

        FnDecl {
            ident,
            function: Function {
                span,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box real_fn_ident.apply(
                            DUMMY_SP,
                            box Expr::This(ThisExpr { span: DUMMY_SP }),
                            vec![quote_ident!("arguments").as_arg()],
                        )),
                    })],
                },
                params: vec![],
                is_generator: false,
                is_async: false,
            },
        }
    }
}

impl Fold<Function> for AsyncToGenerator {
    fn fold(&mut self, f: Function) -> Function {
        let f = f.fold_children(self);

        if !f.is_async {
            return f;
        }

        let body = f.body.fold_with(&mut AwaitToYield);

        Function {
            is_generator: true,
            is_async: false,
            body,
            ..f
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

fn make_fn_ref(helpers: &Helpers, expr: Expr) -> Expr {
    let span = expr.span();
    helpers.async_to_generator.store(true, Ordering::Relaxed);

    Expr::Call(CallExpr {
        span,
        callee: quote_ident!("asyncToGenerator").as_callee(),
        args: vec![expr.as_arg()],
    })
}
