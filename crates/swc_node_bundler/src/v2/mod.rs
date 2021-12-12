use std::{path::PathBuf, sync::Arc};

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
    pub(crate) name: Option<Arc<String>>,

    #[serde(default = "true_by_default")]
    pub(crate) make_absolute_externals_relative: bool,

    /// Defaults to 20
    #[serde(default = "default_max_parallel_file_reads")]
    pub(crate) max_parallel_file_reads: u32,

    #[serde(default = "default_asset_file_names")]
    pub(crate) asset_file_names: Arc<String>,

    #[serde(default)]
    pub(crate) banner: Arc<String>,

    #[serde(default)]
    pub(crate) footer: Arc<String>,

    #[serde(default = "default_chunk_file_names")]
    pub(crate) chunk_file_names: Option<Arc<String>>,

    #[serde(default)]
    pub(crate) compact: bool,

    #[serde(default = "default_entry_file_names")]
    pub(crate) entry_file_names: Arc<String>,

    #[serde(default)]
    pub(crate) extend: bool,

    /// https://rollupjs.org/guide/en/#outputgeneratedcode
    #[serde(default)]
    pub(crate) generated_code: OutputGeneratedCodeConfig,

    /// https://rollupjs.org/guide/en/#outputhoisttransitiveimports
    #[serde(default = "true_by_default")]
    pub(crate) hoist_transitive_imports: bool,

    /// https://rollupjs.org/guide/en/#outputinlinedynamicimports
    #[serde(default)]
    pub(crate) inline_dynamic_imports: bool,

    /// https://rollupjs.org/guide/en/#outputinterop
    #[serde(default)]
    pub(crate) interop: OutputInteropConfig,

    #[serde(default)]
    pub(crate) intro: Arc<String>,

    #[serde(default)]
    pub(crate) outro: Arc<String>,

    /// https://rollupjs.org/guide/en/#outputmanualchunks
    #[serde(default)]
    pub(crate) manual_chunks: AHashMap<Arc<String>, Vec<Arc<String>>>,

    /// https://rollupjs.org/guide/en/#outputminifyinternalexports
    #[serde(default)]
    pub(crate) minify_internal_exports: Option<bool>,

    /// https://rollupjs.org/guide/en/#outputpaths
    #[serde(default)]
    pub(crate) paths: AHashMap<Arc<String>, Arc<String>>,

    /// https://rollupjs.org/guide/en/#outputpreservemodules
    #[serde(default)]
    pub(crate) preserve_modules: bool,

    /// https://rollupjs.org/guide/en/#outputpreservemodulesroot
    #[serde(default)]
    pub(crate) preserve_modules_root: Option<PathBuf>,

    #[serde(default)]
    pub(crate) sourcemap: Option<OutputSourceMapConfig>,

    #[serde(default)]
    pub(crate) sourcemap_exclude_sources: bool,

    #[serde(default)]
    pub(crate) sourcemap_file: Option<Arc<String>>,

    /// https://rollupjs.org/guide/en/#outputvalidate
    #[serde(default)]
    pub(crate) validate: bool,

    /// https://rollupjs.org/guide/en/#preserveentrysignatures
    #[serde(default)]
    pub(crate) preserve_entry_signatures: OutputPreserveEntrySignaturesConfig,

    /// https://rollupjs.org/guide/en/#strictdeprecations
    #[serde(default)]
    pub(crate) strict_deprecations: bool,
}

fn true_by_default() -> bool {
    true
}
