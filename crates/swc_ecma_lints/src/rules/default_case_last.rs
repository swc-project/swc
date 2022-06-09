use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Default clause should be the last clause";

pub fn default_case_last(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(DefaultCaseLast::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct DefaultCaseLast {
    expected_reaction: LintRuleReaction,
    cases_count: usize,
}

impl DefaultCaseLast {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            cases_count: 0,
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

    fn check_case(&self, pos: usize, case: &SwitchCase) {
        if case.test.is_none() && pos != self.cases_count {
            self.emit_report(case.span);
        }
    }
}

impl Visit for DefaultCaseLast {
    fn visit_switch_stmt(&mut self, switch_stmt: &SwitchStmt) {
        let prev_cases_count = self.cases_count;
        self.cases_count = switch_stmt.cases.len();

        switch_stmt.discriminant.visit_children_with(self);

        switch_stmt
            .cases
            .iter()
            .enumerate()
            .for_each(|(idx, switch_case)| {
                self.check_case(idx + 1, switch_case);

                switch_case.visit_children_with(self);
            });

        self.cases_count = prev_cases_count;
    }
}
