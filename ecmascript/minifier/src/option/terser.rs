//! Compatibility for terser config.

use crate::option::PureGetterOption;

use super::CompressOptions;
use super::TopLevelOptions;
use fxhash::FxHashMap;
use serde::Deserialize;
use serde_json::Value;
use swc_atoms::JsWord;
use swc_common::input::SourceFileInput;
use swc_common::sync::Lrc;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_utils::drop_span;

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserEcmaVersion {
    Num(usize),
    Str(String),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserPureGetterOption {
    Bool(bool),
    #[serde(rename = "strict")]
    Strict,
    Str(String),
}

impl Default for TerserPureGetterOption {
    fn default() -> Self {
        TerserPureGetterOption::Strict
    }
}

#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserInlineOption {
    Bool(bool),
    Num(u8),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserTopLevelOptions {
    Bool(bool),
    Str(String),
}

#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserSequenceOptions {
    Bool(bool),
    Num(u8),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
pub enum TerserTopRetainOption {
    Str(String),
    Seq(Vec<JsWord>),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TerserCompressorOptions {
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
    pub ecma: TerserEcmaVersion,

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
    pub inline: Option<TerserInlineOption>,

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

    #[serde(default)]
    pub pure_getters: TerserPureGetterOption,

    #[serde(default)]
    pub pure_funcs: Vec<String>,

    #[serde(default)]
    pub reduce_funcs: bool,

    #[serde(default)]
    pub reduce_vars: bool,

    #[serde(default)]
    pub sequences: Option<TerserSequenceOptions>,

    #[serde(default)]
    pub side_effects: Option<bool>,

    #[serde(default)]
    pub switches: bool,

    #[serde(default)]
    pub top_retain: Option<TerserTopRetainOption>,

    #[serde(default)]
    pub toplevel: Option<TerserTopLevelOptions>,

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

fn ecma_default() -> TerserEcmaVersion {
    TerserEcmaVersion::Num(5)
}

impl TerserCompressorOptions {
    pub fn into_config(self, cm: Lrc<SourceMap>) -> CompressOptions {
        CompressOptions {
            arguments: self.arguments,
            arrows: self.arrows.unwrap_or(self.defaults),
            bools: self.booleans.unwrap_or(self.defaults),
            bools_as_ints: self.booleans_as_integers,
            collapse_vars: self.collapse_vars.unwrap_or(self.defaults),
            comparisons: self.comparisons.unwrap_or(self.defaults),
            computed_props: self.computed_props,
            conditionals: self.conditionals,
            dead_code: self.dead_code,
            directives: self.directives,
            drop_console: self.drop_console,
            drop_debugger: self.drop_debugger.unwrap_or(self.defaults),
            ecma: self.ecma.into(),
            evaluate: self.evaluate.unwrap_or(self.defaults),
            expr: self.expression,
            global_defs: self
                .global_defs
                .into_iter()
                .map(|(k, v)| {
                    let parse = |input: String| {
                        let fm = cm.new_source_file(FileName::Anon, input);

                        let lexer = Lexer::new(
                            Default::default(),
                            Default::default(),
                            SourceFileInput::from(&*fm),
                            None,
                        );
                        let mut parser = Parser::new_from(lexer);

                        parser.parse_expr().map(drop_span).unwrap_or_else(|err| {
                            panic!(
                                "failed to parse `global_defs.{}` of minifier options: {:?}",
                                k, err
                            )
                        })
                    };
                    let key = parse(if k.starts_with('@') {
                        k[1..].to_string()
                    } else {
                        k.to_string()
                    });

                    (
                        key,
                        if k.starts_with('@') {
                            parse(
                                v.as_str()
                                    .unwrap_or_else(|| {
                                        panic!(
                                            "Value of `global_defs.{}` must be a string literal: ",
                                            k
                                        )
                                    })
                                    .into(),
                            )
                        } else {
                            value_to_expr(v)
                        },
                    )
                })
                .collect(),
            hoist_fns: self.hoist_funs,
            hoist_props: self.hoist_props.unwrap_or(self.defaults),
            hoist_vars: self.hoist_vars,
            ie8: self.ie8,
            if_return: self.if_return.unwrap_or(self.defaults),
            inline: self
                .inline
                .map(|v| match v {
                    TerserInlineOption::Bool(v) => {
                        if v {
                            3
                        } else {
                            0
                        }
                    }
                    TerserInlineOption::Num(n) => n,
                })
                .unwrap_or(if self.defaults { 3 } else { 0 }),
            join_vars: self.join_vars.unwrap_or(self.defaults),
            keep_classnames: self.keep_classnames,
            keep_fargs: self.keep_fargs.unwrap_or(self.defaults),
            keep_fnames: self.keep_fnames,
            keep_infinity: self.keep_infinity,
            loops: self.loops.unwrap_or(self.defaults),
            negate_iife: self.negate_iife.unwrap_or(self.defaults),
            passes: self.passes,
            props: self.properties.unwrap_or(self.defaults),
            pure_getters: match self.pure_getters {
                TerserPureGetterOption::Bool(v) => PureGetterOption::Bool(v),
                TerserPureGetterOption::Strict => PureGetterOption::Strict,
                TerserPureGetterOption::Str(v) => {
                    PureGetterOption::Str(v.split(',').map(From::from).collect())
                }
            },
            reduce_fns: self.reduce_funcs,
            reduce_vars: self.reduce_vars,
            sequences: self
                .sequences
                .map(|v| match v {
                    TerserSequenceOptions::Bool(v) => {
                        if v {
                            3
                        } else {
                            0
                        }
                    }
                    TerserSequenceOptions::Num(v) => v,
                })
                .unwrap_or(if self.defaults { 3 } else { 0 }),
            side_effects: self.side_effects.unwrap_or(self.defaults),
            switches: self.switches,
            top_retain: self.top_retain.map(From::from).unwrap_or_default(),
            top_level: self.toplevel.map(From::from),
            typeofs: self.typeofs.unwrap_or(self.defaults),
            unsafe_passes: self.unsafe_passes,
            unsafe_arrows: self.unsafe_arrows,
            unsafe_comps: self.unsafe_comps,
            unsafe_function: self.unsafe_function,
            unsafe_math: self.unsafe_math,
            unsafe_symbols: self.unsafe_symbols,
            unsafe_methods: self.unsafe_methods,
            unsafe_proto: self.unsafe_proto,
            unsafe_regexp: self.unsafe_regexp,
            unsafe_undefined: self.unsafe_undefined,
            unused: self.unused.unwrap_or(self.defaults),
        }
    }
}

impl From<TerserTopLevelOptions> for TopLevelOptions {
    fn from(c: TerserTopLevelOptions) -> Self {
        match c {
            TerserTopLevelOptions::Bool(v) => TopLevelOptions { functions: v },
            TerserTopLevelOptions::Str(..) => {
                // TODO
                TopLevelOptions { functions: false }
            }
        }
    }
}

impl From<TerserEcmaVersion> for EsVersion {
    fn from(v: TerserEcmaVersion) -> Self {
        match v {
            TerserEcmaVersion::Num(v) => match v {
                3 => EsVersion::Es3,
                5 => EsVersion::Es5,
                6 | 2015 => EsVersion::Es2015,
                2016 => EsVersion::Es2016,
                2017 => EsVersion::Es2017,
                2018 => EsVersion::Es2018,
                2019 => EsVersion::Es2019,
                2020 => EsVersion::Es2020,
                _ => {
                    panic!("`{}` is not a valid ecmascript version", v)
                }
            },
            TerserEcmaVersion::Str(v) => {
                TerserEcmaVersion::Num(v.parse().expect("failed to parse version of ecmascript"))
                    .into()
            }
        }
    }
}

impl From<TerserTopRetainOption> for Vec<JsWord> {
    fn from(v: TerserTopRetainOption) -> Self {
        match v {
            TerserTopRetainOption::Str(s) => s
                .split(",")
                .filter(|s| s.trim() != "")
                .map(|v| v.into())
                .collect(),
            TerserTopRetainOption::Seq(v) => v,
        }
    }
}

fn value_to_expr(v: Value) -> Box<Expr> {
    match v {
        Value::Null => Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        Value::Bool(value) => Box::new(Expr::Lit(Lit::Bool(Bool {
            span: DUMMY_SP,
            value,
        }))),
        Value::Number(v) => Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: v.as_f64().unwrap(),
        }))),
        Value::String(v) => Box::new(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: v.into(),
            has_escape: false,
            kind: Default::default(),
        }))),

        Value::Array(arr) => {
            let elems = arr
                .into_iter()
                .map(value_to_expr)
                .map(|expr| Some(ExprOrSpread { spread: None, expr }))
                .collect();
            Box::new(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems,
            }))
        }

        Value::Object(obj) => {
            let props = obj
                .into_iter()
                .map(|(k, v)| (k, value_to_expr(v)))
                .map(|(key, value)| KeyValueProp {
                    key: PropName::Str(Str {
                        span: DUMMY_SP,
                        value: key.into(),
                        has_escape: false,
                        kind: Default::default(),
                    }),
                    value,
                })
                .map(Prop::KeyValue)
                .map(Box::new)
                .map(PropOrSpread::Prop)
                .collect();

            Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props,
            }))
        }
    }
}
