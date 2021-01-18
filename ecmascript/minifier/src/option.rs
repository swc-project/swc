use serde::Deserialize;

#[derive(Debug, Deserialize)]
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

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MangleOptions {
    #[serde(default, alias = "properties")]
    pub props: bool,
}

#[derive(Debug, Clone, Deserialize)]
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

    // computed_props: !false_by_default,
    // conditionals  : !false_by_default,
    #[serde(default)]
    #[serde(alias = "dead_code")]
    pub dead_code: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "defaults")]
    pub defaults: bool,

    #[serde(default)]
    #[serde(alias = "directives")]
    pub directives: bool,

    /// Should we simplify expressions?
    #[serde(default)]
    #[serde(alias = "expression")]
    pub expr: bool,

    #[serde(default)]
    #[serde(alias = "drop_console")]
    pub drop_console: bool,

    // drop_debugger : !false_by_default,
    // ecma          : 5,
    #[serde(default = "true_by_default")]
    #[serde(alias = "evaluate")]
    #[deprecated = "Not used. Exists only for api compatibility with terser."]
    pub evaluate: bool,

    // expression    : false,
    // global_defs   : false,
    #[serde(default)]
    #[serde(alias = "hoist_funs")]
    pub hoist_fns: bool,

    #[serde(default = "true_by_default")]
    #[serde(alias = "hoist_props")]
    pub hoist_props: bool,

    #[serde(default)]
    #[serde(alias = "hoist_vars")]
    pub hoist_vars: bool,

    // ie8           : false,
    // if_return     : !false_by_default,
    #[serde(default = "true_by_default")]
    #[serde(alias = "inline")]
    pub inline: bool,

    // join_vars     : !false_by_default,
    // keep_classnames: false,
    // keep_fargs    : true,
    // keep_fnames   : false,
    // keep_infinity : false,
    // loops         : !false_by_default,
    // module        : false,
    // negate_iife   : !false_by_default,
    #[serde(default = "one_by_default")]
    #[serde(alias = "passes")]
    pub passes: usize,

    // properties    : !false_by_default,
    // pure_getters  : !false_by_default && "strict",
    // pure_funcs    : null,
    #[serde(default)]
    #[serde(alias = "reduce_funcs")]
    #[deprecated = "Not used. Exists only for api compatibility with terser."]
    pub reduce_fns: bool,
    #[serde(default)]
    #[serde(alias = "reduce_vars")]
    pub reduce_vars: bool,

    // sequences     : !false_by_default,
    #[serde(default = "true_by_default")]
    #[serde(alias = "side_effects")]
    pub side_effects: bool,

    // switches      : !false_by_default,
    // top_retain    : null,
    #[serde(default)]
    #[serde(alias = "toplevel")]
    pub top_level: bool,
    // typeofs       : !false_by_default,
    #[serde(default)]
    #[serde(rename = "unsafe")]
    pub unsafe_passes: bool,
    // unsafe_arrows : false,
    // unsafe_comps  : false,
    // unsafe_Function: false,
    // unsafe_math   : false,
    // unsafe_symbols: false,
    // unsafe_methods: false,
    // unsafe_proto  : false,
    // unsafe_regexp : false,
    // unsafe_undefined: false,
    #[serde(default = "true_by_default")]
    pub unused: bool,
}

const fn true_by_default() -> bool {
    true
}

const fn one_by_default() -> usize {
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
