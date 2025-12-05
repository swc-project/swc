use serde::Deserialize;

use super::ClassPropertiesOptions;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2022Options {
    #[serde(skip)]
    pub class_static_block: bool,

    #[serde(skip)]
    pub class_properties: Option<ClassPropertiesOptions>,

    #[serde(skip)]
    pub top_level_await: bool,
}
