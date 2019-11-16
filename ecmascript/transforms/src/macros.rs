macro_rules! impl_fold_fn {
    ($T:path) => {
        impl Fold<Function> for $T {
            fn fold(&mut self, f: Function) -> Function {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children(self);

                let (params, body) = self.fold_fn_like(f.params, f.body.unwrap());

                Function {
                    params,
                    body: Some(body),
                    ..f
                }
            }
        }

        impl Fold<ArrowExpr> for $T {
            fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
                use swc_common::Spanned;

                let f = f.fold_children(self);

                let was_expr = match f.body {
                    BlockStmtOrExpr::Expr(..) => true,
                    _ => false,
                };
                let body_span = f.body.span();
                let (params, mut body) = self.fold_fn_like(
                    f.params,
                    match f.body {
                        BlockStmtOrExpr::BlockStmt(block) => block,
                        BlockStmtOrExpr::Expr(expr) => BlockStmt {
                            span: body_span,
                            stmts: vec![Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(expr),
                            })],
                        },
                    },
                );

                let body = if was_expr
                    && body.stmts.len() == 1
                    && match body.stmts[0] {
                        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
                        _ => false,
                    } {
                    match body.stmts.pop().unwrap() {
                        Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                            BlockStmtOrExpr::Expr(arg)
                        }
                        _ => unreachable!(),
                    }
                } else {
                    BlockStmtOrExpr::BlockStmt(body)
                };

                ArrowExpr { params, body, ..f }
            }
        }

        impl Fold<SetterProp> for $T {
            fn fold(&mut self, f: SetterProp) -> SetterProp {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children(self);

                let (mut params, body) = self.fold_fn_like(vec![f.param], f.body.unwrap());
                debug_assert!(params.len() == 1);

                SetterProp {
                    param: params.pop().unwrap(),
                    body: Some(body),
                    ..f
                }
            }
        }

        impl Fold<GetterProp> for $T {
            fn fold(&mut self, f: GetterProp) -> GetterProp {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children(self);

                let (params, body) = self.fold_fn_like(vec![], f.body.unwrap());
                debug_assert_eq!(params, vec![]);

                GetterProp {
                    body: Some(body),
                    ..f
                }
            }
        }

        impl Fold<CatchClause> for $T {
            fn fold(&mut self, f: CatchClause) -> CatchClause {
                let f = f.fold_children(self);

                let (mut params, body) = match f.param {
                    Some(param) => self.fold_fn_like(vec![param], f.body),
                    None => self.fold_fn_like(vec![], f.body),
                };
                assert!(
                    params.len() == 0 || params.len() == 1,
                    "fold_fn_like should return 0 ~ 1 parameter while handling catch clause"
                );

                let param = if params.is_empty() {
                    None
                } else {
                    Some(params.pop().unwrap())
                };

                CatchClause { param, body, ..f }
            }
        }

        impl Fold<Constructor> for $T {
            fn fold(&mut self, f: Constructor) -> Constructor {
                if f.body.is_none() {
                    return f;
                }

                let f = f.fold_children(self);

                let params = f
                    .params
                    .into_iter()
                    .map(|pat| match pat {
                        PatOrTsParamProp::Pat(p) => p,
                        _ => unreachable!(
                            "TsParameterProperty should be removed by typescript::strip pass"
                        ),
                    })
                    .collect();

                let (params, body) = self.fold_fn_like(params, f.body.unwrap());

                Constructor {
                    params: params.into_iter().map(PatOrTsParamProp::Pat).collect(),
                    body: Some(body),
                    ..f
                }
            }
        }
    };
}

#[macro_export]
macro_rules! chain_at {
    ($T:ty, $a:expr, $b:expr) => {{
        use $crate::pass::JoinedPass;

        JoinedPass {
            first: $a,
            second: $b,
            ty: ::std::marker::PhantomData::<$T>,
        }
    }};

    ($T:ty, $a:expr, $b:expr,) => {
        chain_at!($T, $a, $b)
    };

    ($T: ty, $a:expr, $b:expr,  $($rest:tt)+) => {{
        use $crate::pass::JoinedPass;

        JoinedPass {
            first: $a,
            second: chain_at!($T, $b, $($rest)*),
            ty: ::std::marker::PhantomData::<$T>,
        }
    }};
}

#[macro_export]
macro_rules! validate {
    ($e:expr) => {{
        if cfg!(debug_assertions) {
            $e.fold_with(&mut $crate::debug::validator::Validator {
                name: concat!(file!(), ':', line!(), ':', column!()),
            })
        } else {
            $e
        }
    }};
}
