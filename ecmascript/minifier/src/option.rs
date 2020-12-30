use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    pub arguments: bool,
    pub rename: bool,
    pub compress: bool,
    pub mangle: Option<MangleOptions>,
    pub wrap: bool,
    pub enclose: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MangleOptions {
    pub properties: bool,
}
