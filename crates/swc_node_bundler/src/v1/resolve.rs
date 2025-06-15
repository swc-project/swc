use std::{collections::HashMap, path::PathBuf};

use serde::Deserialize;
use swc_atoms::{atom, Atom};

/// https://webpack.js.org/configuration/resolve/
#[derive(Debug, Deserialize)]
#[serde(rename = "Resolve", rename_all = "camelCase")]
pub struct ResolveConfig {
    #[serde(default)]
    pub alias: Option<AliasConfig>,

    #[serde(default)]
    pub alias_fields: Vec<Atom>,

    #[serde(default)]
    pub description_files: Vec<Atom>,

    #[serde(default)]
    pub enforce_extension: bool,

    #[serde(default = "default_extensions")]
    pub extensions: Vec<Atom>,

    #[serde(default)]
    pub main_fields: Vec<Atom>,

    #[serde(default = "default_symlinks")]
    pub symlinks: bool,
}

fn default_extensions() -> Vec<Atom> {
    vec![
        atom!(".wasm"),
        atom!(".mjs"),
        atom!(".js"),
        atom!(".json"),
        atom!(".ts"),
        atom!(".tsc"),
    ]
}

fn default_symlinks() -> bool {
    true
}

#[derive(Debug, Deserialize)]
#[serde(rename = "Resolve.Alias", rename_all = "camelCase")]
pub struct AliasConfig {
    #[serde(flatten)]
    pub map: HashMap<Atom, PathBuf>,
}
