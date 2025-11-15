use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2016Options {
    #[serde(skip)]
    pub exponentiation_operator: bool,
}
