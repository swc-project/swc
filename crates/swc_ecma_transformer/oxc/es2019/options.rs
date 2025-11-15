use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2019Options {
    #[serde(skip)]
    pub optional_catch_binding: bool,
}
