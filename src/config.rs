use crate::builder::PassBuilder;
use anyhow::{bail, Context, Error};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    env,
    path::{Path, PathBuf},
    sync::Arc,
    usize,
};
use swc_atoms::JsWord;
pub use swc_common::chain;
use swc_common::{errors::Handler, FileName, Mark, SourceMap};
pub use swc_ecmascript::parser::JscTarget;
use swc_ecmascript::{
    ast::{Expr, ExprStmt, ModuleItem, Stmt},
    parser::{lexer::Lexer, Parser, Session as ParseSess, SourceFileInput, Syntax, TsConfig},
    preset_env,
    transforms::{
        const_modules, modules,
        optimization::{simplifier, InlineGlobals, JsonParse},
        pass::{noop, Optional, Pass},
        proposals::{class_properties, decorators, export, nullish_coalescing, optional_chaining},
        react, resolver_with_mark, typescript,
    },
};

#[cfg(test)]
mod tests;

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseOptions {
    #[serde(default)]
    pub comments: bool,
    #[serde(flatten)]
    pub syntax: Syntax,

    #[serde(default = "default_is_module")]
    pub is_module: bool,

    #[serde(default)]
    pub target: JscTarget,
}

#[derive(Default, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Options {
    #[serde(flatten, default)]
    pub config: Option<Config>,

    #[cfg(not(target_arch = "wasm32"))]
    #[serde(default = "default_cwd")]
    pub cwd: PathBuf,

    #[serde(default)]
    pub caller: Option<CallerOptions>,

    #[serde(default)]
    pub filename: String,

    #[serde(default)]
    pub config_file: Option<ConfigFile>,

    #[serde(default)]
    pub root: Option<PathBuf>,

    #[serde(default)]
    pub root_mode: RootMode,

    #[serde(default = "default_swcrc")]
    pub swcrc: bool,

    #[cfg(not(target_arch = "wasm32"))]
    #[serde(default)]
    pub swcrc_roots: Option<PathBuf>,

    #[serde(default = "default_env_name")]
    pub env_name: String,

    #[serde(default)]
    pub input_source_map: InputSourceMap,

    #[serde(default)]
    pub source_maps: Option<SourceMapsConfig>,

    #[serde(default)]
    pub source_file_name: Option<String>,

    #[serde(default)]
    pub source_root: Option<String>,

    #[serde(default = "default_is_module")]
    pub is_module: bool,
}

