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
pub struct AtRuleNoUnknownConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn at_rule_no_unknown(
    ctx: LintRuleContext<AtRuleNoUnknownConfig>,
) -> Result<Box<dyn LintRule>, ConfigError> {
    let ignored = ctx
        .config()
        .ignore_at_rules
        .clone()
        .unwrap_or_default()
        .into_iter()
        .map(NamePattern::try_from)
        .collect::<Result<_, _>>()?;
    Ok(visitor_rule(
        ctx.reaction(),
        AtRuleNoUnknown { ctx, ignored },
    ))
}

#[derive(Debug, Default)]
struct AtRuleNoUnknown {
    ctx: LintRuleContext<AtRuleNoUnknownConfig>,
    ignored: Vec<NamePattern>,
}

impl Visit for AtRuleNoUnknown {
    fn visit_at_rule(&mut self, at_rule: &AtRule) {
        if let AtRuleName::Ident(Ident { value, .. }) = &at_rule.name {
            if let Some(AtRulePrelude::ListOfComponentValues(_)) = at_rule.prelude.as_deref() {
                if self.ignored.iter().all(|item| !item.is_match(value)) {
                    let message = format!("Unexpected unknown at-rule \"@{}\".", &value);

                    self.ctx.report(&at_rule.name, message);
                }
            }
        }

        at_rule.visit_children_with(self);
    }
}
