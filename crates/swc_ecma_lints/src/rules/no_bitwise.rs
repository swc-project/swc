use serde::{Deserialize, Serialize};
use swc_common::{collections::AHashSet, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoBitwiseConfig {
    allow: Option<Vec<String>>,
    int_32_hint: Option<bool>,
}

pub fn no_bitwise(config: &RuleConfig<NoBitwiseConfig>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoBitwise::new(config))),
    }
}

#[derive(Debug, Default)]
struct NoBitwise {
    expected_reaction: LintRuleReaction,
    allow_binary_ops: Option<AHashSet<BinaryOp>>,
    allow_assign_ops: Option<AHashSet<AssignOp>>,
    allow_bitwise_not: bool,
    allow_int_32_hint: bool,
}

impl NoBitwise {
    fn new(config: &RuleConfig<NoBitwiseConfig>) -> Self {
        let rule_config = config.get_rule_config();

        let mut allow_binary_ops: Option<AHashSet<BinaryOp>> = None;
        let mut allow_assign_ops: Option<AHashSet<AssignOp>> = None;
        let mut allow_bitwise_not: bool = false;

        if let Some(allow) = &rule_config.allow {
            allow.iter().for_each(|op| {
                let op = op.as_str();

                match op {
                    "~" => {
                        allow_bitwise_not = true;
                    }
                    "&" | "^" | "<<" | ">>" | ">>>" => {
                        if allow_binary_ops.is_none() {
                            allow_binary_ops = Some(Default::default());
                        }

                        let allow_binary_ops = allow_binary_ops.as_mut().unwrap();

                        match op {
                            "&" => allow_binary_ops.insert(op!("&")),
                            "^" => allow_binary_ops.insert(op!("^")),
                            "<<" => allow_binary_ops.insert(op!("<<")),
                            ">>" => allow_binary_ops.insert(op!(">>")),
                            ">>>" => allow_binary_ops.insert(op!(">>>")),
                            _ => false,
                        };
                    }
                    "|=" | "&=" | "<<=" | ">>=" | ">>>=" | "^=" => {
                        if allow_assign_ops.is_none() {
                            allow_assign_ops = Some(Default::default());
                        }

                        let allow_assign_ops = allow_assign_ops.as_mut().unwrap();

                        match op {
                            "|=" => allow_assign_ops.insert(op!("|=")),
                            "&=" => allow_assign_ops.insert(op!("&=")),
                            "<<=" => allow_assign_ops.insert(op!("<<=")),
                            ">>=" => allow_assign_ops.insert(op!(">>=")),
                            ">>>=" => allow_assign_ops.insert(op!(">>>=")),
                            "^=" => allow_assign_ops.insert(op!("^=")),
                            _ => false,
                        };
                    }
                    _ => {}
                };
            });
        }

        Self {
            expected_reaction: config.get_rule_reaction(),
            allow_binary_ops,
            allow_assign_ops,
            allow_bitwise_not,
            allow_int_32_hint: rule_config.int_32_hint.unwrap_or(false),
        }
    }

    fn emit_report(&self, span: Span, op: &str) {
        let message = format!("Unexpected use of '{}'", op);

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
}

impl Visit for NoBitwise {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if let Some(allow) = &self.allow_binary_ops {
            if allow.contains(&bin_expr.op) {
                return;
            }
        }

        match bin_expr.op {
            op!("&") | op!("^") | op!("<<") | op!(">>") | op!(">>>") | op!(">>>") => {
                self.emit_report(bin_expr.span, bin_expr.op.as_str());
            }
            op!("|") => {
                if self.allow_int_32_hint {
                    if let Expr::Lit(Lit::Num(Number { value, .. })) = bin_expr.right.as_ref() {
                        if *value == 0f64 {
                            return;
                        }
                    }
                }

                self.emit_report(bin_expr.span, bin_expr.op.as_str());
            }
            _ => {}
        }

        bin_expr.visit_children_with(self);
    }

    fn visit_unary_expr(&mut self, unary_expr: &UnaryExpr) {
        if let op!("~") = &unary_expr.op {
            if self.allow_bitwise_not {
                return;
            }

            self.emit_report(unary_expr.span, unary_expr.op.as_str());
        }

        unary_expr.visit_children_with(self);
    }

    fn visit_assign_expr(&mut self, assign_expr: &AssignExpr) {
        if let Some(allow) = &self.allow_assign_ops {
            if allow.contains(&assign_expr.op) {
                return;
            }
        }

        match assign_expr.op {
            op!("|=") | op!("&=") | op!("<<=") | op!(">>=") | op!(">>>=") | op!("^=") => {
                self.emit_report(assign_expr.span, assign_expr.op.as_str());
            }
            _ => {}
        }
    }
}
