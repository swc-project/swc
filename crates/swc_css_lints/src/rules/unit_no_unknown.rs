use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    pattern::NamePattern,
    rule::{visitor_rule, LintRule, LintRuleContext},
    ConfigError,
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnitNoUnknownConfig {
    ignore_units: Option<Vec<String>>,
}

pub fn unit_no_unknown(
    ctx: LintRuleContext<UnitNoUnknownConfig>,
) -> Result<Box<dyn LintRule>, ConfigError> {
    let ignored_units = ctx
        .config()
        .ignore_units
        .clone()
        .unwrap_or_default()
        .into_iter()
        .map(NamePattern::try_from)
        .collect::<Result<_, _>>()?;
    Ok(visitor_rule(
        ctx.reaction(),
        UnitNoUnknown { ctx, ignored_units },
    ))
}

#[derive(Debug, Default)]
struct UnitNoUnknown {
    ctx: LintRuleContext<UnitNoUnknownConfig>,
    ignored_units: Vec<NamePattern>,
}

impl Visit for UnitNoUnknown {
    fn visit_unknown_dimension(&mut self, unknown_dimension: &UnknownDimension) {
        let unit = &unknown_dimension.unit.value;

        if self.ignored_units.iter().all(|item| !item.is_match(unit)) {
            let message = format!("Unexpected unknown unit \"{}\".", unit);
            self.ctx.report(&unknown_dimension.unit, message);
        }

        unknown_dimension.visit_children_with(self);
    }

    fn visit_component_value(&mut self, component_value: &ComponentValue) {
        match component_value {
            ComponentValue::PreservedToken(
                token_and_span @ TokenAndSpan {
                    token: Token::Dimension { unit, .. },
                    ..
                },
            ) => {
                if self.ignored_units.iter().all(|item| !item.is_match(unit)) {
                    let message = format!("Unexpected unknown unit \"{}\".", unit);
                    self.ctx.report(token_and_span, message);
                }
            }
            _ => {}
        }

        component_value.visit_children_with(self);
    }
}
