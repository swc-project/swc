use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};
use regex::Regex;
use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, sync::Lazy, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

static KEYWORDS: Lazy<AHashSet<&'static str>> = Lazy::new(|| {
    let mut keywords: AHashSet<&'static str> = AHashSet::default();

    ([
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
    ])
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

pub fn dot_notation(config: &RuleConfig<DotNotationConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(DotNotation::new(config))),
    }
}

#[derive(Debug, Default)]
struct DotNotation {
    expected_reaction: LintRuleReaction,
    allow_keywords: bool,
    pattern: Option<Regex>,
}

impl DotNotation {
    fn new(config: &RuleConfig<DotNotationConfig>) -> Self {
        let dot_notation_config = config.get_rule_config();

        Self {
            expected_reaction: *config.get_rule_reaction(),
            allow_keywords: dot_notation_config.allow_keywords.unwrap_or(true),
            pattern: dot_notation_config
                .allow_pattern
                .as_ref()
                .map(|patter| Regex::new(patter).unwrap()),
        }
    }

    fn emit_report(&self, span: Span, prop: &str) {
        let message = format!("[{}] is better written in dot notation", prop);

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

    fn check(&self, span: Span, prop_name: &str) {
        if self.allow_keywords && KEYWORDS.contains(&prop_name) {
            return;
        }

        if let Some(pattern) = &self.pattern {
            if pattern.is_match(prop_name) {
                return;
            }
        }

        self.emit_report(span, prop_name);
    }
}

impl Visit for DotNotation {
    noop_visit_type!();

    fn visit_member_prop(&mut self, member: &MemberProp) {
        if let Some(prop) = member.as_computed() {
            match prop.expr.as_ref() {
                Expr::Lit(Lit::Str(Str { value, .. })) => {
                    self.check(prop.span, &*value);
                }
                Expr::Member(member) => {
                    member.visit_children_with(self);
                }
                _ => {}
            }
        }
    }
}
