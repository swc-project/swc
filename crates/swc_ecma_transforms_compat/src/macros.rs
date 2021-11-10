macro_rules! impl_fold_fn {
    () => {
        fn fold_function(&mut self, f: Function) -> Function {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let (params, body) = self.fold_fn_like(f.params, f.body.unwrap());

            Function {
                params,
                body: Some(body),
                ..f
            }
        }

        fn fold_arrow_expr(&mut self, f: ArrowExpr) -> ArrowExpr {
            use swc_common::Spanned;

            let f = f.fold_children_with(self);

            let was_expr = match f.body {
                BlockStmtOrExpr::Expr(..) => true,
                _ => false,
            };
            let body_span = f.body.span();
            let (params, mut body) = self.fold_fn_like(
                f.params
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect(),
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
                    Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => BlockStmtOrExpr::Expr(arg),
                    _ => unreachable!(),
                }
            } else {
                BlockStmtOrExpr::BlockStmt(body)
            };

            ArrowExpr {
                params: params.into_iter().map(|param| param.pat).collect(),
                body,
                ..f
            }
        }

        fn fold_setter_prop(&mut self, f: SetterProp) -> SetterProp {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let (mut params, body) = self.fold_fn_like(
                vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: f.param,
                }],
                f.body.unwrap(),
            );
            debug_assert!(params.len() == 1);

            SetterProp {
                param: params.pop().unwrap().pat,
                body: Some(body),
                ..f
            }
        }

        fn fold_getter_prop(&mut self, f: GetterProp) -> GetterProp {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let (params, body) = self.fold_fn_like(vec![], f.body.unwrap());
            debug_assert_eq!(params, vec![]);

            GetterProp {
                body: Some(body),
                ..f
            }
        }

        fn fold_catch_clause(&mut self, f: CatchClause) -> CatchClause {
            let f = f.fold_children_with(self);

            let (mut params, body) = match f.param {
                Some(pat) => self.fold_fn_like(
                    vec![Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat,
                    }],
                    f.body,
                ),
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

            CatchClause {
                param: param.map(|param| param.pat),
                body,
                ..f
            }
        }

        fn fold_constructor(&mut self, f: Constructor) -> Constructor {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let params = f
                .params
                .into_iter()
                .map(|pat| match pat {
                    ParamOrTsParamProp::Param(p) => p,
                    _ => unreachable!(
                        "TsParameterProperty should be removed by typescript::strip pass"
                    ),
                })
                .collect();

            let (params, body) = self.fold_fn_like(params, f.body.unwrap());

            Constructor {
                params: params.into_iter().map(ParamOrTsParamProp::Param).collect(),
                body: Some(body),
                ..f
            }
        }
    };
}
