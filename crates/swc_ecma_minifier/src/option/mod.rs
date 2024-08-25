#![cfg_attr(not(feature = "extra-serde"), allow(unused))]

use std::sync::Arc;

use parking_lot::RwLock;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use swc_atoms::{Atom, JsWord};
use swc_common::{collections::AHashMap, Mark};
use swc_config::{merge::Merge, CachedRegex};
use swc_ecma_ast::{EsVersion, Expr, Id};

/// Implement default using serde.
macro_rules! impl_default {
    ($T:ty) => {
        impl Default for $T {
            fn default() -> Self {
                serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
            }
        }
    };
}

pub mod terser;

/// This is not serializable.
pub struct ExtraOptions {
    /// It should be the [Mark] used for `resolver`.
    pub unresolved_mark: Mark,

    /// It should be the [Mark] used for `resolver`.
    pub top_level_mark: Mark,

    pub mangle_name_cache: Option<Arc<dyn MangleCache>>,
}

#[derive(Debug, Default, Clone)]
#[cfg_attr(feature = "extra-serde", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "extra-serde", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "extra-serde", serde(deny_unknown_fields))]
pub struct MinifyOptions {
    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub rename: bool,
    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub compress: Option<CompressOptions>,
    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub mangle: Option<MangleOptions>,
    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub wrap: bool,
    #[cfg_attr(feature = "extra-serde", serde(default))]
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
    pub top_level: Option<bool>,

    #[serde(default, alias = "keep_classnames")]
    pub keep_class_names: bool,

    #[serde(default, alias = "keep_fnames")]
    pub keep_fn_names: bool,

    #[serde(default, alias = "keep_private_props")]
    pub keep_private_props: bool,

    #[serde(default, alias = "ie8")]
    pub ie8: bool,

    #[deprecated = "This field is no longer required to work around bugs in Safari 10."]
    #[serde(default, alias = "safari10")]
    pub safari10: bool,

    #[serde(default, alias = "reserved")]
    pub reserved: Vec<JsWord>,

    /// mangle names visible in scopes where eval or with are used
    #[serde(default)]
    pub eval: bool,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, Merge)]
#[serde(rename_all = "camelCase")]
pub struct ManglePropertiesOptions {
    #[serde(default, alias = "reserved")]
    pub reserved: Vec<JsWord>,
    #[serde(default, alias = "undeclared")]
    pub undeclared: Option<bool>,
    #[serde(default)]
    pub regex: Option<CachedRegex>,
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
#[derive(Debug, Clone)]
#[cfg_attr(feature = "extra-serde", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "extra-serde", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "extra-serde", serde(deny_unknown_fields))]
pub struct CompressOptions {
    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "arguments"))]
    pub arguments: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    pub arrows: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "booleans"))]
    pub bools: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "booleans_as_integers"))]
    pub bools_as_ints: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "collapse_vars"))]
    pub collapse_vars: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "comparisons"))]
    pub comparisons: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "computed_props"))]
    pub computed_props: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "conditionals"))]
    pub conditionals: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "dead_code"))]
    pub dead_code: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "directives"))]
    pub directives: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "drop_console"))]
    pub drop_console: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "drop_debugger"))]
    pub drop_debugger: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "default_ecma"))]
    pub ecma: EsVersion,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "evaluate"))]
    pub evaluate: bool,

    /// Should we simplify expressions?
    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "expression"))]
    pub expr: bool,

    /// All expressions should have dummy span. Use [swc_ecma_utils::drop_span]
    /// to remove spans.
    #[cfg_attr(feature = "extra-serde", serde(skip))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "global_defs"))]
    pub global_defs: AHashMap<Box<Expr>, Box<Expr>>,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "hoist_funs"))]
    pub hoist_fns: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "hoist_props"))]
    pub hoist_props: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "hoist_vars"))]
    pub hoist_vars: bool,

    /// No effect.
    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "ie8"))]
    pub ie8: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "if_return"))]
    pub if_return: bool,

    ///
    /// - `0`: disabled inlining
    /// - `1`: inline simple functions
    /// - `2`: inline functions with arguments
    /// - `3`: inline functions with arguments and variables

    #[cfg_attr(feature = "extra-serde", serde(default = "three_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "inline"))]
    pub inline: u8,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "join_vars"))]
    pub join_vars: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "keep_classnames"))]
    pub keep_classnames: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "keep_fargs"))]
    pub keep_fargs: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "keep_fnames"))]
    pub keep_fnames: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "keep_infinity"))]
    pub keep_infinity: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "loops"))]
    pub loops: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub module: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "negate_iife"))]
    pub negate_iife: bool,

    /// If this value is zero, the minifier will repeat work until the ast node
    /// is settled.
    #[cfg_attr(feature = "extra-serde", serde(default = "default_passes"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "passes"))]
    pub passes: usize,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "properties"))]
    pub props: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "pure_getters"))]
    pub pure_getters: PureGetterOption,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "pure_funcs"))]
    pub pure_funcs: Vec<Box<Expr>>,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "reduce_funcs"))]
    pub reduce_fns: bool,
    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "reduce_vars"))]
    pub reduce_vars: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "three_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "sequences"))]
    pub sequences: u8,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "side_effects"))]
    pub side_effects: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "switches"))]
    pub switches: bool,

    /// Top level symbols to retain.
    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "top_retain"))]
    pub top_retain: Vec<JsWord>,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "toplevel"))]
    pub top_level: Option<TopLevelOptions>,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "typeofs"))]
    pub typeofs: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(rename = "unsafe"))]
    pub unsafe_passes: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_arrows: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_comps: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    #[cfg_attr(feature = "extra-serde", serde(alias = "unsafe_Function"))]
    pub unsafe_function: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_math: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_symbols: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_methods: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_proto: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_regexp: bool,

    #[cfg_attr(feature = "extra-serde", serde(default))]
    pub unsafe_undefined: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    pub unused: bool,

    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    pub const_to_let: bool,

    /// If you modified globals, set this to false.
    ///
    /// Defaults to true.
    #[cfg_attr(feature = "extra-serde", serde(default = "true_by_default"))]
    pub pristine_globals: bool,
}

