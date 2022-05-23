use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_minifier_base::report_change;
use swc_ecma_utils::{contains_arguments, contains_this_expr};

use super::Pure;

/// Methods related to the option `arrows`.
impl Pure<'_> {
    pub(super) fn unsafe_optimize_fn_as_arrow(&mut self, e: &mut Expr) {
        if self.options.ecma < EsVersion::Es2015 {
            return;
        }

        if !self.options.unsafe_arrows {
            return;
        }

        if let Expr::Fn(FnExpr {
            ident: None,
            function,
        }) = e
        {
            if contains_this_expr(&function.body) {
                return;
            }

            self.changed = true;
            report_change!("unsafe_arrows: Fn expr => arrow");

            *e = Expr::Arrow(ArrowExpr {
                span: function.span,
                params: function.params.take().into_iter().map(|p| p.pat).collect(),
                body: BlockStmtOrExpr::BlockStmt(function.body.take().unwrap()),
                is_async: function.is_async,
                is_generator: function.is_generator,
                type_params: Default::default(),
                return_type: Default::default(),
            });
        }
    }

    pub(super) fn optimize_arrow_body(&mut self, b: &mut BlockStmtOrExpr) {
        if !self.options.arrows {
            return;
        }

        match b {
            BlockStmtOrExpr::BlockStmt(s) => {
                if s.stmts.len() == 1 {
                    if let Stmt::Return(s) = &mut s.stmts[0] {
                        if let Some(arg) = &mut s.arg {
                            report_change!("arrows: Optimizing the body of an arrow");
                            *b = BlockStmtOrExpr::Expr(arg.take());
                        }
                    }
                }
            }
            BlockStmtOrExpr::Expr(_) => {}
        }
    }

    pub(super) fn optimize_arrow_method_prop(&mut self, p: &mut Prop) {
        if self.options.ecma < EsVersion::Es2015 {
            return;
        }

        if !self.options.unsafe_methods && !self.options.arrows {
            return;
        }

        if let Prop::Method(m) = p {
            if m.function.is_generator
                || contains_arguments(&m.function.body)
                || contains_super(&m.function.body)
            {
                return;
            }

            let m_span = m.function.span;

            if let Some(body) = &mut m.function.body {
                if body.stmts.len() == 1
                    && matches!(
                        body.stmts[0],
                        Stmt::Return(ReturnStmt { arg: Some(..), .. })
                    )
                {
                    if contains_this_expr(body) {
                        return;
                    }
                    self.changed = true;
                    report_change!("Method property => arrow");

                    let arg = body
                        .take()
                        .stmts
                        .remove(0)
                        .expect_return_stmt()
                        .arg
                        .take()
                        .unwrap();

                    *p = Prop::KeyValue(KeyValueProp {
                        key: m.key.take(),
                        value: Box::new(Expr::Arrow(ArrowExpr {
                            span: m_span,
                            params: m
                                .function
                                .params
                                .take()
                                .into_iter()
                                .map(|v| v.pat)
                                .collect(),
                            body: BlockStmtOrExpr::Expr(arg),
                            is_async: m.function.is_async,
                            is_generator: m.function.is_generator,
                            type_params: Default::default(),
                            return_type: Default::default(),
                        })),
                    });
                    return;
                }
            }
        }

        if let Prop::KeyValue(kv) = p {
            //
            if contains_this_expr(&kv.value) {
                return;
            }

            if let Expr::Arrow(
                m @ ArrowExpr {
                    body: BlockStmtOrExpr::BlockStmt(..),
                    ..
                },
            ) = &mut *kv.value
            {
                *p = Prop::Method(MethodProp {
                    key: kv.key.take(),
                    function: Function {
                        params: m
                            .params
                            .take()
                            .into_iter()
                            .map(|pat| Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat,
                            })
                            .collect(),
                        decorators: Default::default(),
                        span: m.span,
                        body: m.body.take().block_stmt(),
                        is_generator: m.is_generator,
                        is_async: m.is_async,
                        type_params: Default::default(),
                        return_type: Default::default(),
                    },
                });
            }
        }
    }
}
