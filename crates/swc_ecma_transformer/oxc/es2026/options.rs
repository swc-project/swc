use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2026Options {
    #[serde(skip)]
    pub explicit_resource_management: bool,
}
