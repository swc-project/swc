use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const OBJECTS_NAMES: &[&str] = &["Math", "JSON", "Reflect", "Atomics"];

pub fn no_obj_calls(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<()>,
) -> Option<Box<dyn Rule>> {
    let expected_reaction = config.get_rule_reaction();

    match expected_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoObjCalls::new(
            unresolved_ctxt,
            expected_reaction,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoObjCalls {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
}

impl NoObjCalls {
    fn new(unresolved_ctxt: SyntaxContext, expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            unresolved_ctxt,
        }
    }

    fn emit_report(&self, span: Span, name: &str) {
        let message = format!("'{}' is not a function", name);

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

    fn check(&self, span: Span, ident: &Ident) {
        if ident.ctxt != self.unresolved_ctxt {
            return;
        }

        let name: &str = &ident.sym;

        if OBJECTS_NAMES.contains(&name) {
            self.emit_report(span, name);
        }
    }
}

impl Visit for NoObjCalls {
    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        if let Expr::Ident(ident) = new_expr.callee.as_ref() {
            self.check(new_expr.span, ident);
        }

        new_expr.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        if let Callee::Expr(expr) = &call_expr.callee {
            if let Expr::Ident(ident) = expr.as_ref() {
                self.check(call_expr.span, ident);
            }
        }

        call_expr.visit_children_with(self);
    }
}
