use crate::{config::LintConfig, rule::Rule};

pub struct LintParams<'a> {
    pub lint_config: &'a LintConfig,
}

pub fn get_rules(LintParams { lint_config }: &LintParams) -> Vec<Box<dyn Rule>> {
    let mut rules = vec![];
    let rules_config = &lint_config.rules;

    rules
}
