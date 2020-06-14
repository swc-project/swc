use serde::Deserialize;
use std::path::PathBuf;

#[derive(Debug, Deserialize)]
#[serde(rename = "Output")]
pub struct OutputConfig {
    pub path: PathBuf,

    #[serde(default)]
    pub name: String,
}
