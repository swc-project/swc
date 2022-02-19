use serde::{Deserialize, Serialize};
use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BinaryExpression {
    message: String,
    operator: BinaryOp,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForInExpression {
    message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ForOfExpression {
    message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct WithStatement {
    message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LabelStatement {
    message: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct NoRestrictedSyntaxConfig {
    binary_expression: Option<Vec<BinaryExpression>>,
    for_in_expression: Option<ForInExpression>,
    for_of_expression: Option<ForOfExpression>,
    with_statement: Option<Vec<WithStatement>>,
    label_statement: Option<Vec<LabelStatement>>,
}

pub fn no_restricted_syntax(
    config: &RuleConfig<NoRestrictedSyntaxConfig>,
) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoRestrictedSyntax::new(config))),
    }
}

#[derive(Debug, Default)]
struct NoRestrictedSyntax {
    expected_reaction: LintRuleReaction,

    binary_expr: Option<Vec<BinaryExpression>>,
    for_in_expression: Option<ForInExpression>,
    for_of_expression: Option<ForOfExpression>,
    with_statement: Option<Vec<WithStatement>>,
    label_statement: Option<Vec<LabelStatement>>,
}

impl NoRestrictedSyntax {
    fn new(config: &RuleConfig<NoRestrictedSyntaxConfig>) -> Self {
        let rule_config = config.get_rule_config();

        Self {
            expected_reaction: config.get_rule_reaction(),
            binary_expr: rule_config.binary_expression.clone(),
            for_in_expression: rule_config.for_in_expression.clone(),
            for_of_expression: rule_config.for_of_expression.clone(),
            with_statement: rule_config.with_statement.clone(),
            label_statement: rule_config.label_statement.clone(),
        }
    }

    fn emit_report(&self, span: Span, message: &str) {
        HANDLER.with(|handler| match self.expected_reaction {
            LintRuleReaction::Error => {
                handler.struct_span_err(span, message).emit();
            }
            LintRuleReaction::Warning => {
                handler.struct_span_warn(span, message).emit();
            }
            _ => {}
        });
    }
}

impl Visit for NoRestrictedSyntax {
    noop_visit_type!();

    fn visit_expr(&mut self, expr: &Expr) {
        if let Expr::Bin(BinExpr { span, op, .. }) = expr {
            let op = *op;

            if let Some(binary_expr) = &self.binary_expr {
                let rule = binary_expr.iter().find(|rule| rule.operator == op);

                if let Some(BinaryExpression { message, .. }) = rule {
                    self.emit_report(*span, message);
                }
            }
        }

        expr.visit_children_with(self);
    }

    fn visit_for_in_stmt(&mut self, for_in: &ForInStmt) {
        if let Some(ForInExpression { message }) = &self.for_in_expression {
            self.emit_report(for_in.span, message);
        }

        for_in.visit_children_with(self);
    }

    fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
        if let Some(ForOfExpression { message }) = &self.for_of_expression {
            self.emit_report(for_of.span, message);
        }

        for_of.visit_children_with(self);
    }

    fn visit_with_stmt(&mut self, with_stmt: &WithStmt) {
        if let Some(rules) = &self.with_statement {
            rules.iter().for_each(|rule| {
                self.emit_report(with_stmt.span, &rule.message);
            });
        }

        with_stmt.visit_children_with(self);
    }

    fn visit_labeled_stmt(&mut self, labeled_stmt: &LabeledStmt) {
        if let Some(rules) = &self.label_statement {
            rules.iter().for_each(|rule| {
                self.emit_report(labeled_stmt.span, &rule.message);
            });
        }

        labeled_stmt.visit_children_with(self);
    }
}
