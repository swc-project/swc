use swc_common::{collections::AHashSet, errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{collect_decls_with_ctxt, ident::IdentLike};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "`Symbol` cannot be called as a constructor";

pub fn no_new_symbol(
    program: &Program,
    top_level_ctxt: SyntaxContext,
    config: &RuleConfig<()>,
) -> Option<Box<dyn Rule>> {
    let expected_reaction = config.get_rule_reaction();

    match expected_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoNewSymbol::new(
            collect_decls_with_ctxt(program, top_level_ctxt),
            top_level_ctxt,
            expected_reaction,
        ))),
    }
}

#[derive(Debug, Default)]
struct NoNewSymbol {
    expected_reaction: LintRuleReaction,
    top_level_ctxt: SyntaxContext,
    top_level_declared_vars: AHashSet<Id>,
}

impl NoNewSymbol {
    fn new(
        top_level_declared_vars: AHashSet<Id>,
        top_level_ctxt: SyntaxContext,
        expected_reaction: LintRuleReaction,
    ) -> Self {
        Self {
            expected_reaction,
            top_level_ctxt,
            top_level_declared_vars,
        }
    }

    fn check(&self, span: Span, ident: &Ident) {
        if self.top_level_declared_vars.contains(&ident.to_id()) {
            return;
        }

        if ident.span.ctxt != self.top_level_ctxt {
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
