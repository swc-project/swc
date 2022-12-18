use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::rule::{visitor_rule, LintRule, LintRuleContext};

pub fn color_no_invalid_hex(ctx: LintRuleContext<()>) -> Box<dyn LintRule> {
    visitor_rule(ctx.reaction(), ColorNoInvalidHex { ctx })
}

#[derive(Debug, Default)]
struct ColorNoInvalidHex {
    ctx: LintRuleContext<()>,
}

impl Visit for ColorNoInvalidHex {
    fn visit_hex_color(&mut self, hex_color: &HexColor) {
        let HexColor { value, .. } = hex_color;
        let length = value.len();
        if (length == 3 || length == 4 || length == 6 || length == 8)
            && value.chars().all(|c| c.is_ascii_hexdigit())
        {
            hex_color.visit_children_with(self);
            return;
        }

        let message = format!("Unexpected invalid hex color '#{}'.", value);

        self.ctx.report(hex_color, message);

        hex_color.visit_children_with(self);
    }
}
