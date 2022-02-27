use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Spanned};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

const MESSAGE: &str = "Unexpected invalid position '@import' rule.";

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoInvalidPositionAtImportRuleConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn no_invalid_position_at_import_rule(
    config: &RuleConfig<NoInvalidPositionAtImportRuleConfig>,
) -> Box<dyn LintRule> {
    visitor_rule(NoInvalidPositionAtImportRule {
        reaction: config.get_rule_reaction(),
        ignored: config
            .get_rule_config()
            .ignore_at_rules
            .clone()
            .unwrap_or_default(),
    })
}

#[derive(Debug, Default)]
struct NoInvalidPositionAtImportRule {
    reaction: LintRuleReaction,
    ignored: Vec<String>,
}

impl Visit for NoInvalidPositionAtImportRule {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        stylesheet.rules.iter().fold(false, |seen, rule| {
            if seen && matches!(rule, Rule::AtRule(AtRule::Import(..))) {
                HANDLER.with(|handler| match self.reaction {
                    LintRuleReaction::Error => handler.struct_span_err(rule.span(), MESSAGE).emit(),
                    LintRuleReaction::Warning => {
                        handler.struct_span_warn(rule.span(), MESSAGE).emit()
                    }
                    _ => {}
                });
            }

            match rule {
                Rule::AtRule(AtRule::Charset(..) | AtRule::Import(..)) => seen,
                Rule::AtRule(AtRule::Unknown(UnknownAtRule { name, .. })) => {
                    let name = match name {
                        AtRuleName::DashedIdent(dashed_ident) => &dashed_ident.value,
                        AtRuleName::Ident(ident) => &ident.value,
                    };
                    if self.ignored.iter().any(|item| name == item) {
                        seen
                    } else {
                        true
                    }
                }
                _ => true,
            }
        });

        stylesheet.visit_children_with(self);
    }
}
