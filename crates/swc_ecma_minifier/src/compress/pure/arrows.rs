use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_arguments, contains_this_expr};

use super::Pure;
use crate::compress::util::contains_super;

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
            if function.params.iter().any(contains_this_expr)
                || contains_this_expr(&function.body)
                || function.is_generator
            {
                return;
            }

            self.changed = true;
            report_change!("unsafe_arrows: Fn expr => arrow");

            *e = ArrowExpr {
                span: function.span,
                params: function.params.take().into_iter().map(|p| p.pat).collect(),
                body: Box::new(BlockStmtOrExpr::BlockStmt(function.body.take().unwrap())),
                is_async: function.is_async,
                is_generator: function.is_generator,
                ..Default::default()
            }
            .into();
        }
    }

    pub(super) fn optimize_arrow_body(&mut self, b: &mut BlockStmtOrExpr) {
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
        if !self.options.unsafe_methods && !self.options.arrows {
            return;
        }

        if let Prop::Method(m) = p {
            if m.function.is_generator
                || contains_arguments(&m.function.body)
                || contains_super(&m.function.body)
                || m.function.params.iter().any(contains_this_expr)
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
                        value: ArrowExpr {
                            span: m_span,
                            params: m
                                .function
                                .params
                                .take()
                                .into_iter()
                                .map(|v| v.pat)
                                .collect(),
                            body: Box::new(BlockStmtOrExpr::Expr(arg)),
                            is_async: m.function.is_async,
                            is_generator: m.function.is_generator,
                            ..Default::default()
                        }
                        .into(),
                    });
                    return;
                }
            }
        }

        if let Prop::KeyValue(kv) = p {
            // See https://github.com/swc-project/swc/pull/6521
            //
            // ({foo(){}}).foo.toString()
            //
            // returns `foo(){}`
            if !self.options.unsafe_methods {
                return;
            }

            //
            if contains_this_expr(&kv.value) {
                return;
            }

            match &mut *kv.value {
                Expr::Arrow(m) if m.body.is_block_stmt() => {
                    *p = Prop::Method(MethodProp {
                        key: kv.key.take(),
                        function: Box::new(Function {
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
                            span: m.span,
                            body: m.body.take().block_stmt(),
                            is_generator: m.is_generator,
                            is_async: m.is_async,
                            ..Default::default()
                        }),
                    });
                }
                _ => (),
            }
        }
    }
}
