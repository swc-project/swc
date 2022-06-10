use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

const MESSAGE: &str = "Unexpected comma in middle of array";

pub fn no_sparse_arrays(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoSparseArrays::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoSparseArrays {
    expected_reaction: LintRuleReaction,
}

impl NoSparseArrays {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
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

    fn check(&self, span: Span, elems: &[Option<ExprOrSpread>]) {
        let len = elems.len();

        // case
        // []
        if len == 0 {
            return;
        }

        // case
        // [,]
        if len == 1 && elems[0].is_none() {
            self.emit_report(span);

            return;
        }

        let last_idx = len - 1;

        let is_sparse_array = elems
            .iter()
            .enumerate()
            .any(|(idx, x)| idx != last_idx && x.is_none());

        // cases like
        // [1,,2]
        if is_sparse_array {
            self.emit_report(span);
        }
    }
}

impl Visit for NoSparseArrays {
    fn visit_array_lit(&mut self, n: &ArrayLit) {
        self.check(n.span, n.elems.as_slice());

        n.visit_children_with(self);
    }
}
