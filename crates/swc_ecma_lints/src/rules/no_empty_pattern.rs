use swc_common::{errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn no_empty_pattern(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoEmptyPattern::new(*rule_reaction))),
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

    fn check(&self, pat: &Pat) {
        match pat {
            Pat::Object(ObjectPat { span, props, .. }) => {
                if props.is_empty() {
                    self.emit_report(*span, "object");

                    return;
                }

                props.iter().for_each(|obj_pat_prop| {
                    if let ObjectPatProp::KeyValue(KeyValuePatProp { value, .. }) = obj_pat_prop {
                        self.check(value.as_ref());
                    }
                });
            }
            Pat::Array(ArrayPat { elems, span, .. }) => {
                if elems.is_empty() {
                    self.emit_report(*span, "array");

                    return;
                }

                elems.iter().for_each(|array_pat_elem| {
                    if let Some(elem) = array_pat_elem {
                        self.check(elem);
                    }
                });
            }
            _ => {}
        }
    }
}

impl Visit for NoEmptyPattern {
    noop_visit_type!();

    fn visit_var_declarator(&mut self, var_declarator: &VarDeclarator) {
        self.check(&var_declarator.name);
    }

    fn visit_function(&mut self, function: &Function) {
        function.params.iter().for_each(|Param { pat, .. }| {
            self.check(pat);
        });

        function.visit_children_with(self);
    }
}
