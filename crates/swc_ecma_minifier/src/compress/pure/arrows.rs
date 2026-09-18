use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_arguments, contains_this_expr};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

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
                body: Box::new(ArrowFunctionBody::FunctionBody(
                    function.body.take().unwrap(),
                )),
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
            let Some(body) = &mut m.function.body else {
                return;
            };

            if body.stmts.len() != 1
                || !matches!(body.stmts[0], Stmt::Return(ReturnStmt { arg: Some(..), .. }))
                || m.function.is_generator
                || contains_arguments(body)
                || contains_super(body)
                // Direct eval can observe the method's `this` and `arguments` bindings.
                || contains_eval_in_method_environment(body)
                || m.function.params.iter().any(|param| {
                    contains_this_expr(param)
                        || contains_arguments(param)
                        || contains_super(param)
                        || contains_eval_in_method_environment(param)
                })
            {
                return;
            }

            let m_span = m.function.span;

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

/// Detect direct eval calls that can observe a method's lexical environment.
///
/// Arrow functions inherit the method's `this` and `arguments`, whereas
/// ordinary functions and constructors establish their own bindings.
fn contains_eval_in_method_environment<N>(node: &N) -> bool
where
    N: VisitWith<MethodEvalFinder>,
{
    let mut visitor = MethodEvalFinder { found: false };
    node.visit_with(&mut visitor);
    visitor.found
}

struct MethodEvalFinder {
    found: bool,
}

impl Visit for MethodEvalFinder {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_callee(&mut self, callee: &Callee) {
        if callee
            .as_expr()
            .is_some_and(|expr| expr.unwrap_parens().is_ident_ref_to("eval"))
        {
            self.found = true;
        } else {
            callee.visit_children_with(self);
        }
    }

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_class(&mut self, class: &Class) {
        class.decorators.visit_with(self);
        class.super_class.visit_with(self);

        for member in &class.body {
            match member {
                ClassMember::Constructor(constructor) => constructor.key.visit_with(self),
                ClassMember::Method(method) => {
                    method.key.visit_with(self);
                    method.function.decorators.visit_with(self);
                }
                ClassMember::PrivateMethod(method) => method.function.decorators.visit_with(self),
                ClassMember::ClassProp(property) => {
                    property.key.visit_with(self);
                    property.decorators.visit_with(self);
                }
                ClassMember::PrivateProp(property) => property.decorators.visit_with(self),
                ClassMember::AutoAccessor(accessor) => {
                    accessor.key.visit_with(self);
                    accessor.decorators.visit_with(self);
                }
                ClassMember::TsIndexSignature(..)
                | ClassMember::Empty(..)
                | ClassMember::StaticBlock(..) => {}
                #[cfg(swc_ast_unknown)]
                _ => {}
            }
        }
    }

    fn visit_expr(&mut self, expr: &Expr) {
        if !self.found {
            expr.visit_children_with(self);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_stmt(&mut self, stmt: &Stmt) {
        if !self.found {
            stmt.visit_children_with(self);
        }
    }
}
