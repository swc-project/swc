use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
    rules::utils::{resolve_string_quote_type, QuotesType},
};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{
    fmt::{self, Debug},
    sync::Arc,
};
use swc_common::{collections::AHashSet, errors::HANDLER, sync::Lazy, SourceMap, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

static KEYWORDS: Lazy<AHashSet<&'static str>> = Lazy::new(|| {
    let mut keywords: AHashSet<&'static str> = AHashSet::default();

    [
        "abstract",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "do",
        "double",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "final",
        "finally",
        "float",
        "for",
        "function",
        "goto",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "int",
        "interface",
        "long",
        "native",
        "new",
        "null",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "super",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "true",
        "try",
        "typeof",
        "var",
        "void",
        "volatile",
        "while",
        "with",
    ]
    .iter()
    .for_each(|keyword| {
        keywords.insert(*keyword);
    });

    keywords
});

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DotNotationConfig {
    allow_keywords: Option<bool>,
    allow_pattern: Option<String>,
}

pub fn dot_notation(
    source_map: &Arc<SourceMap>,
    config: &RuleConfig<DotNotationConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(DotNotation::new(source_map.clone(), config))),
    }
}

#[derive(Default)]
struct DotNotation {
    expected_reaction: LintRuleReaction,
    allow_keywords: bool,
    pattern: Option<Regex>,
    source_map: Arc<SourceMap>,
}

impl Debug for DotNotation {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("DotNotation")
            .field("expected_reaction", &self.expected_reaction)
            .field("allow_keywords", &self.allow_keywords)
            .field("pattern", &self.pattern)
            .finish()
    }
}

impl DotNotation {
    fn new(source_map: Arc<SourceMap>, config: &RuleConfig<DotNotationConfig>) -> Self {
        let dot_notation_config = config.get_rule_config();

        Self {
            expected_reaction: *config.get_rule_reaction(),
            allow_keywords: dot_notation_config.allow_keywords.unwrap_or(true),
            source_map,
            pattern: dot_notation_config
                .allow_pattern
                .as_ref()
                .map(|patter| Regex::new(patter).unwrap()),
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
        if self.allow_keywords && KEYWORDS.contains(&prop_name) {
            return;
        }

        if let Some(pattern) = &self.pattern {
            if pattern.is_match(prop_name) {
                return;
            }
        }

        self.emit_report(span, quote_type, prop_name);
    }
}

impl Visit for DotNotation {
    noop_visit_type!();

    fn visit_member_prop(&mut self, member: &MemberProp) {
        if let Some(prop) = member.as_computed() {
            match prop.expr.as_ref() {
                Expr::Lit(Lit::Str(Str { value, span, .. })) => {
                    let quote_type = resolve_string_quote_type(&self.source_map, span).unwrap();

                    self.check(prop.span, quote_type, &*value);
                }
                Expr::Member(member) => {
                    member.visit_children_with(self);
                }
                _ => {}
            }
        }
    }
}
