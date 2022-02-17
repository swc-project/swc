use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Unexpected 'debugger' statement";

pub fn no_debugger(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoDebugger::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoDebugger {
    expected_reaction: LintRuleReaction,
}

impl NoDebugger {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
    }

    fn check(&self, span: Span) {
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

impl Visit for NoDebugger {
    noop_visit_type!();

    fn visit_debugger_stmt(&mut self, debugger_stmt: &DebuggerStmt) {
        self.check(debugger_stmt.span);
    }
}
