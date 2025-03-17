//! NOT A PUBLIC API

use serde::{Deserialize, Serialize};
use swc_config::{config_types::BoolOrDataConfig, IsModule, SourceMapContent};

use crate::option::{
    terser::{TerserCompressorOptions, TerserEcmaVersion},
    MangleOptions,
};

/// Second argument of `minify`.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JsMinifyOptions {
    #[serde(default)]
    pub parse: JsMinifyParseOptions,

    #[serde(default)]
    pub compress: BoolOrDataConfig<TerserCompressorOptions>,

    #[serde(default)]
    pub mangle: BoolOrDataConfig<MangleOptions>,

    #[serde(default, alias = "output")]
    pub format: JsMinifyFormatOptions,

    #[serde(default)]
    pub ecma: TerserEcmaVersion,

    #[serde(default, alias = "keep_classnames")]
    pub keep_classnames: bool,

    #[serde(default, alias = "keep_fnames")]
    pub keep_fnames: bool,

    #[serde(default = "default_module")]
    pub module: IsModule,

    #[serde(default)]
    pub safari10: bool,

    #[serde(default)]
    pub toplevel: Option<bool>,

    #[serde(default)]
    pub source_map: BoolOrDataConfig<TerserSourceMapOption>,

    #[serde(default)]
    pub output_path: Option<String>,

    #[serde(default = "true_by_default")]
    pub inline_sources_content: bool,

    #[serde(default = "true_by_default")]
    pub emit_source_map_columns: bool,
}

fn true_by_default() -> bool {
    true
}

/// `sourceMap` of `minify()`.`
///
/// `jsc.minify.sourceMap`
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TerserSourceMapOption {
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default)]
    pub url: Option<String>,

    #[serde(default)]
    pub root: Option<String>,

    #[serde(default)]
    pub content: Option<SourceMapContent>,
}

/// Parser options for `minify()`, which should have the same API as terser.
///
/// `jsc.minify.parse` is ignored.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JsMinifyParseOptions {
    /// Not supported.
    #[serde(default, alias = "bare_returns")]
    pub bare_returns: bool,

    /// Ignored, and always parsed.
    #[serde(default = "true_by_default", alias = "html5_comments")]
    pub html5_comments: bool,

    /// Ignored, and always parsed.
    #[serde(default = "true_by_default")]
    pub shebang: bool,

    /// Not supported.
    #[serde(default)]
    pub spidermonkey: bool,
}

/// `jsc.minify.format`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JsMinifyFormatOptions {
    /// Not implemented yet.
    #[serde(default, alias = "ascii_only")]
    pub ascii_only: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub beautify: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub braces: bool,

    #[serde(default = "default_comments")]
    pub comments: BoolOrDataConfig<JsMinifyCommentOption>,

    /// Not implemented yet.
    #[serde(default)]
    pub ecma: usize,

    /// Not implemented yet.
    #[serde(default, alias = "indent_level")]
    pub indent_level: Option<usize>,

    /// Not implemented yet.
    #[serde(default, alias = "indent_start")]
    pub indent_start: bool,

    #[serde(default = "true_by_default", alias = "inline_script")]
    pub inline_script: bool,

    /// Not implemented yet.
    #[serde(default, alias = "keep_numbers")]
    pub keep_numbers: bool,

    /// Not implemented yet.
    #[serde(default, alias = "keep_quoted_props")]
    pub keep_quoted_props: bool,

    /// Not implemented yet.
    #[serde(default, alias = "max_line_len")]
    pub max_line_len: usize,

    /// Not implemented yet.
    #[serde(default)]
    pub preamble: String,

    /// Not implemented yet.
    #[serde(default, alias = "quote_keys")]
    pub quote_keys: bool,

    /// Not implemented yet.
    #[serde(default, alias = "quote_style")]
    pub quote_style: usize,

    /// Not implemented yet.
    #[serde(default, alias = "preserve_annotations")]
    pub preserve_annotations: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub safari10: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub semicolons: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub shebang: bool,

    /// Not implemented yet.
    #[serde(default)]
    pub webkit: bool,

    /// Not implemented yet.
    #[serde(default, alias = "warp_iife")]
    pub wrap_iife: bool,

    /// Not implemented yet.
    #[serde(default, alias = "wrap_func_args")]
    pub wrap_func_args: bool,

    #[serde(default)]
    pub emit_assert_for_import_attributes: bool,
}

impl Default for JsMinifyFormatOptions {
    fn default() -> Self {
        // Well, this should be a macro IMHO, but it's not so let's just use hacky way.
        serde_json::from_str("{}").unwrap()
    }
}

fn default_comments() -> BoolOrDataConfig<JsMinifyCommentOption> {
    BoolOrDataConfig::from_obj(JsMinifyCommentOption::PreserveSomeComments)
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub enum JsMinifyCommentOption {
    #[serde(rename = "some")]
    #[default]
    PreserveSomeComments,
    #[serde(rename = "all")]
    PreserveAllComments,
}

fn default_module() -> IsModule {
    IsModule::Bool(false)
}
