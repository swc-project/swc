use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename = "Module", rename_all = "camelCase")]
pub struct ModuleConfig {}
