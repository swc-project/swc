use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn no_empty_pattern(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoEmptyPattern::new(rule_reaction))),
    }
}

#[derive(Debug, Default)]
struct NoEmptyPattern {
    expected_reaction: LintRuleReaction,
}

impl NoEmptyPattern {
    fn new(expected_reaction: LintRuleReaction) -> Self {
        Self { expected_reaction }
    }

    fn emit_report(&self, span: Span, format_type: &str) {
        let message = format!("Unexpected empty {} pattern", format_type);

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
}

impl Visit for NoEmptyPattern {
    fn visit_array_pat(&mut self, array_pat: &ArrayPat) {
        if array_pat.elems.is_empty() {
            self.emit_report(array_pat.span, "array");
        }

        array_pat.visit_children_with(self);
    }

    fn visit_object_pat(&mut self, object_pat: &ObjectPat) {
        if object_pat.props.is_empty() {
            self.emit_report(object_pat.span, "object");
        }

        object_pat.visit_children_with(self);
    }
}
