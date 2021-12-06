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

macro_rules! impl_visit_mut_fn {
    () => {
        fn visit_mut_function(&mut self, f: &mut Function) {
            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            let (params, body) = self.visit_mut_fn_like(&mut f.params, &mut f.body.take().unwrap());

            f.params = params;
            f.body = Some(body);
        }

        fn visit_mut_arrow_expr(&mut self, f: &mut ArrowExpr) {
            use swc_common::Spanned;

            f.visit_mut_children_with(self);

            let was_expr = match f.body {
                BlockStmtOrExpr::Expr(..) => true,
                _ => false,
            };
            let body_span = f.body.span();
            let (params, mut body) = self.visit_mut_fn_like(
                &mut f
                    .params
                    .take()
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect(),
                &mut match &mut f.body {
                    BlockStmtOrExpr::BlockStmt(block) => block.take(),
                    BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        span: body_span,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.take()),
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

            f.params = params.into_iter().map(|param| param.pat).collect();
            f.body = body;
        }

        fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            let (mut params, body) = self.visit_mut_fn_like(
                &mut vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: f.param.take(),
                }],
                &mut f.body.take().unwrap(),
            );
            debug_assert!(params.len() == 1);

            f.param = params.pop().unwrap().pat;
            f.body = Some(body);
        }

        fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            let (params, body) = self.visit_mut_fn_like(&mut vec![], &mut f.body.take().unwrap());
            debug_assert_eq!(params, vec![]);

            f.body = Some(body);
        }

        fn visit_mut_catch_clause(&mut self, f: &mut CatchClause) {
            f.visit_mut_children_with(self);

            let (mut params, body) = match &mut f.param {
                Some(pat) => self.visit_mut_fn_like(
                    &mut vec![Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: pat.take(),
                    }],
                    &mut f.body.take(),
                ),
                None => self.visit_mut_fn_like(&mut vec![], &mut f.body.take()),
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

            f.param = param.map(|param| param.pat);
            f.body = body;
        }

        fn visit_mut_constructor(&mut self, f: &mut Constructor) {
            if f.body.is_none() {
                return;
            }

            tracing::trace!("visit_mut_constructor(parmas.len() = {})", f.params.len());

            f.visit_mut_children_with(self);

            let mut params = f
                .params
                .take()
                .into_iter()
                .map(|pat| match pat {
                    ParamOrTsParamProp::Param(p) => p,
                    _ => unreachable!(
                        "TsParameterProperty should be removed by typescript::strip pass"
                    ),
                })
                .collect();

            let (params, body) = self.visit_mut_fn_like(&mut params, &mut f.body.take().unwrap());

            tracing::trace!(
                "visit_mut_constructor(parmas.len() = {}, after)",
                params.len()
            );

            f.params = params.into_iter().map(ParamOrTsParamProp::Param).collect();
            f.body = Some(body);
        }
    };
}
