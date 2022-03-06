use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

const MESSAGE: &str = "Unexpected invalid position '@import' rule.";

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoInvalidPositionAtImportRuleConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn no_invalid_position_at_import_rule(
    ctx: LintRuleContext<NoInvalidPositionAtImportRuleConfig>,
) -> Box<dyn LintRule> {
    let ignored = ctx.config().ignore_at_rules.clone().unwrap_or_default();
    visitor_rule(
        ctx.reaction(),
        NoInvalidPositionAtImportRule { ctx, ignored },
    )
}

#[derive(Debug, Default)]
struct NoInvalidPositionAtImportRule {
    ctx: LintRuleContext<NoInvalidPositionAtImportRuleConfig>,
    ignored: Vec<String>,
}

impl Visit for NoInvalidPositionAtImportRule {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        stylesheet.rules.iter().fold(false, |seen, rule| {
            if seen && matches!(rule, Rule::AtRule(AtRule::Import(..))) {
                self.ctx.report(rule, MESSAGE);
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
