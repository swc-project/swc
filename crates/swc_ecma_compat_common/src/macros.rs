/// Not a public API
#[macro_export]
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

            let was_expr = match *f.body {
                BlockStmtOrExpr::Expr(..) => true,
                _ => false,
            };
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
                &mut match &mut *f.body {
                    BlockStmtOrExpr::BlockStmt(block) => block.take(),
                    BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.take()),
                        })],
                        ..Default::default()
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
                        Box::new(BlockStmtOrExpr::Expr(arg))
                    }
                    _ => unreachable!(),
                }
            } else {
                Box::new(BlockStmtOrExpr::BlockStmt(body))
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
                    decorators: Vec::new(),
                    pat: *f.param.take(),
                }],
                &mut f.body.take().unwrap(),
            );
            debug_assert!(params.len() == 1);

            f.param = Box::new(params.into_iter().next().unwrap().pat);
            f.body = Some(body);
        }

        fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            let (params, body) =
                self.visit_mut_fn_like(&mut Vec::new(), &mut f.body.take().unwrap());
            debug_assert_eq!(params, Vec::new());

            f.body = Some(body);
        }

        fn visit_mut_catch_clause(&mut self, f: &mut CatchClause) {
            f.visit_mut_children_with(self);

            let (mut params, body) = match &mut f.param {
                Some(pat) => self.visit_mut_fn_like(
                    &mut vec![Param {
                        span: DUMMY_SP,
                        decorators: Vec::new(),
                        pat: pat.take(),
                    }],
                    &mut f.body.take(),
                ),
                None => self.visit_mut_fn_like(&mut Vec::new(), &mut f.body.take()),
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
