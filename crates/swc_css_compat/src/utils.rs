use swc_css_ast::{ComponentValue, Rule};

pub(crate) fn rule_to_component_value(rule: Rule) -> ComponentValue {
    rule.into()
}
