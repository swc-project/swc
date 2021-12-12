use std::path::PathBuf;

use serde::Deserialize;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;

use self::regexp::JsRegexp;

mod regexp;

/// https://rollupjs.org/guide/en/#big-list-of-options

#[derive(Debug, Clone, Deserialize)]
pub struct BundlerConfig {
    #[serde(default)]
    pub(crate) external: Option<ExternalConfig>,

    pub(crate) input: InputConfig,

    pub(crate) output: OutputField,
}

/// https://rollupjs.org/guide/en/#external
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
pub enum ExternalConfig {
    Regex(JsRegexp),
    Str(String),
    RegexList(Vec<JsRegexp>),
    StrList(Vec<String>),
}

/// https://rollupjs.org/guide/en/#input
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
pub enum InputConfig {
    Str(String),
    List(Vec<String>),
    Map(AHashMap<String, String>),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
pub enum OutputField {
    Single(OutputConfig),
    Multi(Vec<OutputConfig>),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutputConfig {
    /// https://rollupjs.org/guide/en/#outputdir
    #[serde(default)]
    pub(crate) dir: Option<PathBuf>,

    /// https://rollupjs.org/guide/en/#outputfile
    #[serde(default)]
    pub(crate) file: Option<PathBuf>,

    /// https://rollupjs.org/guide/en/#outputformat

    #[serde(default)]
    pub(crate) format: OutputFormat,

    /// https://rollupjs.org/guide/en/#outputglobals
    #[serde(default)]
    pub(crate) globals: AHashMap<JsWord, JsWord>,

    #[serde(default)]
    pub(crate) name: Option<String>,

    #[serde(default = "true_by_default")]
    pub(crate) make_absolute_externals_relative: bool,

    /// Defaults to 20
    #[serde(default = "max_parallel_file_reads_default")]
    pub(crate) max_parallel_file_reads: u32,

    #[serde(default = "asset_file_names_default")]
    pub(crate) asset_file_names: String,
}
