use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitNoUnknownConfig {
    ignore_units: Option<Vec<String>>,
}

pub fn unit_no_unknown(ctx: LintRuleContext<UnitNoUnknownConfig>) -> Box<dyn LintRule> {
    let ignored_units = ctx.config().ignore_units.clone().unwrap_or_default();
    visitor_rule(UnitNoUnknown { ctx, ignored_units })
}

#[derive(Debug, Default)]
struct UnitNoUnknown {
    ctx: LintRuleContext<UnitNoUnknownConfig>,
    ignored_units: Vec<String>,
}

impl Visit for UnitNoUnknown {
    fn visit_unknown_dimension(&mut self, unknown_dimension: &UnknownDimension) {
        let unit = &unknown_dimension.unit.value;

        if self.ignored_units.iter().all(|item| unit != item) {
            let message = format!("Unexpected unknown unit \"{}\".", unit);
            self.ctx.report(&unknown_dimension.unit, message);
        }

        unknown_dimension.visit_children_with(self);
    }
}
