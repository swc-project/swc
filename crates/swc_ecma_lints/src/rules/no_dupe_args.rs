use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn no_dupe_args() -> Box<dyn Rule> {
    visitor_rule(NoDupeArgs::default())
}

#[derive(Debug, Default)]
struct NoDupeArgs {}

impl NoDupeArgs {
    fn check(&self, param_list: Vec<(JsWord, Span)>) {
        let mut variables_map = AHashMap::<JsWord, Span>::default();

        param_list.into_iter().for_each(|(js_word, span)| {
            if let Some(old_span) = variables_map.insert(js_word.clone(), span) {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            span,
                            &format!(
                                "the name `{}` is bound more than once in this parameter list",
                                js_word
                            ),
                        )
                        .span_label(old_span, "previous definition here".to_string())
                        .span_label(span, &"used as parameter more than once".to_string())
                        .emit();
                });
            }
        });
    }
}

impl Visit for NoDupeArgs {
    noop_visit_type!();

    fn visit_function(&mut self, f: &Function) {
        let variables: Vec<(JsWord, Span)> = find_pat_ids(&f.params);

        self.check(variables);

        f.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, arrow_fn: &ArrowExpr) {
        let variables: Vec<(JsWord, Span)> = find_pat_ids(&arrow_fn.params);

        self.check(variables);

        arrow_fn.visit_children_with(self);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        let variables: Vec<(JsWord, Span)> = find_pat_ids(&n.params);

        self.check(variables);

        n.visit_children_with(self);
    }
}
