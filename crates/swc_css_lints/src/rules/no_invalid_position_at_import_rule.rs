use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    pattern::NamePattern,
    rule::{visitor_rule, LintRule, LintRuleContext},
    ConfigError,
};

const MESSAGE: &str = "Unexpected invalid position '@import' rule.";

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoInvalidPositionAtImportRuleConfig {
    ignore_at_rules: Option<Vec<String>>,
}

pub fn no_invalid_position_at_import_rule(
    ctx: LintRuleContext<NoInvalidPositionAtImportRuleConfig>,
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
        NoInvalidPositionAtImportRule { ctx, ignored },
    ))
}

#[derive(Debug, Default)]
struct NoInvalidPositionAtImportRule {
    ctx: LintRuleContext<NoInvalidPositionAtImportRuleConfig>,
    ignored: Vec<NamePattern>,
}

impl Visit for NoInvalidPositionAtImportRule {
    fn visit_stylesheet(&mut self, stylesheet: &Stylesheet) {
        stylesheet.rules.iter().fold(false, |seen, rule| {
            if seen
                && rule
                    .as_at_rule()
                    .and_then(|at_rule| at_rule.prelude.as_ref())
                    .map(|prelude| prelude.is_import_prelude())
                    .unwrap_or_default()
            {
                self.ctx.report(rule, MESSAGE);
            }

            // TODO improve me https://www.w3.org/TR/css-cascade-5/#layer-empty - @import and @namespace rules must be consecutive
            let Rule::AtRule(at_rule) = rule else {
                return true;
            };

            let AtRule {
                name,
                prelude,
                block,
                ..
            } = &**at_rule;

            if let Some(prelude) = prelude {
                match &**prelude {
                    AtRulePrelude::CharsetPrelude(_) | AtRulePrelude::ImportPrelude(_) => {
                        return seen
                    }
                    AtRulePrelude::LayerPrelude(_) => match block {
                        Some(block) if block.value.is_empty() => return seen,
                        None => return seen,
                        _ => return true,
                    },
                    _ => {}
                }
            };

            let name = match name {
                AtRuleName::DashedIdent(dashed_ident) => &dashed_ident.value,
                AtRuleName::Ident(ident) => &ident.value,
            };

            if self.ignored.iter().any(|item| item.is_match(name)) {
                seen
            } else {
                true
            }
        });

        stylesheet.visit_children_with(self);
    }
}
