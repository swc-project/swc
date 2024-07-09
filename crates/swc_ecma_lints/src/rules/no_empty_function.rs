use std::{
    fmt::{self, Debug},
    sync::Arc,
};

use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, SourceMap, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Serialize, Clone, Copy, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
enum FunctionModifiers {
    All,
    Simple,
    Generator,
    Getter,
    Setter,
    Async,
    Private,
    Protected,
    Static,
    Public,
}

impl FunctionModifiers {
    fn get_human_readable(&self) -> &'static str {
        match self {
            FunctionModifiers::Generator => "generator",
            FunctionModifiers::Getter => "getter",
            FunctionModifiers::Setter => "setter",
            FunctionModifiers::Async => "async",
            FunctionModifiers::Private => "private",
            FunctionModifiers::Protected => "protected",
            FunctionModifiers::Static => "static",
            FunctionModifiers::Public => "public",
            FunctionModifiers::Simple | FunctionModifiers::All => {
                unreachable!();
            }
        }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoEmptyFunctionConfig {
    consider_comments: Option<bool>,
    functions: Option<AHashSet<FunctionModifiers>>,
    arrow_functions: Option<AHashSet<FunctionModifiers>>,
    methods: Option<AHashSet<FunctionModifiers>>,
    constructors: Option<AHashSet<FunctionModifiers>>,
}

pub fn no_empty_function(
    source_map: &Arc<SourceMap>,
    config: &RuleConfig<NoEmptyFunctionConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoEmptyFunction::new(
            source_map.clone(),
            config,
        ))),
    }
}

#[derive(Default)]
struct NoEmptyFunction {
    source_map: Arc<SourceMap>,

    expected_reaction: LintRuleReaction,
    consider_comments: bool,
    functions: Option<AHashSet<FunctionModifiers>>,
    arrow_functions: Option<AHashSet<FunctionModifiers>>,
    methods: Option<AHashSet<FunctionModifiers>>,
    constructors: Option<AHashSet<FunctionModifiers>>,
}

impl Debug for NoEmptyFunction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("NoEmptyFunction")
            .field("expected_reaction", &self.expected_reaction)
            .field("consider_comments", &self.consider_comments)
            .field("functions", &self.functions)
            .field("arrow_functions", &self.arrow_functions)
            .field("methods", &self.methods)
            .field("check_constructor", &self.constructors)
            .finish()
    }
}

#[derive(Default)]
struct FunctionMarkers {
    is_async: bool,
    is_generator: bool,
    is_getter: bool,
    is_setter: bool,
    is_private: bool,
    is_static: bool,
    is_protected: bool,
    is_public: bool,
}

fn get_modifiers<const MAX_ATTRS: usize>(
    FunctionMarkers {
        is_async,
        is_generator,
        is_getter,
        is_setter,
        is_private,
        is_static,
        is_protected,
        is_public,
    }: FunctionMarkers,
) -> (usize, [FunctionModifiers; MAX_ATTRS]) {
    let mut modifiers: [FunctionModifiers; MAX_ATTRS] = [FunctionModifiers::Simple; MAX_ATTRS];
    let mut idx: usize = 0;

    if is_async {
        modifiers[idx] = FunctionModifiers::Async;
        idx += 1;
    }

    if is_generator {
        modifiers[idx] = FunctionModifiers::Generator;
        idx += 1;
    }

    if is_private {
        modifiers[idx] = FunctionModifiers::Private;
        idx += 1;
    }

    if is_static {
        modifiers[idx] = FunctionModifiers::Static;
        idx += 1;
    }

    if is_protected {
        modifiers[idx] = FunctionModifiers::Protected;
        idx += 1;
    }

    if is_public {
        modifiers[idx] = FunctionModifiers::Public;
        idx += 1;
    }

    if is_getter {
        modifiers[idx] = FunctionModifiers::Getter;
        idx += 1;
    }

    if is_setter {
        modifiers[idx] = FunctionModifiers::Setter;
        idx += 1;
    }

    (idx, modifiers)
}

impl NoEmptyFunction {
    fn new(source_map: Arc<SourceMap>, config: &RuleConfig<NoEmptyFunctionConfig>) -> Self {
        let no_empty_function_config = config.get_rule_config();

        Self {
            source_map,
            expected_reaction: config.get_rule_reaction(),

            consider_comments: no_empty_function_config.consider_comments.unwrap_or(true),
            functions: no_empty_function_config.functions.clone(),
            arrow_functions: no_empty_function_config.arrow_functions.clone(),
            methods: no_empty_function_config.methods.clone(),
            constructors: no_empty_function_config.constructors.clone(),
        }
    }

