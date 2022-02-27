use crate::{
    config::LintConfig,
    rule::LintRule,
    rules::{
        at_rule_no_unknown::at_rule_no_unknown, block_no_empty::block_no_empty,
        declaration_no_important::declaration_no_important,
        keyframe_declaration_no_important::keyframe_declaration_no_important,
        no_empty_source::no_empty_source,
        no_invalid_position_at_import_rule::no_invalid_position_at_import_rule,
    },
};

pub mod at_rule_no_unknown;
pub mod block_no_empty;
pub mod declaration_no_important;
pub mod keyframe_declaration_no_important;
pub mod no_empty_source;
pub mod no_invalid_position_at_import_rule;

pub struct LintParams<'a> {
    pub lint_config: &'a LintConfig,
}

pub fn get_rules(LintParams { lint_config }: &LintParams) -> Vec<Box<dyn LintRule>> {
    let mut rules = vec![];
    let rules_config = &lint_config.rules;

    if rules_config.block_no_empty.is_enabled() {
        rules.push(block_no_empty(&rules_config.block_no_empty));
    }
    if rules_config.at_rule_no_unknown.is_enabled() {
        rules.push(at_rule_no_unknown(&rules_config.at_rule_no_unknown));
    }
    if rules_config.no_empty_source.is_enabled() {
        rules.push(no_empty_source(&rules_config.no_empty_source));
    }
    if rules_config.declaration_no_important.is_enabled() {
        rules.push(declaration_no_important(
            &rules_config.declaration_no_important,
        ));
    }
    if rules_config.keyframe_declaration_no_important.is_enabled() {
        rules.push(keyframe_declaration_no_important(
            &rules_config.keyframe_declaration_no_important,
        ));
    }
    if rules_config.no_invalid_position_at_import_rule.is_enabled() {
        rules.push(no_invalid_position_at_import_rule(
            &rules_config.no_invalid_position_at_import_rule,
        ));
    }

    rules
}
