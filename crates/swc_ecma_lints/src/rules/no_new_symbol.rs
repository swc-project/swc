use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "`Symbol` cannot be called as a constructor";

pub fn no_new_symbol(
    unresolved_ctxt: SyntaxContext,
    config: &RuleConfig<()>,
) -> Option<Box<dyn Rule>> {
    let expected_reaction = config.get_rule_reaction();

    match expected_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoNewSymbol::new(
            unresolved_ctxt,
            expected_reaction,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoNewSymbol {
    expected_reaction: LintRuleReaction,
    unresolved_ctxt: SyntaxContext,
}

impl NoNewSymbol {
    fn new(unresolved_ctxt: SyntaxContext, expected_reaction: LintRuleReaction) -> Self {
        Self {
            expected_reaction,
            unresolved_ctxt,
        }
    }

    fn check(&self, span: Span, ident: &Ident) {
        if ident.ctxt != self.unresolved_ctxt {
            return;
        }

        if &*ident.sym == "Symbol" {
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
}

impl Visit for NoNewSymbol {
    noop_visit_type!();

    fn visit_new_expr(&mut self, new_expr: &NewExpr) {
        if let Expr::Ident(ident) = new_expr.callee.as_ref() {
            self.check(new_expr.span, ident);
        }

        new_expr.visit_children_with(self);
    }
}
