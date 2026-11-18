/// Not a public API
#[macro_export]
macro_rules! impl_visit_mut_fn {
    () => {
        fn visit_mut_function(&mut self, f: &mut Function) {
            if f.body.is_none() {
                return;
            }

            f.visit_mut_children_with(self);

            let body = f.body.as_mut().unwrap();
            let (params, stmts) = self.visit_mut_fn_like(&mut f.params, &mut body.stmts);

            f.params = params;
            body.stmts = stmts;
        }

        fn visit_mut_arrow_expr(&mut self, f: &mut ArrowExpr) {
            use swc_common::Spanned;

            f.visit_mut_children_with(self);

            let was_expr = match *f.body {
                ArrowFunctionBody::Expr(..) => true,
                _ => false,
            };
            let mut body = match &mut *f.body {
                ArrowFunctionBody::FunctionBody(body) => body.take(),
                ArrowFunctionBody::Expr(expr) => FunctionBody {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(expr.take()),
                    })],
                },
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };
            let (params, stmts) = self.visit_mut_fn_like(
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
                &mut body.stmts,
            );
            body.stmts = stmts;

            let body = if was_expr
                && body.stmts.len() == 1
                && match body.stmts[0] {
                    Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
                    _ => false,
                } {
                match body.stmts.pop().unwrap() {
                    Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                        Box::new(ArrowFunctionBody::Expr(arg))
                    }
                    _ => unreachable!(),
                }
            } else {
                Box::new(ArrowFunctionBody::FunctionBody(body))
            };

            f.params = params.into_iter().map(|param| param.pat).collect();
            f.body = body;
        }

        fn visit_mut_catch_clause(&mut self, f: &mut CatchClause) {
            f.visit_mut_children_with(self);

            let (mut params, stmts) = match &mut f.param {
                Some(pat) => self.visit_mut_fn_like(
                    &mut vec![Param {
                        span: DUMMY_SP,
                        decorators: Vec::new(),
                        pat: pat.take(),
                    }],
                    &mut f.body.stmts,
                ),
                None => self.visit_mut_fn_like(&mut Vec::new(), &mut f.body.stmts),
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
            f.body.stmts = stmts;
        }

        fn visit_mut_constructor(&mut self, f: &mut Constructor) {
            if f.body.is_none() {
                return;
            }

            #[cfg(debug_assertions)]
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

            let body = f.body.as_mut().unwrap();
            let (params, stmts) = self.visit_mut_fn_like(&mut params, &mut body.stmts);

            #[cfg(debug_assertions)]
            tracing::trace!(
                "visit_mut_constructor(parmas.len() = {}, after)",
                params.len()
            );

            f.params = params.into_iter().map(ParamOrTsParamProp::Param).collect();
            body.stmts = stmts;
        }
    };
}