fn default_is_module() -> bool {
    true
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SourceMapsConfig {
    Bool(bool),
    Str(String),
}

impl SourceMapsConfig {
    pub fn enabled(&self) -> bool {
        match *self {
            SourceMapsConfig::Bool(b) => b,
            SourceMapsConfig::Str(ref s) => {
                assert_eq!(s, "inline", "Source map must be true, false or inline");
                true
            }
        }
    }
}

impl Default for SourceMapsConfig {
    fn default() -> Self {
        SourceMapsConfig::Bool(true)
    }
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum InputSourceMap {
    Bool(bool),
    Str(String),
}

impl Default for InputSourceMap {
    fn default() -> Self {
        InputSourceMap::Bool(true)
    }
}

impl Options {
    pub fn build(
        &self,
        cm: &Arc<SourceMap>,
        handler: &Handler,
        is_module: bool,
        config: Option<Config>,
    ) -> BuiltConfig<impl Pass> {
        let mut config = config.unwrap_or_else(Default::default);
        if let Some(ref c) = self.config {
            config.merge(c)
        }

        let JscConfig {
            transform,
            syntax,
            external_helpers,
            target,
            loose,
        } = config.jsc;

        let syntax = syntax.unwrap_or_default();
        let mut transform = transform.unwrap_or_default();

        if syntax.typescript() {
            transform.legacy_decorator = true;
        }
        let optimizer = transform.optimizer;
        let enable_optimizer = optimizer.is_some();

        let const_modules = {
            let enabled = transform.const_modules.is_some();
            let config = transform.const_modules.unwrap_or_default();

            let globals = config.globals;

            Optional::new(const_modules(globals), enabled)
        };

        let json_parse_pass = {
            if let Some(ref cfg) = optimizer.as_ref().and_then(|v| v.jsonify) {
                JsonParse {
                    min_cost: cfg.min_cost,
                }
            } else {
                JsonParse {
                    min_cost: usize::MAX,
                }
            }
        };

        let optimization = {
            let pass =
                if let Some(opts) = optimizer.map(|o| o.globals.unwrap_or_else(Default::default)) {
                    opts.build(cm, handler)
                } else {
                    GlobalPassOption::default().build(cm, handler)
                };

            pass
        };

        let root_mark = Mark::fresh(Mark::root());

        let pass = chain!(
            // handle jsx
            Optional::new(react::react(cm.clone(), transform.react), syntax.jsx()),
            Optional::new(typescript::strip(), syntax.typescript()),
            Optional::new(nullish_coalescing(), syntax.nullish_coalescing()),
            Optional::new(optional_chaining(), syntax.optional_chaining()),
            resolver_with_mark(root_mark),
            const_modules,
            optimization,
            Optional::new(
                decorators(decorators::Config {
                    legacy: transform.legacy_decorator
                }),
                syntax.decorators()
            ),
            Optional::new(class_properties(), syntax.class_props()),
            Optional::new(
                export(),
                syntax.export_default_from() || syntax.export_namespace_from()
            ),
            Optional::new(simplifier(Default::default()), enable_optimizer),
            json_parse_pass
        );

        let pass = PassBuilder::new(&cm, &handler, loose, pass)
            .target(target)
            .preset_env(config.env)
            .finalize(root_mark, syntax, config.module);

        BuiltConfig {
            minify: config.minify.unwrap_or(false),
            pass,
            external_helpers,
            syntax,
            target,
            is_module,
            source_maps: self
                .source_maps
                .clone()
                .unwrap_or(SourceMapsConfig::Bool(false)),
            input_source_map: self.input_source_map.clone(),
        }
    }
}

#[derive(Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum RootMode {
    #[serde(rename = "root")]
    Root,
    #[serde(rename = "upward")]
    Upward,
    #[serde(rename = "upward-optional")]
    UpwardOptional,
}

impl Default for RootMode {
    fn default() -> Self {
        RootMode::Root
    }
}
const fn default_swcrc() -> bool {
    true
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ConfigFile {
    Bool(bool),
    Str(String),
}

impl Default for ConfigFile {
    fn default() -> Self {
        ConfigFile::Bool(true)
    }
}

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CallerOptions {
    pub name: String,
}

#[cfg(not(target_arch = "wasm32"))]
fn default_cwd() -> PathBuf {
    ::std::env::current_dir().unwrap()
}

/// `.swcrc` file
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged, rename = "swcrc")]
pub enum Rc {
    Single(Config),
    Multi(Vec<Config>),
}

impl Default for Rc {
    fn default() -> Self {
        Rc::Multi(vec![
            Config {
                env: None,
                test: None,
                exclude: Some(FileMatcher::Regex("\\.tsx?$".into())),
                jsc: JscConfig {
                    syntax: Some(Default::default()),
                    transform: None,
                    external_helpers: false,
                    target: Default::default(),
                    loose: false,
                },
                module: None,
                minify: None,
            },
            Config {
                env: None,
                test: Some(FileMatcher::Regex("\\.tsx$".into())),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: true,
                        ..Default::default()
                    })),
                    transform: None,
                    external_helpers: false,
                    target: Default::default(),
                    loose: false,
                },
                module: None,
                minify: None,
            },
            Config {
                env: None,
                test: Some(FileMatcher::Regex("\\.ts$".into())),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: false,
                        ..Default::default()
                    })),
                    transform: None,
                    external_helpers: false,
                    target: Default::default(),
                    loose: false,
                },
                module: None,
                minify: None,
            },
        ])
    }
}

impl Rc {
    pub fn into_config(self, filename: Option<&Path>) -> Result<Config, Error> {
        let mut cs = match self {
            Rc::Single(c) => match filename {
                Some(filename) => {
                    if c.matches(filename)? {
                        return Ok(c);
                    } else {
                        bail!("not matched")
                    }
                }
                // TODO
                None => return Ok(c),
            },
            Rc::Multi(cs) => cs,
        };

        match filename {
            Some(filename) => {
                for c in cs {
                    if c.matches(filename)? {
                        return Ok(c);
                    }
                }
            }
            // TODO
            None => return Ok(cs.remove(0)),
        }

        bail!("not matched")
    }
}

