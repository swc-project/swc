use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "The object literal notation {} is preferable";

pub fn no_new_object(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<()>,
) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoNewObject::new(
            rule_reaction,
            unresolved_ctxt,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoNewObject {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
}

impl NoNewObject {
    fn new(expected_reaction: LintRuleReaction, unresolved_ctxt: SyntaxContext) -> Self {
        Self {
            expected_reaction,
            unresolved_ctxt,
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

impl Visit for NoNewObject {
    noop_visit_type!();

    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        if let Expr::Ident(callee) = new_expr.callee.as_ref() {
            if callee.sym == "Object" && callee.ctxt == self.unresolved_ctxt {
                self.emit_report(new_expr.span);
            }
        }

        new_expr.visit_children_with(self);
    }
}
