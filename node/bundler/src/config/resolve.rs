use serde::Deserialize;
use std::{collections::HashMap, path::PathBuf};
use swc_atoms::JsWord;

/// https://webpack.js.org/configuration/resolve/
#[derive(Debug, Deserialize)]
#[serde(rename = "Resolve", rename_all = "camelCase")]
pub struct ResolveConfig {
    #[serde(default)]
    pub alias: Option<AliasConfig>,

    #[serde(default)]
    pub alias_fields: Vec<JsWord>,

    #[serde(default)]
    pub description_files: Vec<JsWord>,

    #[serde(default)]
    pub enforce_extension: bool,

    #[serde(default = "default_extensions")]
    pub extensions: Vec<JsWord>,

    #[serde(default)]
    pub main_fields: Vec<JsWord>,

    #[serde(default = "default_symlinks")]
    pub symlinks: bool,
}

fn default_extensions() -> Vec<JsWord> {
    vec![
        ".wasm".into(),
        ".mjs".into(),
        ".js".into(),
        ".json".into(),
        ".ts".into(),
        ".tsc".into(),
    ]
}

fn default_symlinks() -> bool {
    true
}

#[derive(Debug, Deserialize)]
#[serde(rename = "Resolve.Alias", rename_all = "camelCase")]
pub struct AliasConfig {
    #[serde(flatten)]
    pub map: HashMap<JsWord, PathBuf>,
}
