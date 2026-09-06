use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::contains_eval;
use swc_ecma_utils::{contains_arguments, contains_this_expr, find_pat_ids};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{ctx::Ctx, Pure, UnsafeArrowStage};
use crate::compress::util::{contains_eval_in_fn_scope, contains_new_target, contains_super};

/// Finds references to a contextual keyword in a parameter pattern.
///
/// Parameter default expressions are evaluated in the enclosing grammar
/// context. Nested ordinary functions create a new grammar context, while
/// nested arrows inherit it and are therefore searched.
fn contains_contextual_keyword_ref<'a, N>(node: &N, keyword: &'a str) -> bool
where
    N: VisitWith<ContextualKeywordRefFinder<'a>>,
{
    let mut finder = ContextualKeywordRefFinder {
        keyword,
        found: false,
    };
    node.visit_with(&mut finder);
    finder.found
}

struct ContextualKeywordRefFinder<'a> {
    keyword: &'a str,
    found: bool,
}

impl Visit for ContextualKeywordRefFinder<'_> {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        if expr.is_ident_ref_to(self.keyword) {
            self.found = true;
        } else if !self.found {
            expr.visit_children_with(self);
        }
    }

    fn visit_function(&mut self, _: &Function) {}
}

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
            let params: Vec<Ident> = find_pat_ids(&function.params);
            if (self.ctx.contains(Ctx::IN_GENERATOR)
                && (params.iter().any(|ident| ident.sym == "yield")
                    || contains_contextual_keyword_ref(&function.params, "yield")))
                || (self.ctx.intersects(Ctx::IN_ASYNC | Ctx::IN_STATIC_BLOCK)
                    && (params.iter().any(|ident| ident.sym == "await")
                        || contains_contextual_keyword_ref(&function.params, "await")))
            {
                // Ordinary functions reset these grammar contexts, while arrows inherit them.
                return;
            }

            if function.params.iter().any(contains_this_expr)
                || contains_this_expr(&function.body)
                || function.params.iter().any(contains_arguments)
                || contains_arguments(&function.body)
                || contains_super(&function.params)
                || contains_super(&function.body)
                || contains_new_target(&function.params)
                || contains_new_target(&function.body)
                || contains_eval_in_fn_scope(&function.params)
                || contains_eval_in_fn_scope(&function.body)
                || function.is_generator
            {
                return;
            }

            if !function.params.is_empty() {
                let simple_params = function.params.iter().all(|param| param.pat.is_ident());
                // Sloppy ordinary functions allow duplicates, but arrows never do.
                if simple_params
                    && function.params.iter().enumerate().any(|(idx, param)| {
                        let id = param.pat.as_ident().unwrap();
                        function.params[..idx]
                            .iter()
                            .any(|earlier| earlier.pat.as_ident().unwrap().sym == id.sym)
                    })
                {
                    return;
                }
                let has_mutated_params = function.params.iter().any(|param| {
                    param
                        .pat
                        .as_ident()
                        .is_some_and(|ident| self.mutated_ids.contains(&ident.id.to_id()))
                });
                if has_mutated_params {
                    // Arrow parameters are conservatively marked INLINE_PREVENTED.
                    // Keep the ordinary function until its assignments and parameter
                    // redeclarations have been compressed using fresh usage data.
                    if self.config.unsafe_arrow_stage == UnsafeArrowStage::Compress
                        || !simple_params
                    {
                        return;
                    }
                }
            }

            self.changed = true;
            report_change!("unsafe_arrows: Fn expr => arrow");

            let mut body = ArrowFunctionBody::FunctionBody(function.body.take().unwrap());
            self.optimize_arrow_body(&mut body);

            *e = ArrowExpr {
                span: function.span,
                ctxt: function.ctxt,
                params: function.params.take().into_iter().map(|p| p.pat).collect(),
                body: Box::new(body),
                is_async: function.is_async,
                is_generator: function.is_generator,
                ..Default::default()
            }
            .into();
        }
    }

    pub(super) fn optimize_arrow_body(&mut self, b: &mut ArrowFunctionBody) {
        match b {
            ArrowFunctionBody::FunctionBody(s) => {
                if s.stmts.len() == 1 {
                    if let Stmt::Return(s) = &mut s.stmts[0] {
                        if let Some(arg) = &mut s.arg {
                            report_change!("arrows: Optimizing the body of an arrow");
                            *b = ArrowFunctionBody::Expr(arg.take());
                        }
                    }
                }
            }
            ArrowFunctionBody::Expr(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
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
                || m.function.params.iter().any(|param| {
                    contains_this_expr(param)
                        || contains_arguments(param)
                        || contains_super(param)
                        || contains_eval(param, false)
                })
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
                            body: Box::new(ArrowFunctionBody::Expr(arg)),
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
                Expr::Arrow(m) if m.body.is_function_body() => {
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
                            body: m.body.take().function_body(),
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
