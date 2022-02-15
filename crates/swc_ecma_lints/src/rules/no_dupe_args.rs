use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_visit::{noop_visit_type, Visit};

use crate::{
    config::{LintRuleReaction, RuleConfig},
    rule::{visitor_rule, Rule},
};

pub fn no_dupe_args(config: &RuleConfig<()>) -> Option<Box<dyn Rule>> {
    let rule_reaction = config.get_rule_reaction();

    match rule_reaction {
        LintRuleReaction::Off => None,
        _ => Some(visitor_rule(NoDupeArgs::default())),
    }
}

#[derive(Debug, Default)]
struct NoDupeArgs {}

impl NoDupeArgs {
    fn check(&self, params: &Vec<Param>) {
        let variables: Vec<(JsWord, Span)> = find_ids(params);

        let mut variables_map = AHashMap::<JsWord, Span>::default();

        variables.into_iter().for_each(|(js_word, span)| {
            if let Some(old_span) = variables_map.insert(js_word.clone(), span) {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            span,
                            "disallow duplicate arguments in `function` definitions",
                        )
                        .span_note(old_span, &format!("Duplicate param '{}'", js_word))
                        .emit();
                });
            }
        });
    }
}

impl Visit for NoDupeArgs {
    noop_visit_type!();

    fn visit_function(&mut self, f: &Function) {
        self.check(&f.params);
    }
}
