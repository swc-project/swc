use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions {
    pub arguments: bool,
    pub rename: bool,
    pub compress: Option<CompressOptions>,
    pub mangle: Option<MangleOptions>,
    pub wrap: bool,
    pub enclose: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MangleOptions {
    pub properties: bool,
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct CompressOptions {
    /// Should we simplify expressions?
    pub expr: bool,
    pub drop_console: bool,
    pub reduce_vars: bool,
}
