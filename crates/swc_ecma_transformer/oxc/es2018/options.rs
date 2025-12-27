use serde::Deserialize;

use super::ObjectRestSpreadOptions;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2018Options {
    #[serde(skip)]
    pub object_rest_spread: Option<ObjectRestSpreadOptions>,

    #[serde(skip)]
    pub async_generator_functions: bool,
}
