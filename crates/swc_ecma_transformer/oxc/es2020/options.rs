use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2020Options {
    #[serde(skip)]
    pub export_namespace_from: bool,

    #[serde(skip)]
    pub nullish_coalescing_operator: bool,

    #[serde(skip)]
    pub big_int: bool,

    #[serde(skip)]
    pub optional_chaining: bool,

    #[serde(skip)]
    pub arbitrary_module_namespace_names: bool,
}
