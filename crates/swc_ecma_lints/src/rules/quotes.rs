use std::{
    fmt::{self, Debug},
    sync::Arc,
};

use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, SourceMap, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{resolve_string_quote_type, QuotesType},
};

const MUST_USE_SINGLE_QUOTES_MESSAGE: &str = "String must use singlequotes";
const MUST_USE_DOUBLE_QUOTES_MESSAGE: &str = "String must use doublequotes";
const MUST_USE_BACKTICK_QUOTES_MESSAGE: &str = "String must use backtick quotes";

#[derive(Debug, Clone, Default, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuotesConfig {
    #[serde(default)]
    prefer: QuotesType,
    avoid_escape: Option<bool>,
    allow_template_literals: Option<bool>,
}

pub fn quotes(
    source_map: &Arc<SourceMap>,
    config: &RuleConfig<QuotesConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(Quotes::new(source_map.clone(), config))),
    }
}

#[derive(Default)]
struct Quotes {
    expected_reaction: LintRuleReaction,
    prefer: QuotesType,
    avoid_escape: bool,
    allow_template_literals: bool,
    source_map: Arc<SourceMap>,
}

impl Debug for Quotes {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Quotes")
            .field("expected_reaction", &self.expected_reaction)
            .field("prefer", &self.prefer)
            .field("avoid_escape", &self.avoid_escape)
            .field("allow_template_literals", &self.allow_template_literals)
            .finish()
    }
}

impl Quotes {
    fn new(source_map: Arc<SourceMap>, config: &RuleConfig<QuotesConfig>) -> Self {
        let quotes_config = config.get_rule_config();

        Self {
            expected_reaction: *config.get_rule_reaction(),
            prefer: quotes_config.prefer,
            avoid_escape: quotes_config.avoid_escape.unwrap_or(true),
            allow_template_literals: quotes_config.allow_template_literals.unwrap_or(true),
            source_map,
        }
    }

    fn emit_report(&self, span: Span) {
        let message = match &self.prefer {
            QuotesType::Backtick => MUST_USE_BACKTICK_QUOTES_MESSAGE,
            QuotesType::Single => MUST_USE_SINGLE_QUOTES_MESSAGE,
            QuotesType::Double => MUST_USE_DOUBLE_QUOTES_MESSAGE,
        };

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

    fn is_mirroring_escape(&self, value: &str) -> bool {
        let quote = self.prefer.get_char();

        for ch in value.chars() {
            if ch == quote {
                return true;
            }
        }

        false
    }

    fn check_str(&self, is_method_key_check: bool, lit_str: &Str) {
        let found_quote_type = resolve_string_quote_type(&self.source_map, lit_str).unwrap();

        let Str { span, value, .. } = lit_str;

        match (&self.prefer, &found_quote_type) {
            (QuotesType::Double, QuotesType::Single) => {
                if self.avoid_escape && self.is_mirroring_escape(&*value) {
                    return;
                }

                self.emit_report(*span);
            }
            (QuotesType::Single, QuotesType::Double) => {
                if self.avoid_escape && self.is_mirroring_escape(&*value) {
                    return;
                }

                self.emit_report(*span);
            }
            (QuotesType::Backtick, _) => {
                if is_method_key_check {
                    return;
                }

                if self.avoid_escape && self.is_mirroring_escape(&*value) {
                    return;
                }

                self.emit_report(*span);
            }
            _ => {}
        }
    }

    fn check_tpl_str(&self, tpl_str: &Tpl) {
        let Tpl { span, exprs, .. } = tpl_str;

        if self.allow_template_literals {
            return;
        }

        if let QuotesType::Backtick = &self.prefer {
            return;
        }

        if !exprs.is_empty() {
            return;
        }

        self.emit_report(*span);
    }
}

impl Visit for Quotes {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        match expr {
            Expr::Tpl(tpl_str) => {
                self.check_tpl_str(tpl_str);
            }
            Expr::Lit(Lit::Str(lit_str)) => {
                self.check_str(false, lit_str);
            }
            _ => {}
        }
    }

    fn visit_class_method(&mut self, class_method: &ClassMethod) {
        if let Some(lit_str) = class_method.key.as_str() {
            self.check_str(true, lit_str);
        }
    }
}
