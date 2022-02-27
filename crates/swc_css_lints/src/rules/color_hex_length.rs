use serde::{Deserialize, Serialize};
use swc_common::errors::HANDLER;
use swc_css_ast::*;
use swc_css_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, LintRule},
};

pub type ColorHexLengthConfig = Option<HexForm>;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum HexForm {
    Long,
    Short,
}

impl Default for HexForm {
    fn default() -> Self {
        Self::Long
    }
}

pub fn color_hex_length(config: &RuleConfig<ColorHexLengthConfig>) -> Box<dyn LintRule> {
    visitor_rule(ColorHexLength {
        reaction: config.get_rule_reaction(),
        form: config.get_rule_config().clone().unwrap_or_default(),
    })
}

#[derive(Debug, Default)]
struct ColorHexLength {
    reaction: LintRuleReaction,
    form: HexForm,
}

impl ColorHexLength {
    fn build_message(&self, actual: &str, expected: &str) -> String {
        format!(
            "Hex color value '#{}' should be written into: '#{}'.",
            actual, expected
        )
    }
}

impl Visit for ColorHexLength {
    fn visit_hex_color(&mut self, hex_color: &HexColor) {
        match self.form {
            HexForm::Long => {
                if let Some(lengthened) = lengthen(&hex_color.value) {
                    let message = self.build_message(&hex_color.value, &lengthened);
                    HANDLER.with(|handler| match self.reaction {
                        LintRuleReaction::Error => {
                            handler.struct_span_err(hex_color.span, &message).emit()
                        }
                        LintRuleReaction::Warning => {
                            handler.struct_span_warn(hex_color.span, &message).emit()
                        }
                        _ => {}
                    });
                }
            }
            HexForm::Short => {
                if let Some(shortened) = shorten(&hex_color.value) {
                    let message = self.build_message(&hex_color.value, &shortened);
                    HANDLER.with(|handler| match self.reaction {
                        LintRuleReaction::Error => {
                            handler.struct_span_err(hex_color.span, &message).emit()
                        }
                        LintRuleReaction::Warning => {
                            handler.struct_span_warn(hex_color.span, &message).emit()
                        }
                        _ => {}
                    });
                }
            }
        }

        hex_color.visit_children_with(self);
    }
}

fn shorten(hex: &str) -> Option<String> {
    let chars = hex.chars().collect::<Vec<_>>();
    match &*chars {
        [c1, c2, c3, c4, c5, c6] if c1 == c2 && c3 == c4 && c5 == c6 => {
            Some(format!("{c1}{c3}{c5}"))
        }
        [c1, c2, c3, c4, c5, c6, c7, c8] if c1 == c2 && c3 == c4 && c5 == c6 && c7 == c8 => {
            Some(format!("{c1}{c3}{c5}{c7}"))
        }
        _ => None,
    }
}

fn lengthen(hex: &str) -> Option<String> {
    let chars = hex.chars().collect::<Vec<_>>();
    match &*chars {
        [c1, c2, c3] => Some(format!("{r}{r}{g}{g}{b}{b}", r = c1, g = c2, b = c3)),
        [c1, c2, c3, c4] => Some(format!(
            "{r}{r}{g}{g}{b}{b}{a}{a}",
            r = c1,
            g = c2,
            b = c3,
            a = c4
        )),
        _ => None,
    }
}
