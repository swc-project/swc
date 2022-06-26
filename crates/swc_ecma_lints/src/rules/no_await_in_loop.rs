use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Unexpected `await` inside a loop";

pub fn no_await_in_loop(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoAwaitInLoop::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoAwaitInLoop {
    expected_reaction: LintRuleReaction,
    await_restricted: bool,
}

impl NoAwaitInLoop {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            await_restricted: false,
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
}

impl Visit for NoAwaitInLoop {
    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        let prev_await_restriction = self.await_restricted;

        for_stmt.init.visit_children_with(self);

        self.await_restricted = true;

        for_stmt.test.visit_children_with(self);
        for_stmt.update.visit_children_with(self);
        for_stmt.body.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_do_while_stmt(&mut self, do_while_stmt: &DoWhileStmt) {
        let prev_await_restriction = self.await_restricted;

        self.await_restricted = true;

        do_while_stmt.body.visit_children_with(self);
        do_while_stmt.test.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_for_in_stmt(&mut self, for_in_stmt: &ForInStmt) {
        let prev_await_restriction = self.await_restricted;

        for_in_stmt.left.visit_children_with(self);
        for_in_stmt.right.visit_children_with(self);

        self.await_restricted = true;

        for_in_stmt.body.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_for_of_stmt(&mut self, for_of_stmt: &ForOfStmt) {
        let prev_await_restriction = self.await_restricted;

        if self.await_restricted {
            self.emit_report(for_of_stmt.span);
        }

        for_of_stmt.left.visit_children_with(self);
        for_of_stmt.right.visit_children_with(self);

        self.await_restricted = for_of_stmt.await_token.is_none();

        for_of_stmt.body.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_while_stmt(&mut self, while_stmt: &WhileStmt) {
        let prev_await_restriction = self.await_restricted;
        self.await_restricted = true;

        while_stmt.test.visit_children_with(self);
        while_stmt.body.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_await_expr(&mut self, await_expr: &AwaitExpr) {
        if self.await_restricted {
            self.emit_report(await_expr.span);
        }

        await_expr.visit_children_with(self);
    }

    fn visit_function(&mut self, function: &Function) {
        let prev_await_restriction = self.await_restricted;
        self.await_restricted = false;

        function.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }

    fn visit_arrow_expr(&mut self, arrow_expr: &ArrowExpr) {
        let prev_await_restriction = self.await_restricted;
        self.await_restricted = false;

        arrow_expr.visit_children_with(self);

        self.await_restricted = prev_await_restriction;
    }
}
