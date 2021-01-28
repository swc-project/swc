use serde::Deserialize;
use serde::Serialize;

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

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MangleOptions {
    #[serde(default, alias = "properties")]
    pub props: bool,
}

/// https://terser.org/docs/api-reference.html#compress-options
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct CompressOptions {
    #[serde(default)]
    #[serde(alias = "arguments")]
    pub args: bool,

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

    #[serde(default = "true_by_default")]
    #[serde(alias = "defaults")]
    pub defaults: bool,

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
    pub ecma: usize,

    #[serde(default = "true_by_default")]
    #[serde(alias = "evaluate")]
    pub evaluate: bool,

    /// Should we simplify expressions?
    #[serde(default)]
    #[serde(alias = "expression")]
    pub expr: bool,

    #[serde(default)]
    #[serde(alias = "global_defs")]
    pub global_defs: bool,

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

    #[serde(default = "true_by_default")]
    #[serde(alias = "inline")]
    pub inline: bool,

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

    // loops         : !false_by_default,
    // module        : false,
    #[serde(default = "true_by_default")]
    #[serde(alias = "negate_iife")]
    pub negate_iife: bool,

    #[serde(default = "one_by_default")]
    #[serde(alias = "passes")]
    pub passes: usize,

    // properties    : !false_by_default,
    // pure_getters  : !false_by_default && "strict",
    // pure_funcs    : null,
    #[serde(default)]
    #[serde(alias = "reduce_funcs")]
    pub reduce_fns: bool,
    #[serde(default)]
    #[serde(alias = "reduce_vars")]
    pub reduce_vars: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "sequences")]
    pub sequences: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "side_effects")]
    pub side_effects: bool,

    #[serde(default)]
    #[serde(alias = "switches")]
    pub switches: bool,

    // top_retain    : null,
    #[serde(default)]
    #[serde(alias = "toplevel")]
    pub top_level: bool,

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

const fn true_by_default() -> bool {
    true
}

const fn one_by_default() -> usize {
    1
}

const fn default_ecma() -> usize {
    1
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
