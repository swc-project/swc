use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Spanned};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitNoUnknownConfig {
    ignore_units: Option<Vec<String>>,
}

pub fn unit_no_unknown(config: &RuleConfig<UnitNoUnknownConfig>) -> Box<dyn LintRule> {
    visitor_rule(UnitNoUnknown {
        reaction: config.get_rule_reaction(),
        ignored_units: config
            .get_rule_config()
            .ignore_units
            .clone()
            .unwrap_or_default(),
    })
}

#[derive(Debug, Default)]
struct UnitNoUnknown {
    reaction: LintRuleReaction,
    ignored_units: Vec<String>,
}

impl Visit for UnitNoUnknown {
    fn visit_unknown_dimension(&mut self, unknown_dimension: &UnknownDimension) {
        let unit = &unknown_dimension.unit.value;

        if self.ignored_units.iter().all(|item| unit != item) {
            let message = format!("Unexpected unknown unit \"{}\".", unit);

            HANDLER.with(|handler| match self.reaction {
                LintRuleReaction::Error => handler
                    .struct_span_err(unknown_dimension.unit.span(), &message)
                    .emit(),
                LintRuleReaction::Warning => handler
                    .struct_span_warn(unknown_dimension.unit.span(), &message)
                    .emit(),
                _ => {}
            });
        }

        unknown_dimension.visit_children_with(self);
    }
}
