use swc_common::errors::HANDLER;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

pub fn color_no_invalid_hex(config: &RuleConfig<()>) -> Box<dyn LintRule> {
    visitor_rule(ColorNoInvalidHex {
        reaction: config.get_rule_reaction(),
    })
}

#[derive(Debug, Default)]
struct ColorNoInvalidHex {
    reaction: LintRuleReaction,
}

impl Visit for ColorNoInvalidHex {
    fn visit_hex_color(&mut self, hex_color: &HexColor) {
        let HexColor { span, value, .. } = hex_color;
        let length = value.len();
        if (length == 3 || length == 4 || length == 6 || length == 8)
            && value.chars().all(|c| c.is_ascii_hexdigit())
        {
            hex_color.visit_children_with(self);
            return;
        }

        let message = format!("Unexpected invalid hex color '#{}'.", value);
        HANDLER.with(|handler| match self.reaction {
            LintRuleReaction::Error => handler.struct_span_err(*span, &message).emit(),
            LintRuleReaction::Warning => handler.struct_span_warn(*span, &message).emit(),
            _ => {}
        });

        hex_color.visit_children_with(self);
    }
}
