use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Spanned};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AtRuleNoUnknownConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn at_rule_no_unknown(config: &RuleConfig<AtRuleNoUnknownConfig>) -> Box<dyn Rule> {
    visitor_rule(AtRuleNoUnknown {
        reaction: config.get_rule_reaction(),
        ignored: config
            .get_rule_config()
            .ignore_at_rules
            .clone()
            .unwrap_or_default(),
    })
}

#[derive(Debug, Default)]
struct AtRuleNoUnknown {
    reaction: LintRuleReaction,
    ignored: Vec<String>,
}

impl Visit for AtRuleNoUnknown {
    fn visit_unknown_at_rule(&mut self, unknown_at_rule: &UnknownAtRule) {
        let name = match &unknown_at_rule.name {
            AtRuleName::DashedIdent(dashed_ident) => &dashed_ident.value,
            AtRuleName::Ident(ident) => &ident.value,
        };

        if self.ignored.iter().all(|item| name != item) {
            let message = format!("Unexpected unknown at-rule \"@{}\".", name);

            HANDLER.with(|handler| match self.reaction {
                LintRuleReaction::Error => handler
                    .struct_span_err(unknown_at_rule.name.span(), &message)
                    .emit(),
                LintRuleReaction::Warning => handler
                    .struct_span_warn(unknown_at_rule.name.span(), &message)
                    .emit(),
                _ => {}
            });
        }

        unknown_at_rule.visit_children_with(self);
    }
}
