use serde::{Deserialize, Serialize};
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub type ColorHexAlphaConfig = Option<Preference>;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Preference {
    Always,
    Never,
}

impl Default for Preference {
    fn default() -> Self {
        Self::Always
    }
}

pub fn color_hex_alpha(ctx: LintRuleContext<ColorHexAlphaConfig>) -> Box<dyn LintRule> {
    let preference = ctx.config().clone().unwrap_or_default();
    visitor_rule(ctx.reaction(), ColorHexAlpha { ctx, preference })
}

#[derive(Debug, Default)]
struct ColorHexAlpha {
    ctx: LintRuleContext<ColorHexAlphaConfig>,
    preference: Preference,
}

impl Visit for ColorHexAlpha {
    fn visit_hex_color(&mut self, hex_color: &HexColor) {
        let length = hex_color.value.len();
        match self.preference {
            Preference::Always if length == 3 || length == 6 => {
                self.ctx.report(
                    hex_color,
                    format!("Expected alpha channel in '#{}'.", hex_color.value),
                );
            }
            Preference::Never if length == 4 || length == 8 => {
                self.ctx.report(
                    hex_color,
                    format!("Unexpected alpha channel in '#{}'.", hex_color.value),
                );
            }
            _ => {}
        }

        hex_color.visit_children_with(self);
    }
}
