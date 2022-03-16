use std::{
    fmt::{self, Debug},
    sync::Arc,
};

use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, SourceMap, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{extract_arg_val, ArgValue},
};

const UNEXPECTED_REG_EXP_MESSAGE: &str =
    "Use a regular expression literal instead of the 'RegExp' constructor";
const UNEXPECTED_REDUNDANT_REG_EXP_MESSAGE: &str =
    "Regular expression literal is unnecessarily wrapped within a 'RegExp' constructor";
const UNEXPECTED_REDUNDANT_REG_EXP_WITH_FLAGS_MESSAGE: &str =
    "Use regular expression literal with flags instead of the 'RegExp' constructor";

const MAX_VALID_ARGS_COUNT: usize = 2;

const GLOBAL_THIS: &str = "globalThis";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreferRegexLiteralsConfig {
    disallow_redundant_wrapping: Option<bool>,
}

pub fn prefer_regex_literals(
    program: &Program,
    source_map: &Arc<SourceMap>,
    config: &RuleConfig<PreferRegexLiteralsConfig>,
    top_level_ctxt: SyntaxContext,
    es_version: EsVersion,
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    let disallow_redundant_wrapping = config
        .get_rule_config()
        .disallow_redundant_wrapping
        .unwrap_or(false);

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(PreferRegexLiterals::new(
            source_map.clone(),
            rule_reaction,
            disallow_redundant_wrapping,
            collect_decls_with_ctxt(program, top_level_ctxt),
            top_level_ctxt,
            es_version,
        ))),
    }
}

#[derive(Default)]
struct PreferRegexLiterals {
    expected_reaction: LintRuleReaction,
    source_map: Arc<SourceMap>,
    disallow_redundant_wrapping: bool,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
    allow_global_this: bool,
    call_span: Option<Span>,
    first_arg: Option<ArgValue>,
    second_arg: Option<ArgValue>,
}

impl Debug for PreferRegexLiterals {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("PreferRegexLiterals")
            .field("expected_reaction", &self.expected_reaction)
            .field(
                "disallow_redundant_wrapping",
                &self.disallow_redundant_wrapping,
            )
            .field("top_level_ctxt", &self.top_level_ctxt)
            .field("top_level_declared_vars", &self.top_level_declared_vars)
            .field("allow_global_this", &self.allow_global_this)
            .field("call_span", &self.call_span)
            .field("first_arg", &self.first_arg)
            .field("second_arg", &self.second_arg)
            .finish()
    }
}

impl PreferRegexLiterals {
    fn new(
        source_map: Arc<SourceMap>,
        expected_reaction: LintRuleReaction,
        disallow_redundant_wrapping: bool,
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        es_version: EsVersion,
    ) -> Self {
        Self {
            expected_reaction,
            source_map,
            disallow_redundant_wrapping,
            top_level_ctxt,
            top_level_declared_vars,
            allow_global_this: es_version < EsVersion::Es2020,
            call_span: None,
            first_arg: None,
            second_arg: None,
        }
    }

    fn reset_state(&mut self) {
        self.call_span = None;
        self.first_arg = None;
        self.second_arg = None;
    }

    fn set_state(&mut self, call_span: Span, args: &[ExprOrSpread]) {
        self.call_span = Some(call_span);

        if let Some(ExprOrSpread { expr, .. }) = args.get(0) {
            self.first_arg = Some(extract_arg_val(
                &self.source_map,
                &self.top_level_ctxt,
                &self.top_level_declared_vars,
                expr.as_ref(),
                true,
            ));
        }

        if let Some(ExprOrSpread { expr, .. }) = args.get(1) {
            self.second_arg = Some(extract_arg_val(
                &self.source_map,
                &self.top_level_ctxt,
                &self.top_level_declared_vars,
                expr.as_ref(),
                true,
            ));
        }
    }

    fn emit_report(&self, message: &str) {
        let span = self.call_span.unwrap();

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, message).emit();
            }
            _ => {}
        });
    }

    fn check(&self, sym: &str) {
        use ArgValue::*;

        if sym == "RegExp" {
            match (self.first_arg.as_ref(), self.second_arg.as_ref()) {
                (Some(Str(_)), None) => self.emit_report(UNEXPECTED_REG_EXP_MESSAGE),
                (Some(Str(_)), Some(Str(_))) => self.emit_report(UNEXPECTED_REG_EXP_MESSAGE),
                (Some(RegExp { .. }), None) => {
                    if self.disallow_redundant_wrapping {
                        self.emit_report(UNEXPECTED_REDUNDANT_REG_EXP_MESSAGE);
                    }
                }
                (Some(RegExp { .. }), Some(Str(_))) => {
                    if self.disallow_redundant_wrapping {
                        self.emit_report(UNEXPECTED_REDUNDANT_REG_EXP_WITH_FLAGS_MESSAGE);
                    }
                }
                _ => {}
            }
        }
    }
}

impl Visit for PreferRegexLiterals {
    noop_visit_type!();

    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        if let Some(args) = &new_expr.args {
            if args.len() <= MAX_VALID_ARGS_COUNT {
                self.set_state(new_expr.span, args);
            }
        }

        new_expr.visit_children_with(self);

        self.reset_state();
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if call_expr.args.len() <= MAX_VALID_ARGS_COUNT {
            if let Some(expr) = call_expr.callee.as_expr() {
                match expr.as_ref() {
                    Expr::Ident(_) => {
                        self.set_state(call_expr.span, &call_expr.args);
                    }
                    Expr::Member(_) => {
                        self.set_state(call_expr.span, &call_expr.args);
                    }
                    _ => {}
                }
            }
        }

        call_expr.visit_children_with(self);

        self.reset_state();
    }

    fn visit_ident(&mut self, ident: &Ident) {
        if ident.span.ctxt != self.top_level_ctxt {
            return;
        }

        if self.top_level_declared_vars.contains(&ident.to_id()) {
            return;
        }

        if self.call_span.is_none() {
            return;
        }

        self.check(&*ident.sym);
    }

    fn visit_member_expr(&mut self, member_expr: &MemberExpr) {
        if self.allow_global_this {
            return;
        }

        if self.call_span.is_none() {
            return;
        }

        if let Some(ident) = member_expr.obj.as_ident() {
            if ident.span.ctxt != self.top_level_ctxt {
                return;
            }

            if self.top_level_declared_vars.contains(&ident.to_id()) {
                return;
            }

            if &*ident.sym != GLOBAL_THIS {
                return;
            }
        } else {
            return;
        }

        match &member_expr.prop {
            MemberProp::Ident(ident) => {
                self.check(&*ident.sym);
            }
            MemberProp::Computed(comp) => {
                if let Expr::Lit(Lit::Str(Str { value, .. })) = comp.expr.as_ref() {
                    self.check(&*value);
                }
            }
            _ => {}
        }
    }
}
