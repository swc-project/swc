use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Expected a conditional expression and instead saw an assignment";

pub fn no_cond_assign(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    match config.get_rule_reaction() {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoCondAssign::new(config))),
    }
}

#[derive(Debug, Default)]
struct NoCondAssign {
    expected_reaction: LintRuleReaction,
    inside_test_clause: bool,
}

impl NoCondAssign {
    fn new(config: &RuleConfig<()>) -> Self {
        Self {
            expected_reaction: config.get_rule_reaction(),
            inside_test_clause: false,
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

    fn check(&self, span: Span) {
        if self.inside_test_clause {
            self.emit_report(span);
        }
    }
}

impl Visit for NoCondAssign {
    fn visit_if_stmt(&mut self, if_stmt: &IfStmt) {
        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = true;

        if_stmt.test.visit_with(self);

        self.inside_test_clause = prev_inside_test_clause;

        if_stmt.cons.visit_with(self);
        if_stmt.alt.visit_with(self);
    }

    fn visit_cond_expr(&mut self, cond_expr: &CondExpr) {
        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = true;

        cond_expr.test.visit_with(self);

        self.inside_test_clause = prev_inside_test_clause;

        cond_expr.cons.visit_with(self);
        cond_expr.alt.visit_with(self);
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        for_stmt.init.visit_with(self);

        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = true;

        for_stmt.test.visit_with(self);

        self.inside_test_clause = prev_inside_test_clause;

        for_stmt.update.visit_with(self);
        for_stmt.body.visit_with(self);
    }

    fn visit_while_stmt(&mut self, while_stmt: &WhileStmt) {
        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = true;

        while_stmt.test.visit_with(self);

        self.inside_test_clause = prev_inside_test_clause;

        while_stmt.body.visit_with(self);
    }

    fn visit_do_while_stmt(&mut self, do_while_stmt: &DoWhileStmt) {
        do_while_stmt.body.visit_with(self);

        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = true;

        do_while_stmt.test.visit_with(self);

        self.inside_test_clause = prev_inside_test_clause;
    }

    fn visit_arrow_expr(&mut self, arrow_expr: &ArrowExpr) {
        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = false;

        arrow_expr.visit_children_with(self);

        self.inside_test_clause = prev_inside_test_clause;
    }

    fn visit_function(&mut self, function: &Function) {
        let prev_inside_test_clause = self.inside_test_clause;
        self.inside_test_clause = false;

        function.visit_children_with(self);

        self.inside_test_clause = prev_inside_test_clause;
    }

    fn visit_assign_expr(&mut self, assign_expr: &AssignExpr) {
        self.check(assign_expr.span);

        assign_expr.visit_children_with(self);
    }
}
