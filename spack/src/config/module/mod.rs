use serde::Deserialize;

#[derive(Debug, Default, Deserialize)]
#[serde(rename = "Module", rename_all = "camelCase")]
pub struct ModuleConfig {}
