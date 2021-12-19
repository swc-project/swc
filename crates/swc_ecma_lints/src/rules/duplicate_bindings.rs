use swc_ecma_visit::Visit;

use crate::rule::{visitor_rule, Rule};

pub fn duplicate_bindings() -> Box<dyn Rule> {
    visitor_rule(DuplicatedBindings::default())
}

#[derive(Debug, Default)]
struct DuplicatedBindings {}

impl Visit for DuplicatedBindings {}
