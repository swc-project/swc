use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span};
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
    allow_binary_ops: u32,
    allow_assign_ops: u32,
    allow_bitwise_not: bool,
    allow_int_32_hint: bool,
}

impl NoBitwise {
    fn new(config: &RuleConfig<NoBitwiseConfig>) -> Self {
        let rule_config = config.get_rule_config();

        let mut allow_binary_ops = 0;
        let mut allow_assign_ops = 0;
        let mut allow_bitwise_not: bool = false;

        if let Some(allow) = &rule_config.allow {
            allow.iter().for_each(|op| {
                let op = op.as_str();

                match op {
                    "~" => {
                        allow_bitwise_not = true;
                    }
                    "&" => allow_binary_ops |= binary_op_bit(op!("&")),
                    "^" => allow_binary_ops |= binary_op_bit(op!("^")),
                    "<<" => allow_binary_ops |= binary_op_bit(op!("<<")),
                    ">>" => allow_binary_ops |= binary_op_bit(op!(">>")),
                    ">>>" => allow_binary_ops |= binary_op_bit(op!(">>>")),
                    "|=" => allow_assign_ops |= assign_op_bit(op!("|=")),
                    "&=" => allow_assign_ops |= assign_op_bit(op!("&=")),
                    "<<=" => allow_assign_ops |= assign_op_bit(op!("<<=")),
                    ">>=" => allow_assign_ops |= assign_op_bit(op!(">>=")),
                    ">>>=" => allow_assign_ops |= assign_op_bit(op!(">>>=")),
                    "^=" => allow_assign_ops |= assign_op_bit(op!("^=")),
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
        let message = format!("Unexpected use of '{op}'");

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

/// Maps a supported binary operator to its bit in the allow mask.
const fn binary_op_bit(op: BinaryOp) -> u32 {
    match op {
        BinaryOp::BitAnd => 1 << 0,
        BinaryOp::BitXor => 1 << 1,
        BinaryOp::LShift => 1 << 2,
        BinaryOp::RShift => 1 << 3,
        BinaryOp::ZeroFillRShift => 1 << 4,
        _ => 0,
    }
}

/// Maps a supported assignment operator to its bit in the allow mask.
const fn assign_op_bit(op: AssignOp) -> u32 {
    match op {
        AssignOp::BitOrAssign => 1 << 0,
        AssignOp::BitAndAssign => 1 << 1,
        AssignOp::LShiftAssign => 1 << 2,
        AssignOp::RShiftAssign => 1 << 3,
        AssignOp::ZeroFillRShiftAssign => 1 << 4,
        AssignOp::BitXorAssign => 1 << 5,
        _ => 0,
    }
}

impl Visit for NoBitwise {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        if self.allow_binary_ops & binary_op_bit(bin_expr.op) != 0 {
            return;
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
        if self.allow_assign_ops & assign_op_bit(assign_expr.op) != 0 {
            return;
        }

        match assign_expr.op {
            op!("|=") | op!("&=") | op!("<<=") | op!(">>=") | op!(">>>=") | op!("^=") => {
                self.emit_report(assign_expr.span, assign_expr.op.as_str());
            }
            _ => {}
        }
    }
}
