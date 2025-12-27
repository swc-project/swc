use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2021Options {
    #[serde(skip)]
    pub logical_assignment_operators: bool,
}
