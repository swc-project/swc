use rustc_hash::FxHashSet;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::rename::contains_eval;
use swc_ecma_utils::{contains_arguments, contains_this_expr, find_pat_ids};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{ctx::Ctx, Pure, UnsafeArrowStage};
use crate::compress::util::contains_super;

/// Collects bindings that cannot safely become arrow parameters before the
/// data-flow optimizer has processed their assignments and redeclarations.
///
/// This deliberately records only the information required by arrow
/// conversion, avoiding a complete
/// [`ProgramData`](crate::program_data::ProgramData) construction before every
/// pure-optimizer pass.
pub(super) struct MutationCollector {
    declared_ids: FxHashSet<Id>,
    mutated_ids: FxHashSet<Id>,
}

impl MutationCollector {
    pub(super) fn collect<N>(node: &N) -> FxHashSet<Id>
    where
        N: VisitWith<Self>,
    {
        let mut collector = Self {
            declared_ids: Default::default(),
            mutated_ids: Default::default(),
        };
        node.visit_with(&mut collector);
        collector.mutated_ids
    }

    fn record_declaration(&mut self, id: Id) {
        if !self.declared_ids.insert(id.clone()) {
            self.mutated_ids.insert(id);
        }
    }
}

impl Visit for MutationCollector {
    noop_visit_type!();

    fn visit_binding_ident(&mut self, ident: &BindingIdent) {
        self.record_declaration(ident.id.to_id());
    }

    fn visit_assign_expr(&mut self, expr: &AssignExpr) {
        expr.visit_children_with(self);

        match &expr.left {
            AssignTarget::Pat(pat) => self.mutated_ids.extend(find_pat_ids(pat)),
            AssignTarget::Simple(target) => {
                if let Some(ident) = target.as_ident() {
                    self.mutated_ids.insert(ident.to_id());
                }
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn visit_update_expr(&mut self, expr: &UpdateExpr) {
        expr.visit_children_with(self);

        if let Some(ident) = expr.arg.as_ident() {
            self.mutated_ids.insert(ident.to_id());
        }
    }

    fn visit_fn_decl(&mut self, decl: &FnDecl) {
        self.record_declaration(decl.ident.to_id());
        decl.visit_children_with(self);
    }

    fn visit_class_decl(&mut self, decl: &ClassDecl) {
        self.record_declaration(decl.ident.to_id());
        decl.visit_children_with(self);
    }
}

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

    fn visit_binding_ident(&mut self, ident: &BindingIdent) {
        if ident.id.sym == self.keyword {
            self.found = true;
        }
    }

    fn visit_expr(&mut self, expr: &Expr) {
        if expr.is_ident_ref_to(self.keyword) {
            self.found = true;
        } else if !self.found {
            expr.visit_children_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        if let Prop::Shorthand(ident) = prop {
            if ident.sym == self.keyword {
                self.found = true;
            }
        } else if !self.found {
            prop.visit_children_with(self);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        // Arrow parameters inherit the enclosing grammar context, but the body
        // establishes a fresh one.
        arrow.params.visit_with(self);
    }
}

/// Collects lexical hazards that prevent converting an ordinary function to an
/// arrow.
///
/// Nested arrows retain the surrounding function environment, while nested
/// ordinary functions and constructors establish their own environments and are
/// skipped.
#[derive(Default)]
struct ArrowConversionHazards {
    has_this: bool,
    has_arguments: bool,
    has_super: bool,
    has_new_target: bool,
    has_direct_eval_or_with: bool,
}

impl ArrowConversionHazards {
    fn find(params: &[Param], body: &Option<FunctionBody>) -> Self {
        let mut hazards = Self::default();
        params.visit_with(&mut hazards);
        body.visit_with(&mut hazards);
        hazards
    }

    fn any(&self) -> bool {
        self.has_this
            || self.has_arguments
            || self.has_super
            || self.has_new_target
            || self.has_direct_eval_or_with
    }
}

impl Visit for ArrowConversionHazards {
    noop_visit_type!();

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.has_this = true;
    }

    fn visit_expr(&mut self, expr: &Expr) {
        expr.visit_children_with(self);

        if expr.is_ident_ref_to("arguments") {
            self.has_arguments = true;
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        prop.visit_children_with(self);

        if let Prop::Shorthand(ident) = prop {
            if ident.sym == "arguments" {
                self.has_arguments = true;
            }
        }
    }

    fn visit_super(&mut self, _: &Super) {
        self.has_super = true;
    }

    fn visit_meta_prop_expr(&mut self, expr: &MetaPropExpr) {
        if expr.kind == MetaPropKind::NewTarget {
            self.has_new_target = true;
        }
    }

    fn visit_callee(&mut self, callee: &Callee) {
        if callee
            .as_expr()
            .is_some_and(|expr| expr.is_ident_ref_to("eval"))
        {
            self.has_direct_eval_or_with = true;
        } else {
            callee.visit_children_with(self);
        }
    }

    fn visit_with_stmt(&mut self, stmt: &WithStmt) {
        self.has_direct_eval_or_with = true;
        stmt.visit_children_with(self);
    }
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
            if (self.ctx.contains(Ctx::IN_GENERATOR)
                && contains_contextual_keyword_ref(&function.params, "yield"))
                || (self.ctx.intersects(Ctx::IN_ASYNC | Ctx::IN_STATIC_BLOCK)
                    && contains_contextual_keyword_ref(&function.params, "await"))
            {
                // Ordinary functions reset these grammar contexts, while arrows inherit them.
                return;
            }

            if ArrowConversionHazards::find(&function.params, &function.body).any()
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