/// A single object in the `.swcrc` file
#[derive(Debug, Default, Clone, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub env: Option<preset_env::Config>,

    #[serde(default)]
    pub test: Option<FileMatcher>,

    #[serde(default)]
    pub exclude: Option<FileMatcher>,

    #[serde(default)]
    pub jsc: JscConfig,

    #[serde(default)]
    pub module: Option<ModuleConfig>,

    #[serde(default)]
    pub minify: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum FileMatcher {
    Regex(String),
    Multi(Vec<FileMatcher>),
}

impl Default for FileMatcher {
    fn default() -> Self {
        Self::Regex(String::from(""))
    }
}

impl FileMatcher {
    pub fn matches(&self, filename: &Path) -> Result<bool, Error> {
        static CACHE: Lazy<DashMap<String, Regex>> = Lazy::new(Default::default);

        match self {
            FileMatcher::Regex(ref s) => {
                if s.is_empty() {
                    return Ok(false);
                }

                if !CACHE.contains_key(&*s) {
                    let re = Regex::new(&s).with_context(|| format!("invalid regex: {}", s))?;
                    CACHE.insert(s.clone(), re);
                }

                let re = CACHE.get(&*s).unwrap();

                Ok(re.is_match(&filename.to_string_lossy()))
            }
            FileMatcher::Multi(ref v) => {
                //
                for m in v {
                    if m.matches(filename)? {
                        return Ok(true);
                    }
                }

                Ok(false)
            }
        }
    }
}

impl Config {
    pub fn matches(&self, filename: &Path) -> Result<bool, Error> {
        if let Some(ref exclude) = self.exclude {
            if exclude.matches(filename)? {
                return Ok(false);
            }
        }

        if let Some(ref include) = self.test {
            if include.matches(filename)? {
                return Ok(true);
            }
            return Ok(false);
        }

        Ok(true)
    }
}

