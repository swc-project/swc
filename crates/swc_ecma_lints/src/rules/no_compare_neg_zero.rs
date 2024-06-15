use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn no_compare_neg_zero(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoCompareNegZero::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoCompareNegZero {
    expected_reaction: LintRuleReaction,
}

impl NoCompareNegZero {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
    }

    fn emit_report(&self, op: BinaryOp, span: Span) {
        let message = format!("Do not use the '{}' to compare against -0", op);

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

    fn is_neg_zero(&self, expr: &Expr) -> bool {
        if let Expr::Unary(UnaryExpr {
            op: op!(unary, "-"),
            arg,
            ..
        }) = expr.unwrap_seqs_and_parens()
        {
            if let Expr::Lit(Lit::Num(Number { value, .. })) = arg.unwrap_seqs_and_parens() {
                return *value == 0f64;
            }
        }

        false
    }

    fn check(&self, bin_expr: &BinExpr) {
        if let op!("===")
        | op!("==")
        | op!("!==")
        | op!("!=")
        | op!("<")
        | op!("<=")
        | op!(">")
        | op!(">=") = bin_expr.op
        {
            if self.is_neg_zero(bin_expr.left.as_ref()) || self.is_neg_zero(bin_expr.right.as_ref())
            {
                self.emit_report(bin_expr.op, bin_expr.span);
            }
        }
    }
}

impl Visit for NoCompareNegZero {
    fn visit_bin_expr(&mut self, bin_expr: &BinExpr) {
        self.check(bin_expr);

        bin_expr.visit_children_with(self);
    }
}
