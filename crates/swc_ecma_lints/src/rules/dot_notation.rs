use dashmap::DashMap;
use regex::Regex;
use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, sync::Lazy, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{resolve_string_quote_type, QuotesType},
};

const INVALID_REGEX_MESSAGE: &str = "dotNotation: invalid regex pattern in allowPattern. Check syntax documentation https://docs.rs/regex/latest/regex/#syntax";

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DotNotationConfig {
    allow_keywords: Option<bool>,
    allow_pattern: Option<String>,
}

pub fn dot_notation(
    program: &Program,
    config: &RuleConfig<DotNotationConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(DotNotation::new(program.is_module(), config))),
    }
}

#[derive(Default, Debug)]
struct DotNotation {
    expected_reaction: LintRuleReaction,
    allow_keywords: bool,
    pattern: Option<String>,
    is_module: bool,
}

impl DotNotation {
    fn new(is_module: bool, config: &RuleConfig<DotNotationConfig>) -> Self {
        let dot_notation_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            allow_keywords: dot_notation_config.allow_keywords.unwrap_or(true),
            is_module,
            pattern: dot_notation_config.allow_pattern.clone(),
        }
    }

    fn emit_report(&self, span: Span, quote_type: QuotesType, prop: &str) {
        let message = format!(
            "[{quote}{prop}{quote}] is better written in dot notation",
            prop = prop,
            quote = quote_type.get_char()
        );

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

    fn check(&self, span: Span, quote_type: QuotesType, prop_name: &str) {
        if self.allow_keywords
            && (prop_name.is_reserved() || prop_name.is_reserved_in_strict_mode(self.is_module))
        {
            return;
        }

        if let Some(pattern) = &self.pattern {
            static REGEX_CACHE: Lazy<DashMap<String, Regex, ahash::RandomState>> =
                Lazy::new(Default::default);

            if !REGEX_CACHE.contains_key(pattern) {
                REGEX_CACHE.insert(
                    pattern.clone(),
                    Regex::new(pattern).expect(INVALID_REGEX_MESSAGE),
                );
            }

            if REGEX_CACHE.get(pattern).unwrap().is_match(prop_name) {
                return;
            }
        }

        self.emit_report(span, quote_type, prop_name);
    }
}

impl Visit for DotNotation {
    noop_visit_type!();

    fn visit_member_prop(&mut self, member: &MemberProp) {
        if let MemberProp::Computed(prop) = member {
            match &*prop.expr {
                Expr::Lit(Lit::Str(lit_str)) => {
                    let quote_type = resolve_string_quote_type(lit_str).unwrap();

                    self.check(prop.span, quote_type, &lit_str.value);
                }
                Expr::Member(member) => {
                    member.visit_children_with(self);
                }
                _ => {
                    prop.visit_with(self);
                }
            }
        }
    }
}
