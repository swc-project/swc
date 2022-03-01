use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AtRuleNoUnknownConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn at_rule_no_unknown(ctx: LintRuleContext<AtRuleNoUnknownConfig>) -> Box<dyn LintRule> {
    let ignored = ctx.config().ignore_at_rules.clone().unwrap_or_default();
    visitor_rule(ctx.reaction(), AtRuleNoUnknown { ctx, ignored })
}

#[derive(Debug, Default)]
struct AtRuleNoUnknown {
    ctx: LintRuleContext<AtRuleNoUnknownConfig>,
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
            self.ctx.report(&unknown_at_rule.name, message);
        }

        unknown_at_rule.visit_children_with(self);
    }
}
