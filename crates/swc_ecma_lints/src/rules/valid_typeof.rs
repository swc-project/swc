use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Invalid typeof comparison value";

const VALID_TYPES: &[&str] = &[
    "undefined",
    "object",
    "boolean",
    "number",
    "string",
    "function",
    "symbol",
    "bigint",
];

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidTypeofConfig {
    require_string_literals: Option<bool>,
}

pub fn valid_typeof(config: &RuleConfig<ValidTypeofConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(ValidTypeof::new(config))),
    }
}

#[derive(Debug, Default)]
struct ValidTypeof {
    expected_reaction: LintRuleReaction,
    require_string_literals: bool,
}

impl ValidTypeof {
    fn new(config: &RuleConfig<ValidTypeofConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            require_string_literals: rule_config.require_string_literals.unwrap_or(true),
        }
    }

    fn emit_report(&self, span: Span) {
        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, MESSAGE).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, MESSAGE).emit();
            }
            _ => {}
        });
    }

    fn check(&self, span: Span, str_operand: &str) {
        if !VALID_TYPES.contains(&str_operand) {
            self.emit_report(span);
        }
    }
}

impl Visit for ValidTypeof {
    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if let op!("==") | op!("===") | op!("!=") | op!("!==") = bin_expr.op {
            match (bin_expr.left.as_ref(), bin_expr.right.as_ref()) {
                // case typeof x === "type"
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                    Expr::Lit(Lit::Str(Str { value, .. })),
                ) => {
                    self.check(bin_expr.span, value);
                }
                // case "type" === typeof x
                (
                    Expr::Lit(Lit::Str(Str { value, .. })),
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                ) => {
                    self.check(bin_expr.span, value);
                }
                // case typeof x === typeof y
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                ) => {}
                // case typeof x === foo()
                (
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                    _,
                ) => {
                    if self.require_string_literals {
                        self.emit_report(bin_expr.span);
                    }
                }
                // case foo() === typeof x
                (
                    _,
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"), ..
                    }),
                ) => {
                    if self.require_string_literals {
                        self.emit_report(bin_expr.span);
                    }
                }
                _ => {}
            }
        }

        bin_expr.visit_children_with(self);
    }
}
