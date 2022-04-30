use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Unexpected var, use let or const instead";

pub fn no_var(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoVar::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoVar {
    expected_reaction: LintRuleReaction,
}

impl NoVar {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
    }

    fn emit_error(&self, span: Span) {
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

impl Visit for NoVar {
    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        if let VarDeclKind::Var = var_decl.kind {
            self.emit_error(var_decl.span);
        }

        var_decl.visit_children_with(self);
    }
}
