//! Compatibility for terser config.

use super::CompressOptions;
use fxhash::FxHashMap;
use serde::Deserialize;
use serde_json::Value;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum InlineOption {
    Bool(bool),
    Num(u8),
}

#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum SequenceOption {
    Bool(bool),
    Num(u8),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TerserOptions {
    #[serde(default)]
    pub arguments: bool,

    #[serde(default)]
    pub arrows: Option<bool>,

    #[serde(default)]
    pub booleans: Option<bool>,

    #[serde(default)]
    pub booleans_as_integers: bool,

    #[serde(default)]
    pub collapse_vars: Option<bool>,

    #[serde(default)]
    pub comparisons: Option<bool>,

    #[serde(default)]
    pub computed_props: bool,

    #[serde(default)]
    pub conditionals: bool,

    #[serde(default)]
    pub dead_code: bool,

    #[serde(default)]
    pub defaults: bool,

    #[serde(default)]
    pub directives: bool,

    #[serde(default)]
    pub drop_console: bool,

    #[serde(default)]
    pub drop_debugger: Option<bool>,

    #[serde(default = "ecma_default")]
    pub ecma: usize,

    #[serde(default)]
    pub evaluate: Option<bool>,

    #[serde(default)]
    pub expression: bool,

    #[serde(default)]
    pub global_defs: FxHashMap<JsWord, Value>,

    #[serde(default)]
    pub hoist_funs: bool,

    #[serde(default)]
    pub hoist_props: Option<bool>,

    #[serde(default)]
    pub hoist_vars: bool,

    #[serde(default)]
    pub ie8: bool,

    #[serde(default)]
    pub if_return: Option<bool>,

    #[serde(default)]
    pub inline: Option<InlineOption>,

    #[serde(default)]
    pub join_vars: Option<bool>,

    #[serde(default)]
    pub keep_classnames: bool,

    #[serde(default)]
    pub keep_fargs: Option<bool>,

    #[serde(default)]
    pub keep_fnames: bool,

    #[serde(default)]
    pub keep_infinity: bool,

    #[serde(default)]
    pub loops: Option<bool>,
    // module        : false,
    #[serde(default)]
    pub negate_iife: Option<bool>,

    #[serde(default)]
    pub passes: usize,

    #[serde(default)]
    pub properties: Option<bool>,

    // pure_getters  : !false_by_default && "strict",
    // pure_funcs    : null,
    #[serde(default)]
    pub reduce_funcs: bool,

    #[serde(default)]
    pub reduce_vars: bool,

    #[serde(default)]
    pub sequences: Option<SequenceOption>,

    #[serde(default)]
    pub side_effects: Option<bool>,

    #[serde(default)]
    pub switches: bool,

    #[serde(default)]
    pub top_retain: String,

    #[serde(default)]
    pub toplevel: bool,

    #[serde(default)]
    pub typeofs: Option<bool>,

    #[serde(default)]
    #[serde(rename = "unsafe")]
    pub unsafe_passes: bool,

    #[serde(default)]
    pub unsafe_arrows: bool,

    #[serde(default)]
    pub unsafe_comps: bool,

    #[serde(default)]
    #[serde(rename = "unsafe_Function")]
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

    #[serde(default)]
    pub unused: Option<bool>,

    #[serde(default)]
    pub module: bool,
}

fn ecma_default() -> usize {
    5
}

impl From<TerserOptions> for CompressOptions {
    fn from(c: TerserOptions) -> Self {
        CompressOptions {
            arguments: c.arguments,
            arrows: c.arrows.unwrap_or(c.defaults),
            bools: c.booleans.unwrap_or(c.defaults),
            bools_as_ints: c.booleans_as_integers,
            collapse_vars: c.collapse_vars.unwrap_or(c.defaults),
            comparisons: c.comparisons.unwrap_or(c.defaults),
            computed_props: c.computed_props,
            conditionals: c.conditionals,
            dead_code: c.dead_code,
            directives: c.directives,
            drop_console: c.drop_console,
            drop_debugger: c.drop_debugger.unwrap_or(c.defaults),
            ecma: c.ecma,
            evaluate: c.evaluate.unwrap_or(c.defaults),
            expr: c.expression,
            global_defs: c
                .global_defs
                .into_iter()
                .map(|(k, v)| {
                    (
                        k,
                        match v {
                            Value::Null => Lit::Null(Null { span: DUMMY_SP }),
                            Value::Bool(value) => Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value,
                            }),
                            Value::Number(v) => Lit::Num(Number {
                                span: DUMMY_SP,
                                value: v.as_f64().unwrap(),
                            }),
                            Value::String(v) => Lit::Str(Str {
                                span: DUMMY_SP,
                                value: v.into(),
                                has_escape: false,
                                kind: Default::default(),
                            }),
                            Value::Object(_) | Value::Array(_) => {
                                unreachable!()
                            }
                        },
                    )
                })
                .collect(),
            hoist_fns: c.hoist_funs,
            hoist_props: c.hoist_props.unwrap_or(c.defaults),
            hoist_vars: c.hoist_vars,
            ie8: c.ie8,
            if_return: c.if_return.unwrap_or(c.defaults),
            inline: c
                .inline
                .map(|v| match v {
                    InlineOption::Bool(v) => {
                        if v {
                            3
                        } else {
                            0
                        }
                    }
                    InlineOption::Num(n) => n,
                })
                .unwrap_or(if c.defaults { 3 } else { 0 }),
            join_vars: c.join_vars.unwrap_or(c.defaults),
            keep_classnames: c.keep_classnames,
            keep_fargs: c.keep_fargs.unwrap_or(c.defaults),
            keep_fnames: c.keep_fnames,
            keep_infinity: c.keep_infinity,
            loops: c.loops.unwrap_or(c.defaults),
            negate_iife: c.negate_iife.unwrap_or(c.defaults),
            passes: c.passes,
            props: c.properties.unwrap_or(c.defaults),
            reduce_fns: c.reduce_funcs,
            reduce_vars: c.reduce_vars,
            sequences: c
                .sequences
                .map(|v| match v {
                    SequenceOption::Bool(v) => {
                        if v {
                            3
                        } else {
                            0
                        }
                    }
                    SequenceOption::Num(v) => v,
                })
                .unwrap_or(if c.defaults { 3 } else { 0 }),
            side_effects: c.side_effects.unwrap_or(c.defaults),
            switches: c.switches,
            top_retain: c
                .top_retain
                .split(",")
                .filter(|s| s.trim() != "")
                .map(|v| v.into())
                .collect(),
            top_level: c.toplevel,
            typeofs: c.typeofs.unwrap_or(c.defaults),
            unsafe_passes: c.unsafe_passes,
            unsafe_arrows: c.unsafe_arrows,
            unsafe_comps: c.unsafe_comps,
            unsafe_function: c.unsafe_function,
            unsafe_math: c.unsafe_math,
            unsafe_symbols: c.unsafe_symbols,
            unsafe_methods: c.unsafe_methods,
            unsafe_proto: c.unsafe_proto,
            unsafe_regexp: c.unsafe_regexp,
            unsafe_undefined: c.unsafe_undefined,
            unused: c.unused.unwrap_or(c.defaults),
        }
    }
}
