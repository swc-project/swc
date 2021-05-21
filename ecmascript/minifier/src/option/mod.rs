use fxhash::FxHashMap;
use regex::Regex;
use serde::Deserialize;
use serde::Serialize;
use swc_atoms::JsWord;
use swc_common::Mark;
use swc_ecma_ast::EsVersion;
use swc_ecma_ast::Expr;

pub mod terser;

/// This is not serializable.
#[derive(Debug)]
pub struct ExtraOptions {
    /// The [Mark] used for `resolver_with_mark`.
    pub top_level_mark: Mark,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions {
    #[serde(default)]
    pub rename: bool,
    #[serde(default)]
    pub compress: Option<CompressOptions>,
    #[serde(default)]
    pub mangle: Option<MangleOptions>,
    #[serde(default)]
    pub wrap: bool,
    #[serde(default)]
    pub enclose: bool,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct TopLevelOptions {
    pub functions: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MangleOptions {
    #[serde(default, alias = "properties")]
    pub props: Option<ManglePropertiesOptions>,

    #[serde(default, alias = "toplevel")]
    pub top_level: bool,

    #[serde(default, alias = "keep_classnames")]
    pub keep_class_names: bool,

    #[serde(default, alias = "keep_fnames")]
    pub keep_fn_names: bool,

    #[serde(default, alias = "ie8")]
    pub ie8: bool,

    #[serde(default, alias = "safari10")]
    pub safari10: bool,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManglePropertiesOptions {
    #[serde(default, alias = "reserved")]
    pub reserved: Vec<String>,
    #[serde(default, alias = "undeclared")]
    pub undeclared: bool,
    #[serde(default, with = "serde_regex")]
    pub regex: Option<Regex>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum PureGetterOption {
    Bool(bool),
    #[serde(rename = "strict")]
    Strict,
    Str(Vec<JsWord>),
}

impl Default for PureGetterOption {
    fn default() -> Self {
        Self::Strict
    }
}

/// https://terser.org/docs/api-reference.html#compress-options
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct CompressOptions {
    #[serde(default)]
    #[serde(alias = "arguments")]
    pub arguments: bool,

    #[serde(default = "true_by_default")]
    pub arrows: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "booleans")]
    pub bools: bool,

    #[serde(default)]
    #[serde(alias = "booleans_as_integers")]
    pub bools_as_ints: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "collapse_vars")]
    pub collapse_vars: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "comparisons")]
    pub comparisons: bool,

    #[serde(default)]
    #[serde(alias = "computed_props")]
    pub computed_props: bool,

    #[serde(default)]
    #[serde(alias = "conditionals")]
    pub conditionals: bool,

    #[serde(default)]
    #[serde(alias = "dead_code")]
    pub dead_code: bool,

    #[serde(default)]
    #[serde(alias = "directives")]
    pub directives: bool,

    #[serde(default)]
    #[serde(alias = "drop_console")]
    pub drop_console: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "drop_debugger")]
    pub drop_debugger: bool,

    #[serde(default = "default_ecma")]
    pub ecma: EsVersion,

    #[serde(default = "true_by_default")]
    #[serde(alias = "evaluate")]
    pub evaluate: bool,

    /// Should we simplify expressions?
    #[serde(default)]
    #[serde(alias = "expression")]
    pub expr: bool,

    /// All expressions should have dummy span. Use [swc_ecma_utils::drop_span]
    /// to remove spans.
    #[serde(skip)]
    #[serde(alias = "global_defs")]
    pub global_defs: FxHashMap<Box<Expr>, Box<Expr>>,

    #[serde(default)]
    #[serde(alias = "hoist_funs")]
    pub hoist_fns: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "hoist_props")]
    pub hoist_props: bool,

    #[serde(default)]
    #[serde(alias = "hoist_vars")]
    pub hoist_vars: bool,

    #[serde(default)]
    #[serde(alias = "ie8")]
    pub ie8: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "if_return")]
    pub if_return: bool,

    ///
    /// - `0`: disabled inlining
    /// - `1`: inline simple functions
    /// - `2`: inline functions with arguments
    /// - `3`: inline functions with arguments and variables

    #[serde(default = "three_by_default")]
    #[serde(alias = "inline")]
    pub inline: u8,

    #[serde(default = "true_by_default")]
    #[serde(alias = "join_vars")]
    pub join_vars: bool,

    #[serde(default)]
    #[serde(alias = "keep_classnames")]
    pub keep_classnames: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "keep_fargs")]
    pub keep_fargs: bool,

    #[serde(default)]
    #[serde(alias = "keep_fnames")]
    pub keep_fnames: bool,

    #[serde(default)]
    #[serde(alias = "keep_infinity")]
    pub keep_infinity: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "loops")]
    pub loops: bool,
    // module        : false,
    #[serde(default = "true_by_default")]
    #[serde(alias = "negate_iife")]
    pub negate_iife: bool,

    /// If this value is zero, the minifier will repeat work until the ast node
    /// is settled.
    #[serde(default = "one_by_default")]
    #[serde(alias = "passes")]
    pub passes: usize,

    #[serde(default = "true_by_default")]
    #[serde(alias = "properties")]
    pub props: bool,

    #[serde(default)]
    #[serde(alias = "properties")]
    pub pure_getters: PureGetterOption,

    // pure_funcs    : null,
    #[serde(default)]
    #[serde(alias = "reduce_funcs")]
    pub reduce_fns: bool,
    #[serde(default)]
    #[serde(alias = "reduce_vars")]
    pub reduce_vars: bool,

    #[serde(default = "three_by_default")]
    #[serde(alias = "sequences")]
    pub sequences: u8,

    #[serde(default = "true_by_default")]
    #[serde(alias = "side_effects")]
    pub side_effects: bool,

    #[serde(default)]
    #[serde(alias = "switches")]
    pub switches: bool,

    /// Top level symbols to retain.
    #[serde(default)]
    #[serde(alias = "top_retain")]
    pub top_retain: Vec<JsWord>,

    #[serde(default)]
    #[serde(alias = "toplevel")]
    pub top_level: Option<TopLevelOptions>,

    #[serde(default = "true_by_default")]
    #[serde(alias = "typeofs")]
    pub typeofs: bool,

    #[serde(default)]
    #[serde(rename = "unsafe")]
    pub unsafe_passes: bool,

    #[serde(default)]
    pub unsafe_arrows: bool,

    #[serde(default)]
    pub unsafe_comps: bool,

    #[serde(default)]
    #[serde(alias = "unsafe_Function")]
    pub unsafe_function: bool,

    #[serde(default)]
    pub unsafe_math: bool,

    #[serde(default)]
    pub unsafe_symbols: bool,

    #[serde(default)]
    pub unsafe_methods: bool,

    #[serde(default)]
    pub unsafe_proto: bool,

    #[serde(default)]
    pub unsafe_regexp: bool,

    #[serde(default)]
    pub unsafe_undefined: bool,

    #[serde(default = "true_by_default")]
    pub unused: bool,
}

impl CompressOptions {
    pub(crate) fn sequences(&self) -> bool {
        self.sequences != 0
    }

    /// Returns `true` if any of toplevel optimizer is enabled.
    pub(crate) fn top_level(&self) -> bool {
        self.top_level.map(|v| v.functions).unwrap_or(false)
    }
}

const fn true_by_default() -> bool {
    true
}

const fn one_by_default() -> usize {
    1
}

const fn three_by_default() -> u8 {
    3
}

const fn default_ecma() -> EsVersion {
    EsVersion::Es5
}

/// Implement default using serde.
macro_rules! impl_default {
    ($T:ty) => {
        impl Default for $T {
            fn default() -> Self {
                serde_json::from_str("{}").unwrap()
            }
        }
    };
}

impl_default!(MinifyOptions);
impl_default!(MangleOptions);
impl_default!(CompressOptions);