/// One `BuiltConfig` per a directory with swcrc
pub struct BuiltConfig<P: Pass> {
    pub pass: P,
    pub syntax: Syntax,
    pub target: JscTarget,
    pub minify: bool,
    pub external_helpers: bool,
    pub source_maps: SourceMapsConfig,
    pub input_source_map: InputSourceMap,
    pub is_module: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscConfig {
    #[serde(rename = "parser", default)]
    pub syntax: Option<Syntax>,

    #[serde(default)]
    pub transform: Option<TransformConfig>,

    #[serde(default)]
    pub external_helpers: bool,

    #[serde(default)]
    pub target: JscTarget,

    #[serde(default)]
    pub loose: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum ModuleConfig {
    #[serde(rename = "commonjs")]
    CommonJs(modules::common_js::Config),
    #[serde(rename = "umd")]
    Umd(modules::umd::Config),
    #[serde(rename = "amd")]
    Amd(modules::amd::Config),
}

impl ModuleConfig {
    pub fn build(
        cm: Arc<SourceMap>,
        root_mark: Mark,
        config: Option<ModuleConfig>,
    ) -> Box<dyn Pass> {
        match config {
            None => box noop(),
            Some(ModuleConfig::CommonJs(config)) => {
                box modules::common_js::common_js(root_mark, config)
            }
            Some(ModuleConfig::Umd(config)) => box modules::umd::umd(cm, root_mark, config),
            Some(ModuleConfig::Amd(config)) => box modules::amd::amd(config),
        }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TransformConfig {
    #[serde(default)]
    pub react: react::Options,

    #[serde(default)]
    pub const_modules: Option<ConstModulesConfig>,

    #[serde(default)]
    pub optimizer: Option<OptimizerConfig>,

    #[serde(default)]
    pub legacy_decorator: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ConstModulesConfig {
    #[serde(default)]
    pub globals: HashMap<JsWord, HashMap<JsWord, String>>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct OptimizerConfig {
    #[serde(default)]
    pub globals: Option<GlobalPassOption>,

    #[serde(default)]
    pub jsonify: Option<JsonifyOption>,
}

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JsonifyOption {
    #[serde(default = "default_jsonify_min_cost")]
    pub min_cost: usize,
}

fn default_jsonify_min_cost() -> usize {
    1024
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct GlobalPassOption {
    #[serde(default)]
    pub vars: HashMap<String, String>,
    #[serde(default = "default_envs")]
    pub envs: HashSet<String>,
}

fn default_envs() -> HashSet<String> {
    let mut v = HashSet::default();
    v.insert(String::from("NODE_ENV"));
    v.insert(String::from("SWC_ENV"));
    v
}

impl GlobalPassOption {
    pub fn build(self, cm: &SourceMap, handler: &Handler) -> InlineGlobals {
        fn mk_map(
            cm: &SourceMap,
            handler: &Handler,
            values: impl Iterator<Item = (String, String)>,
            is_env: bool,
        ) -> HashMap<JsWord, Expr> {
            let mut m = HashMap::default();

            for (k, v) in values {
                let v = if is_env {
                    format!("'{}'", v)
                } else {
                    (*v).into()
                };
                let v_str = v.clone();
                let fm = cm.new_source_file(FileName::Custom(format!("GLOBAL.{}", k)), v);
                let session = ParseSess { handler };
                let lexer = Lexer::new(
                    session,
                    Syntax::Es(Default::default()),
                    Default::default(),
                    SourceFileInput::from(&*fm),
                    None,
                );

                let mut module = Parser::new_from(session, lexer)
                    .parse_module()
                    .map_err(|mut e| {
                        e.emit();
                    })
                    .unwrap_or_else(|()| {
                        panic!(
                            "failed to parse global variable {}=`{}` as module",
                            k, v_str
                        )
                    });

                let expr = match module.body.pop() {
                    Some(ModuleItem::Stmt(Stmt::Expr(ExprStmt { box expr, .. }))) => expr,
                    _ => panic!("{} is not a valid expression", v_str),
                };

                m.insert((*k).into(), expr);
            }

            m
        }

        let envs = self.envs;
        InlineGlobals {
            globals: mk_map(cm, handler, self.vars.into_iter(), false),

            envs: if cfg!(target_arch = "wasm32") {
                mk_map(cm, handler, vec![].into_iter(), true)
            } else {
                mk_map(
                    cm,
                    handler,
                    env::vars().filter(|(k, _)| envs.contains(&*k)),
                    true,
                )
            },
        }
    }
}

fn default_env_name() -> String {
    match env::var("SWC_ENV") {
        Ok(v) => return v,
        Err(_) => {}
    }

    match env::var("NODE_ENV") {
        Ok(v) => v,
        Err(_) => "development".into(),
    }
}

pub trait Merge {
    /// Apply overrides from `from`
    fn merge(&mut self, from: &Self);
}

impl<T: Clone> Merge for Option<T>
where
    T: Merge,
{
    fn merge(&mut self, from: &Option<T>) {
        match *from {
            Some(ref from) => match *self {
                Some(ref mut v) => v.merge(from),
                None => *self = Some(from.clone()),
            },
            // no-op
            None => {}
        }
    }
}

impl Merge for Config {
    fn merge(&mut self, from: &Self) {
        self.jsc.merge(&from.jsc);
        self.module.merge(&from.module);
        self.minify.merge(&from.minify)
    }
}

impl Merge for JscConfig {
    fn merge(&mut self, from: &Self) {
        self.syntax.merge(&from.syntax);
        self.transform.merge(&from.transform);
        self.target.merge(&from.target);
        self.external_helpers.merge(&from.external_helpers);
    }
}

impl Merge for JscTarget {
    fn merge(&mut self, from: &Self) {
        if *self < *from {
            *self = *from
        }
    }
}

impl Merge for Option<ModuleConfig> {
    fn merge(&mut self, from: &Self) {
        match *from {
            Some(ref c2) => *self = Some(c2.clone()),
            None => {}
        }
    }
}

impl Merge for bool {
    fn merge(&mut self, from: &Self) {
        *self |= *from
    }
}

impl Merge for Syntax {
    fn merge(&mut self, from: &Self) {
        *self = *from;
    }
}

impl Merge for TransformConfig {
    fn merge(&mut self, from: &Self) {
        self.optimizer.merge(&from.optimizer);
        self.const_modules.merge(&from.const_modules);
        self.react.merge(&from.react);
    }
}

impl Merge for OptimizerConfig {
    fn merge(&mut self, from: &Self) {
        self.globals.merge(&from.globals)
    }
}

impl Merge for GlobalPassOption {
    fn merge(&mut self, from: &Self) {
        *self = from.clone();
    }
}

impl Merge for react::Options {
    fn merge(&mut self, from: &Self) {
        *self = from.clone();
    }
}

impl Merge for ConstModulesConfig {
    fn merge(&mut self, from: &Self) {
        *self = from.clone()
    }
}