impl CompressOptions {
    pub(crate) fn sequences(&self) -> bool {
        self.sequences != 0
    }

    /// Returns `true` if any of toplevel optimizer is enabled.
    pub(crate) fn top_level(&self) -> bool {
        if !self.top_retain.is_empty() {
            return true;
        }

        self.top_level.map(|v| v.functions).unwrap_or(false) || self.module
    }
}

const fn true_by_default() -> bool {
    true
}

const fn default_passes() -> usize {
    3
}

const fn three_by_default() -> u8 {
    3
}

const fn default_ecma() -> EsVersion {
    EsVersion::Es5
}

impl_default!(MangleOptions);

impl Default for CompressOptions {
    fn default() -> Self {
        Self {
            arguments: false,
            arrows: true,
            bools: true,
            bools_as_ints: false,
            collapse_vars: true,
            comparisons: true,
            computed_props: true,
            conditionals: true,
            dead_code: true,
            directives: true,
            drop_console: false,
            drop_debugger: true,
            ecma: default_ecma(),
            evaluate: true,
            expr: false,
            global_defs: Default::default(),
            hoist_fns: false,
            hoist_props: true,
            hoist_vars: false,
            ie8: false,
            if_return: true,
            inline: 3,
            join_vars: true,
            keep_classnames: false,
            keep_fargs: true,
            keep_fnames: false,
            keep_infinity: false,
            loops: true,
            module: false,
            negate_iife: true,
            passes: default_passes(),
            props: true,
            pure_getters: Default::default(),
            pure_funcs: Default::default(),
            reduce_fns: true,
            reduce_vars: false,
            sequences: 3,
            side_effects: true,
            switches: true,
            top_retain: Default::default(),
            top_level: Default::default(),
            typeofs: true,
            unsafe_passes: false,
            unsafe_arrows: false,
            unsafe_comps: false,
            unsafe_function: false,
            unsafe_math: false,
            unsafe_methods: false,
            unsafe_proto: false,
            unsafe_regexp: false,
            unsafe_symbols: false,
            unsafe_undefined: false,
            unused: true,
            const_to_let: true,
            pristine_globals: true,
        }
    }
}

pub trait MangleCache: Send + Sync {
    fn vars_cache(&self, op: &mut dyn FnMut(&FxHashMap<Id, Atom>));

    fn props_cache(&self, op: &mut dyn FnMut(&FxHashMap<Atom, Atom>));

    fn update_vars_cache(&self, new_data: &FxHashMap<Id, Atom>);

    fn update_props_cache(&self, new_data: &FxHashMap<Atom, Atom>);
}

#[derive(Debug, Default)]
pub struct SimpleMangleCache {
    pub vars: RwLock<FxHashMap<Id, Atom>>,
    pub props: RwLock<FxHashMap<Atom, Atom>>,
}

impl MangleCache for SimpleMangleCache {
    fn vars_cache(&self, op: &mut dyn FnMut(&FxHashMap<Id, Atom>)) {
        let vars = self.vars.read();
        op(&vars);
    }

    fn props_cache(&self, op: &mut dyn FnMut(&FxHashMap<Atom, Atom>)) {
        let props = self.props.read();
        op(&props);
    }

    fn update_vars_cache(&self, new_data: &FxHashMap<Id, JsWord>) {
        let mut vars = self.vars.write();
        vars.extend(new_data.iter().map(|(k, v)| (k.clone(), v.clone())));
    }

    fn update_props_cache(&self, new_data: &FxHashMap<JsWord, JsWord>) {
        let mut props = self.props.write();
        props.extend(new_data.iter().map(|(k, v)| (k.clone(), v.clone())));
    }
}