    fn emit_report(
        &self,
        span: Span,
        target_type: &str,
        function_type: Option<&FunctionModifiers>,
    ) {
        let message = if let Some(fn_modifier) = function_type {
            format!(
                "Unexpected empty {} {} pattern",
                fn_modifier.get_human_readable(),
                target_type
            )
        } else {
            format!("Unexpected empty {} pattern", target_type)
        };

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
        });
    }

    fn check(
        &self,
        span: Span,
        target_type: &str,
        allowed: Option<&AHashSet<FunctionModifiers>>,
        modifiers: &[FunctionModifiers],
    ) {
        if let Some(allowed) = allowed {
            if allowed.contains(&FunctionModifiers::All) {
                return;
            }

            if modifiers.is_empty() && allowed.contains(&FunctionModifiers::Simple) {
                return;
            }

            if modifiers.iter().any(|marker| allowed.contains(marker)) {
                return;
            }
        }

        self.emit_report(span, target_type, modifiers.last());
    }

    fn has_comment_in_body(&self, span: &Span) -> bool {
        let fn_lo = self.source_map.lookup_byte_offset(span.lo);
        let fn_hi = self.source_map.lookup_byte_offset(span.hi);
        let lo_idx = fn_lo.pos.0 as usize;
        let hi_idx = fn_hi.pos.0 as usize;

        let body = &fn_lo.sf.src.as_str()[lo_idx..hi_idx];

        let mut prev_char: char = '\0';

        for ch in body.chars() {
            match (prev_char, ch) {
                ('/', '/') => {
                    return true;
                }
                ('/', '*') => {
                    return true;
                }
                _ => {}
            }

            prev_char = ch;
        }

        false
    }
}

impl Visit for NoEmptyFunction {
    noop_visit_type!();

    fn visit_function(&mut self, function: &Function) {
        if let Some(BlockStmt { stmts, span, .. }) = &function.body {
            if self.consider_comments && self.has_comment_in_body(span) {
                return;
            }

            if stmts.is_empty() {
                let (count, modifiers) = get_modifiers::<2>(FunctionMarkers {
                    is_async: function.is_async,
                    is_generator: function.is_generator,
                    ..Default::default()
                });

                self.check(
                    function.span,
                    "function",
                    self.functions.as_ref(),
                    &modifiers[0..count],
                );

                return;
            }

            function.visit_children_with(self);
        }
    }

    fn visit_arrow_expr(&mut self, function: &ArrowExpr) {
        if let BlockStmtOrExpr::BlockStmt(BlockStmt { stmts, span, .. }) = &*function.body {
            if self.consider_comments && self.has_comment_in_body(span) {
                return;
            }

            if stmts.is_empty() {
                let (count, modifiers) = get_modifiers::<2>(FunctionMarkers {
                    is_async: function.is_async,
                    is_generator: function.is_generator,
                    ..Default::default()
                });

                self.check(
                    function.span,
                    "arrow function",
                    self.arrow_functions.as_ref(),
                    &modifiers[0..count],
                );

                return;
            }
        }

        function.visit_children_with(self);
    }

    fn visit_constructor(&mut self, constructor: &Constructor) {
        if let Some(BlockStmt { span, stmts, .. }) = &constructor.body {
            if self.consider_comments && self.has_comment_in_body(span) {
                return;
            }

            if stmts.is_empty() {
                let (count, modifiers) = get_modifiers::<1>(FunctionMarkers {
                    is_private: constructor.accessibility.eq(&Some(Accessibility::Private)),
                    is_public: constructor.accessibility.eq(&Some(Accessibility::Public)),
                    is_protected: constructor
                        .accessibility
                        .eq(&Some(Accessibility::Protected)),
                    ..Default::default()
                });

                self.check(
                    constructor.span,
                    "constructor",
                    self.constructors.as_ref(),
                    &modifiers[0..count],
                );
            }
        }

        constructor.visit_children_with(self);
    }

    fn visit_class_method(&mut self, class_method: &ClassMethod) {
        let method = &class_method.function;

        if let Some(BlockStmt { span, stmts, .. }) = &method.body {
            if self.consider_comments && self.has_comment_in_body(span) {
                return;
            }

            if stmts.is_empty() {
                let (count, modifiers) = get_modifiers::<3>(FunctionMarkers {
                    is_async: method.is_async,
                    is_generator: method.is_generator,
                    is_getter: class_method.kind.eq(&MethodKind::Getter),
                    is_setter: class_method.kind.eq(&MethodKind::Setter),
                    is_private: class_method.accessibility.eq(&Some(Accessibility::Private)),
                    is_public: class_method.accessibility.eq(&Some(Accessibility::Public)),
                    is_protected: class_method
                        .accessibility
                        .eq(&Some(Accessibility::Protected)),
                    ..Default::default()
                });

                self.check(
                    class_method.span,
                    "method",
                    self.methods.as_ref(),
                    &modifiers[0..count],
                );

                return;
            }

            class_method.visit_children_with(self);
        }
    }

    fn visit_getter_prop(&mut self, getter_prop: &GetterProp) {
        if self.consider_comments && self.has_comment_in_body(&getter_prop.span) {
            return;
        }

        if let Some(BlockStmt { stmts, .. }) = &getter_prop.body {
            if stmts.is_empty() {
                self.check(
                    getter_prop.span,
                    "method",
                    self.methods.as_ref(),
                    &[FunctionModifiers::Getter],
                );
            }
        }

        getter_prop.visit_children_with(self);
    }

    fn visit_setter_prop(&mut self, setter_prop: &SetterProp) {
        if self.consider_comments && self.has_comment_in_body(&setter_prop.span) {
            return;
        }

        if let Some(BlockStmt { stmts, .. }) = &setter_prop.body {
            if stmts.is_empty() {
                self.check(
                    setter_prop.span,
                    "method",
                    self.methods.as_ref(),
                    &[FunctionModifiers::Setter],
                );
            }
        }

        setter_prop.visit_children_with(self);
    }
}
