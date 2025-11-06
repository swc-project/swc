use serde::Deserialize;

use super::ArrowFunctionsOptions;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2015Options {
    #[serde(skip)]
    pub arrow_function: Option<ArrowFunctionsOptions>,
}
