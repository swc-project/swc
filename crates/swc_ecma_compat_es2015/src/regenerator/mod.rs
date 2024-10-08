use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_config::merge::Merge;

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    /// Import path used instead of `regenerator-runtime`
    #[serde(default)]
    pub import_path: Option<JsWord>,
}
