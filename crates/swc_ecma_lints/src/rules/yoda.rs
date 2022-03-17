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
pub enum YodaConfigMode {
    Always,
    Never,
}

impl Default for YodaConfigMode {
    fn default() -> Self {
        Self::Never
    }
}

#[derive(Debug, Clone, Default, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct YodaConfig {
    #[serde(default)]
    mode: YodaConfigMode,
    #[serde(default)]
    except_range: bool,
    #[serde(default)]
    only_equality: bool,
}

pub fn yoda(config: &RuleConfig<YodaConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(Yoda::new(config))),
    }
}

#[derive(Debug, Default)]
struct Yoda {
    expected_reaction: LintRuleReaction,

    mode: YodaConfigMode,
    only_equality: bool,
    except_range: bool,
}

impl Yoda {
    fn new(config: &RuleConfig<YodaConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            mode: rule_config.mode,
            only_equality: rule_config.only_equality,
            except_range: rule_config.except_range,
        }
    }

    fn emit_report(&self, span: Span, op: BinaryOp) {
        let side = match self.mode {
            YodaConfigMode::Always => "left",
            YodaConfigMode::Never => "right",
        };

        let message = format!("Expected literal to be on the {} side of {}", side, op);

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

    fn is_yoda_style(&self, bin_expr: &BinExpr) -> bool {
        let left_expr = bin_expr.left.as_ref();
        match left_expr {
            Expr::Lit(_) => true,
            Expr::Unary(UnaryExpr { op, arg, .. }) => {
                if let (op!(unary, "-"), Expr::Lit(Lit::Num(_))) = (op, arg.as_ref()) {
                    return true;
                }

                false
            }
            Expr::Tpl(Tpl { exprs, .. }) => exprs.is_empty(),
            _ => false,
        }
    }

    fn check(&self, bin_expr: &BinExpr) {
        if self.only_equality {
            match bin_expr.op {
                op!("===") | op!("==") => {}
                _ => {
                    return;
                }
            }
        }

        self.emit_report(bin_expr.span, bin_expr.op);
    }
}

impl Visit for Yoda {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if self.except_range && op!("&&") == bin_expr.op {
            if let (
                Expr::Bin(BinExpr {
                    op: op!("<") | op!("<="),
                    ..
                }),
                Expr::Bin(BinExpr {
                    op: op!(">") | op!(">="),
                    ..
                }),
            ) = (bin_expr.left.as_ref(), bin_expr.right.as_ref())
            {
                return;
            }
        }

        match (self.is_yoda_style(bin_expr), self.mode) {
            (true, YodaConfigMode::Never) | (false, YodaConfigMode::Always) => {
                self.check(bin_expr);
            }
            _ => {}
        }

        bin_expr.visit_children_with(self);
    }
}
