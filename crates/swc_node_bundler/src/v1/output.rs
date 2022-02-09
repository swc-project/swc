use std::path::PathBuf;

use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename = "Output")]
#[serde(rename_all = "camelCase")]
pub struct OutputConfig {
    pub path: PathBuf,

    #[serde(default)]
    pub name: String,
}
