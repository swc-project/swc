use crate::{config::LintConfig, rule::Rule, rules::block_no_empty::block_no_empty};

pub mod block_no_empty;

pub struct LintParams<'a> {
    pub lint_config: &'a LintConfig,
}

pub fn get_rules(LintParams { lint_config }: &LintParams) -> Vec<Box<dyn Rule>> {
    let mut rules = vec![];
    let rules_config = &lint_config.rules;

    if rules_config.block_no_empty.is_enabled() {
        rules.push(block_no_empty(&rules_config.block_no_empty));
    }

    rules
}
