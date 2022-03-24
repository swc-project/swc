use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum EqEqEqMode {
    Always,
    Never,
}

impl Default for EqEqEqMode {
    fn default() -> Self {
        Self::Always
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct EqeqeqConfig {
    #[serde(default)]
    mode: EqEqEqMode,
}

pub fn eqeqeq(config: &RuleConfig<EqeqeqConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(Eqeqeq::new(config))),
    }
}

#[derive(Debug, Default)]
struct Eqeqeq {
    expected_reaction: LintRuleReaction,
    mode: EqEqEqMode,
}

impl Eqeqeq {
    fn new(config: &RuleConfig<EqeqeqConfig>) -> Self {
        Self {
            expected_reaction: config.get_rule_reaction(),
            mode: config.get_rule_config().mode,
        }
    }

    fn emit_report(&self, span: Span, actual: &str, expected: &str) {
        let message = format!("Use '{}' instead of '{}'", expected, actual);

        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, &message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, &message).emit();
            }
            _ => {}
        });
    }

    fn check(&self, span: Span, bin_op: &BinaryOp) {
        match bin_op {
            op!("==") => {
                if let EqEqEqMode::Always = self.mode {
                    self.emit_report(span, "==", "===");
                }
            }
            op!("!=") => {
                if let EqEqEqMode::Always = self.mode {
                    self.emit_report(span, "!=", "!==");
                }
            }
            op!("===") => {
                if let EqEqEqMode::Never = self.mode {
                    self.emit_report(span, "===", "==");
                }
            }
            op!("!==") => {
                if let EqEqEqMode::Never = self.mode {
                    self.emit_report(span, "!==", "!=");
                }
            }
            _ => {}
        }
    }
}

impl Visit for Eqeqeq {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        self.check(bin_expr.span, &bin_expr.op);

        bin_expr.visit_children_with(self);
    }
}
