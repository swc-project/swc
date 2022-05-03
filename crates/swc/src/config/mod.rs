#![cfg_attr(any(not(feature = "plugin"), target_arch = "wasm32"), allow(unused))]
use std::{
    cell::RefCell,
    collections::{HashMap, HashSet},
    env, fmt,
    hash::BuildHasher,
    path::{Path, PathBuf},
    rc::Rc as RustRc,
    sync::Arc,
    usize,
};

use anyhow::{bail, Error};
use dashmap::DashMap;
use either::Either;
use indexmap::IndexMap;
use once_cell::sync::Lazy;
use serde::{
    de::{Unexpected, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};
use swc_atoms::JsWord;
use swc_cached::regex::CachedRegex;
pub use swc_common::chain;
use swc_common::{
    collections::{AHashMap, AHashSet},
    comments::SingleThreadedComments,
    errors::Handler,
    FileName, Mark, SourceMap, SyntaxContext,
};
use swc_ecma_ast::{EsVersion, Expr, Program};
use swc_ecma_ext_transforms::jest;
use swc_ecma_lints::{
    config::LintConfig,
    rules::{lint_to_fold, LintParams},
};
use swc_ecma_loader::{
    resolvers::{lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver},
    TargetEnv,
};
use swc_ecma_minifier::option::{
    terser::{TerserCompressorOptions, TerserEcmaVersion, TerserTopLevelOptions},
    MangleOptions, ManglePropertiesOptions,
};
#[allow(deprecated)]
pub use swc_ecma_parser::JscTarget;
use swc_ecma_parser::{parse_file_as_expr, Syntax, TsConfig};
use swc_ecma_transforms::{
    hygiene, modules,
    modules::{
        hoist::module_hoister, path::NodeImportResolver, rewriter::import_rewriter, util::Scope,
    },
    optimization::{const_modules, json_parse, simplifier},
    pass::{noop, Optional},
    proposals::{decorators, export_default_from, import_assertions},
    react, resolver,
    typescript::{self, TSEnumConfig},
    Assumptions,
};
use swc_ecma_transforms_compat::es2015::regenerator;
use swc_ecma_transforms_optimization::{inline_globals2, GlobalExprMap};
use swc_ecma_visit::{Fold, VisitMutWith};

use self::util::BoolOrObject;
use crate::{
    builder::PassBuilder,
    dropped_comments_preserver::dropped_comments_preserver,
    plugin::{PluginConfig, PluginContext},
    SwcImportResolver,
};

#[cfg(test)]
mod tests;
pub mod util;

#[derive(Clone, Debug, Copy)]
pub enum IsModule {
    Bool(bool),
    Unknown,
}

impl Default for IsModule {
    fn default() -> Self {
        IsModule::Bool(true)
    }
}

impl Serialize for IsModule {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match *self {
            IsModule::Bool(ref b) => b.serialize(serializer),
            IsModule::Unknown => "unknown".serialize(serializer),
        }
    }
}

impl<'de> Deserialize<'de> for IsModule {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct IsModuleVisitor;

        impl<'de> Visitor<'de> for IsModuleVisitor {
            type Value = IsModule;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("a boolean or the string 'unknown'")
            }

            fn visit_bool<E>(self, b: bool) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                Ok(IsModule::Bool(b))
            }

            fn visit_str<E>(self, s: &str) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                match s {
                    "unknown" => Ok(IsModule::Unknown),
                    _ => Err(serde::de::Error::invalid_value(Unexpected::Str(s), &self)),
                }
            }
        }

        deserializer.deserialize_any(IsModuleVisitor)
    }
}

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseOptions {
    #[serde(default)]
    pub comments: bool,
    #[serde(flatten)]
    pub syntax: Syntax,

    #[serde(default)]
    pub is_module: IsModule,

    #[serde(default)]
    pub target: EsVersion,
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Options {
    #[serde(flatten)]
    pub config: Config,

    #[serde(skip_deserializing, default)]
    pub skip_helper_injection: bool,

    #[serde(skip_deserializing, default)]
    pub disable_hygiene: bool,

    #[serde(skip_deserializing, default)]
    pub disable_fixer: bool,

    #[serde(skip_deserializing, default)]
    pub top_level_mark: Option<Mark>,

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
    pub source_maps: Option<SourceMapsConfig>,

    #[serde(default)]
    pub source_file_name: Option<String>,

    #[serde(default)]
    pub source_root: Option<String>,

    #[serde(default)]
    pub is_module: IsModule,

    #[serde(default)]
    pub output_path: Option<PathBuf>,
}

impl Options {
    pub fn codegen_target(&self) -> Option<EsVersion> {
        self.config.jsc.target
    }
}

/// Configuration related to source map generated by swc.
#[derive(Clone, Serialize, Deserialize, Debug)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum InputSourceMap {
    Bool(bool),
    Str(String),
}

impl Default for InputSourceMap {
    fn default() -> Self {
        InputSourceMap::Bool(false)
    }
}

impl Options {
    /// `parse`: `(syntax, target, is_module)`
    ///
    /// `parse` should use `comments`.
    #[allow(clippy::too_many_arguments)]
    pub fn build_as_input<'a, P>(
        &self,
        cm: &Arc<SourceMap>,
        base: &FileName,
        parse: impl FnOnce(Syntax, EsVersion, IsModule) -> Result<Program, Error>,
        output_path: Option<&Path>,
        source_file_name: Option<String>,
        handler: &Handler,
        is_module: IsModule,
        config: Option<Config>,
        comments: Option<&'a SingleThreadedComments>,
        custom_before_pass: impl FnOnce(&Program) -> P,
    ) -> Result<BuiltInput<impl 'a + swc_ecma_visit::Fold>, Error>
    where
        P: 'a + swc_ecma_visit::Fold,
    {
        let mut config = config.unwrap_or_default();
        config.merge(&self.config);

        let mut source_maps = self.source_maps.clone();
        source_maps.merge(&config.source_maps);

        let JscConfig {
            assumptions,
            transform,
            syntax,
            external_helpers,
            target,
            loose,
            keep_class_names,
            base_url,
            paths,
            minify: mut js_minify,
            experimental,
            lints,
            preserve_all_comments,
            ..
        } = config.jsc;

        let mut assumptions = assumptions.unwrap_or_else(|| {
            if loose {
                Assumptions::all()
            } else {
                Assumptions::default()
            }
        });

        let unresolved_mark = Mark::new();
        let top_level_mark = self.top_level_mark.unwrap_or_else(Mark::new);

        let es_version = target.unwrap_or_default();

        let syntax = syntax.unwrap_or_default();

        let mut program = parse(syntax, es_version, is_module)?;

        let mut transform = transform.unwrap_or_default();

        // Do a resolver pass before everything.
        //
        // We do this before creating custom passes, so custom passses can use the
        // variable management system based on the syntax contexts.
        if syntax.typescript() {
            assumptions.set_class_methods = !transform.use_define_for_class_fields;
            assumptions.set_public_class_fields = !transform.use_define_for_class_fields;
        }

        program.visit_mut_with(&mut resolver(
            unresolved_mark,
            top_level_mark,
            syntax.typescript(),
        ));

        if program.is_module() {
            js_minify = js_minify.map(|c| {
                let compress = c
                    .compress
                    .into_obj()
                    .map(|mut c| {
                        if c.toplevel.is_none() {
                            c.toplevel = Some(TerserTopLevelOptions::Bool(true));
                        }

                        c
                    })
                    .map(BoolOrObject::Obj)
                    .unwrap_or(BoolOrObject::Bool(false));

                let mangle = c
                    .mangle
                    .into_obj()
                    .map(|mut c| {
                        c.top_level = true;

                        c
                    })
                    .map(BoolOrObject::Obj)
                    .unwrap_or(BoolOrObject::Bool(false));

                JsMinifyOptions {
                    compress,
                    mangle,
                    ..c
                }
            });
        }

        let regenerator = transform.regenerator.clone();

        let preserve_comments = if preserve_all_comments {
            Some(BoolOrObject::from(true))
        } else {
            js_minify.as_ref().map(|v| v.format.comments.clone())
        };

        if syntax.typescript() {
            transform.legacy_decorator = true;
        }
        let optimizer = transform.optimizer;

        let const_modules = {
            let enabled = transform.const_modules.is_some();
            let config = transform.const_modules.unwrap_or_default();

            let globals = config.globals;
            Optional::new(const_modules(cm.clone(), globals), enabled)
        };

        let json_parse_pass = {
            if let Some(ref cfg) = optimizer.as_ref().and_then(|v| v.jsonify) {
                Either::Left(json_parse(cfg.min_cost))
            } else {
                Either::Right(noop())
            }
        };

        let enable_simplifier = optimizer.as_ref().map(|v| v.simplify).unwrap_or_default();

        let optimization = {
            if let Some(opts) = optimizer.and_then(|o| o.globals) {
                Either::Left(opts.build(cm, handler))
            } else {
                Either::Right(noop())
            }
        };

        let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
        let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);

        let pass = chain!(
            const_modules,
            optimization,
            Optional::new(export_default_from(), syntax.export_default_from()),
            Optional::new(
                simplifier(top_level_mark, Default::default()),
                enable_simplifier
            ),
            json_parse_pass
        );

        let pass = PassBuilder::new(
            cm,
            handler,
            loose,
            assumptions,
            top_level_mark,
            unresolved_mark,
            pass,
        )
        .target(es_version)
        .skip_helper_injection(self.skip_helper_injection)
        .minify(js_minify)
        .hygiene(if self.disable_hygiene {
            None
        } else {
            Some(hygiene::Config { keep_class_names })
        })
        .fixer(!self.disable_fixer)
        .preset_env(config.env)
        .regenerator(regenerator)
        .finalize(
            base_url,
            paths.into_iter().collect(),
            base,
            syntax,
            config.module,
            comments,
        );

        let keep_import_assertions = experimental.keep_import_assertions;

        // Embedded runtime plugin target, based on assumption we have
        // 1. filesystem access for the cache
        // 2. embedded runtime can compiles & execute wasm
        #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
        let plugins = {
            let plugin_resolver = CachingResolver::new(
                40,
                NodeModulesResolver::new(TargetEnv::Node, Default::default(), true),
            );

            let transform_filename = match base {
                FileName::Real(path) => path.as_os_str().to_str().map(String::from),
                FileName::Custom(filename) => Some(filename.to_owned()),
                _ => None,
            };

            let plugin_context = PluginContext {
                filename: transform_filename,
                env_name: self.env_name.to_owned(),
            };

            if experimental.plugins.is_some() {
                swc_plugin_runner::cache::init_plugin_module_cache_once(&experimental.cache_root);
            }

            let comments = comments.cloned();
            let source_map = cm.clone();
            crate::plugin::plugins(
                Some(plugin_resolver),
                comments,
                source_map,
                experimental,
                plugin_context,
            )
        };

        // Native runtime plugin target, based on assumption we have
        // 1. no filesystem access, loading binary / cache management should be
        // performed externally
        // 2. native runtime compiles & execute wasm (i.e v8 on node, chrome)
        #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
        let plugins = {
            let transform_filename = match base {
                FileName::Real(path) => path.as_os_str().to_str().map(String::from),
                FileName::Custom(filename) => Some(filename.to_owned()),
                _ => None,
            };

            let plugin_context = PluginContext {
                filename: transform_filename,
                env_name: self.env_name.to_owned(),
            };

            swc_plugin_runner::cache::init_plugin_module_cache_once();
            let comments = comments.cloned();
            let source_map = cm.clone();
            crate::plugin::plugins(None, comments, source_map, experimental, plugin_context)
        };

        #[cfg(not(feature = "plugin"))]
        let plugins = crate::plugin::plugins();

        let pass = chain!(
            lint_to_fold(swc_ecma_lints::rules::all(LintParams {
                program: &program,
                lint_config: &lints,
                top_level_ctxt,
                unresolved_ctxt,
                es_version,
                source_map: cm.clone(),
            })),
            // Decorators may use type information
            Optional::new(
                decorators(decorators::Config {
                    legacy: transform.legacy_decorator,
                    emit_metadata: transform.decorator_metadata,
                    use_define_for_class_props: !assumptions.set_public_class_fields
                }),
                syntax.decorators()
            ),
            // The transform strips import assertions, so it's only enabled if
            // keep_import_assertions is false.
            Optional::new(import_assertions(), !keep_import_assertions),
            Optional::new(
                typescript::strip_with_jsx(
                    cm.clone(),
                    typescript::Config {
                        pragma: Some(transform.react.pragma.clone()),
                        pragma_frag: Some(transform.react.pragma_frag.clone()),
                        ts_enum_config: TSEnumConfig {
                            treat_const_enum_as_enum: transform.treat_const_enum_as_enum,
                            ts_enum_is_readonly: assumptions.ts_enum_is_readonly,
                        },
                        use_define_for_class_fields: !assumptions.set_public_class_fields,
                        ..Default::default()
                    },
                    comments,
                    top_level_mark
                ),
                syntax.typescript()
            ),
            plugins,
            custom_before_pass(&program),
            // handle jsx
            Optional::new(
                react::react(cm.clone(), comments, transform.react, top_level_mark),
                syntax.jsx()
            ),
            pass,
            Optional::new(jest::jest(), transform.hidden.jest),
            Optional::new(
                dropped_comments_preserver(comments.cloned()),
                preserve_all_comments
            ),
        );

        Ok(BuiltInput {
            program,
            minify: config.minify,
            pass,
            external_helpers,
            syntax,
            target: es_version,
            is_module,
            source_maps: source_maps.unwrap_or(SourceMapsConfig::Bool(false)),
            inline_sources_content: config.inline_sources_content,
            input_source_map: config.input_source_map.clone(),
            output_path: output_path.map(|v| v.to_path_buf()),
            source_file_name,
            comments: comments.cloned(),
            preserve_comments,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
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
#[allow(clippy::large_enum_variant)]
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
                    keep_class_names: false,
                    ..Default::default()
                },
                module: None,
                minify: false,
                source_maps: None,
                input_source_map: InputSourceMap::default(),
                ..Default::default()
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
                    keep_class_names: false,
                    ..Default::default()
                },
                module: None,
                minify: false,
                source_maps: None,
                input_source_map: InputSourceMap::default(),
                ..Default::default()
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
                    keep_class_names: false,
                    ..Default::default()
                },
                module: None,
                minify: false,
                source_maps: None,
                input_source_map: InputSourceMap::default(),
                ..Default::default()
            },
        ])
    }
}

impl Rc {
    /// This method returns `Ok(None)` if the file should be ignored.
    pub fn into_config(self, filename: Option<&Path>) -> Result<Option<Config>, Error> {
        let cs = match self {
            Rc::Single(mut c) => match filename {
                Some(filename) => {
                    if c.matches(filename)? {
                        c.adjust(filename);

                        return Ok(Some(c));
                    } else {
                        return Ok(None);
                    }
                }
                // TODO
                None => return Ok(Some(c)),
            },
            Rc::Multi(cs) => cs,
        };

        match filename {
            Some(filename) => {
                for mut c in cs {
                    if c.matches(filename)? {
                        c.adjust(filename);

                        return Ok(Some(c));
                    }
                }
            }
            None => return Ok(Some(Config::default())),
        }

        bail!(".swcrc exists but not matched")
    }
}

/// A single object in the `.swcrc` file
#[derive(Debug, Default, Clone, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub env: Option<swc_ecma_preset_env::Config>,

    #[serde(default)]
    pub test: Option<FileMatcher>,

    #[serde(default)]
    pub exclude: Option<FileMatcher>,

    #[serde(default)]
    pub jsc: JscConfig,

    #[serde(default)]
    pub module: Option<ModuleConfig>,

    #[serde(default)]
    pub minify: bool,

    #[serde(default)]
    pub input_source_map: InputSourceMap,

    /// Possible values are: `'inline'`, `true`, `false`.
    #[serde(default)]
    pub source_maps: Option<SourceMapsConfig>,

    #[serde(default = "true_by_default")]
    pub inline_sources_content: bool,

    #[serde(default)]
    pub error: ErrorConfig,

    #[serde(rename = "$schema")]
    pub schema: Option<String>,
}

/// Second argument of `minify`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JsMinifyOptions {
    #[serde(default)]
    pub compress: BoolOrObject<TerserCompressorOptions>,

    #[serde(default)]
    pub mangle: BoolOrObject<MangleOptions>,

    #[serde(default)]
    pub format: JsMinifyFormatOptions,

    #[serde(default)]
    pub ecma: TerserEcmaVersion,

    #[serde(default)]
    pub keep_classnames: bool,

    #[serde(default)]
    pub keep_fnames: bool,

    #[serde(default)]
    pub module: bool,

    #[serde(default)]
    pub safari10: bool,

    #[serde(default = "true_by_default")]
    pub toplevel: bool,

    #[serde(default)]
    pub source_map: BoolOrObject<TerserSourceMapOption>,

    #[serde(default)]
    pub output_path: Option<String>,

    #[serde(default = "true_by_default")]
    pub inline_sources_content: bool,
}

fn true_by_default() -> bool {
    true
}

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
    pub content: Option<String>,
}

/// `jsc.minify.format`.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
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

    #[serde(default)]
    pub comments: BoolOrObject<JsMinifyCommentOption>,

    /// Not implemented yet.
    #[serde(default)]
    pub ecma: usize,

    /// Not implemented yet.
    #[serde(default, alias = "indent_level")]
    pub indent_level: usize,

    /// Not implemented yet.
    #[serde(default, alias = "indent_start")]
    pub indent_start: bool,

    /// Not implemented yet.
    #[serde(default, alias = "inline_script")]
    pub inline_script: bool,

    /// Not implemented yet.
    #[serde(default, alias = "keep_numbers")]
    pub keep_numbers: bool,

    /// Not implemented yet.
    #[serde(default, alias = "keep_quoted_props")]
    pub keep_quoted_props: bool,

    /// Not implemented yet.
    #[serde(default, alias = "max_line_len")]
    pub max_line_len: BoolOrObject<usize>,

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
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JsMinifyCommentOption {
    #[serde(rename = "some")]
    PreserveSomeComments,
    #[serde(rename = "all")]
    PreserveAllComments,
}

impl Default for JsMinifyCommentOption {
    fn default() -> Self {
        JsMinifyCommentOption::PreserveSomeComments
    }
}

impl Config {
    /// Adjust config for `file`.
    ///
    ///
    ///
    /// - typescript: `tsx` will be modified if file extension is `ts`.
    pub fn adjust(&mut self, file: &Path) {
        if let Some(Syntax::Typescript(TsConfig { tsx, dts, .. })) = &mut self.jsc.syntax {
            let is_dts = file
                .file_name()
                .and_then(|f| f.to_str())
                .map(|s| s.ends_with(".d.ts"))
                .unwrap_or(false);

            if is_dts {
                *dts = true;
            }

            let is_ts = file.extension().map(|v| v == "ts").unwrap_or(false);
            if is_ts {
                *tsx = false;
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum FileMatcher {
    None,
    Regex(CachedRegex),
    Multi(Vec<FileMatcher>),
}

impl Default for FileMatcher {
    fn default() -> Self {
        Self::None
    }
}

impl FileMatcher {
    pub fn matches(&self, filename: &Path) -> Result<bool, Error> {
        match self {
            FileMatcher::None => Ok(false),

            FileMatcher::Regex(re) => {
                let filename = if cfg!(target_os = "windows") {
                    filename.to_string_lossy().replace('\\', "/")
                } else {
                    filename.to_string_lossy().to_string()
                };

                Ok(re.is_match(&filename))
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
pub struct BuiltInput<P: swc_ecma_visit::Fold> {
    pub program: Program,
    pub pass: P,
    pub syntax: Syntax,
    pub target: EsVersion,
    /// Minification for **codegen**. Minifier transforms will be inserted into
    /// `pass`.
    pub minify: bool,
    pub external_helpers: bool,
    pub source_maps: SourceMapsConfig,
    pub input_source_map: InputSourceMap,
    pub is_module: IsModule,
    pub output_path: Option<PathBuf>,

    pub source_file_name: Option<String>,

    pub comments: Option<SingleThreadedComments>,
    pub preserve_comments: Option<BoolOrObject<JsMinifyCommentOption>>,

    pub inline_sources_content: bool,
}

/// `jsc` in  `.swcrc`.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscConfig {
    #[serde(default)]
    pub assumptions: Option<Assumptions>,

    #[serde(rename = "parser", default)]
    pub syntax: Option<Syntax>,

    #[serde(default)]
    pub transform: Option<TransformConfig>,

    #[serde(default)]
    pub external_helpers: bool,

    #[serde(default)]
    pub target: Option<EsVersion>,

    #[serde(default)]
    pub loose: bool,

    #[serde(default)]
    pub keep_class_names: bool,

    #[serde(default)]
    pub base_url: PathBuf,

    #[serde(default)]
    pub paths: Paths,

    #[serde(default)]
    pub minify: Option<JsMinifyOptions>,

    #[serde(default)]
    pub experimental: JscExperimental,

    #[serde(default)]
    pub lints: LintConfig,

    #[serde(default)]
    pub preserve_all_comments: bool,
}

/// `jsc.experimental` in `.swcrc`
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscExperimental {
    /// This requires cargo feature `plugin`.
    #[serde(default)]
    pub plugins: Option<Vec<PluginConfig>>,
    /// If true, keeps import assertions in the output.
    #[serde(default)]
    pub keep_import_assertions: bool,
    /// Location where swc may stores its intermediate cache.
    /// Currently this is only being used for wasm plugin's bytecache.
    /// Path should be absolute directory, which will be created if not exist.
    /// This configuration behavior can change anytime under experimental flag
    /// and will not be considered as breaking changes.
    #[serde(default)]
    pub cache_root: Option<String>,
}

impl Merge for JscExperimental {
    fn merge(&mut self, from: &Self) {
        if self.plugins.is_none() {
            self.plugins = from.plugins.clone();
        }
        if self.cache_root.is_none() {
            self.cache_root = from.cache_root.clone();
        }

        self.keep_import_assertions |= from.keep_import_assertions;
    }
}

/// `paths` section of `tsconfig.json`.
pub type Paths = IndexMap<String, Vec<String>, ahash::RandomState>;
pub(crate) type CompiledPaths = Vec<(String, Vec<String>)>;

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
    #[serde(rename = "systemjs")]
    SystemJs(modules::system_js::Config),
    #[serde(rename = "es6")]
    Es6,
}

impl ModuleConfig {
    pub fn build(
        cm: Arc<SourceMap>,
        base_url: PathBuf,
        paths: CompiledPaths,
        base: &FileName,
        root_mark: Mark,
        config: Option<ModuleConfig>,
        scope: RustRc<RefCell<Scope>>,
    ) -> Box<dyn swc_ecma_visit::Fold> {
        let base = match base {
            FileName::Real(v) if !paths.is_empty() => {
                FileName::Real(v.canonicalize().unwrap_or_else(|_| v.to_path_buf()))
            }
            _ => base.clone(),
        };

        match config {
            None | Some(ModuleConfig::Es6) => {
                if paths.is_empty() {
                    Box::new(noop())
                } else {
                    let resolver = build_resolver(base_url, paths);

                    Box::new(import_rewriter(base, resolver))
                }
            }
            Some(ModuleConfig::CommonJs(config)) => {
                let base_pass = module_hoister();
                if paths.is_empty() {
                    Box::new(chain!(
                        base_pass,
                        modules::common_js::common_js(root_mark, config, Some(scope),)
                    ))
                } else {
                    let resolver = build_resolver(base_url, paths);
                    Box::new(chain!(
                        base_pass,
                        modules::common_js::common_js_with_resolver(
                            resolver,
                            base,
                            root_mark,
                            config,
                            Some(scope),
                        )
                    ))
                }
            }
            Some(ModuleConfig::Umd(config)) => {
                let base_pass = module_hoister();

                if paths.is_empty() {
                    Box::new(chain!(base_pass, modules::umd::umd(cm, root_mark, config)))
                } else {
                    let resolver = build_resolver(base_url, paths);

                    Box::new(chain!(
                        base_pass,
                        modules::umd::umd_with_resolver(resolver, base, cm, root_mark, config,)
                    ))
                }
            }
            Some(ModuleConfig::Amd(config)) => {
                let base_pass = module_hoister();

                if paths.is_empty() {
                    Box::new(chain!(base_pass, modules::amd::amd(config)))
                } else {
                    let resolver = build_resolver(base_url, paths);

                    Box::new(chain!(
                        base_pass,
                        modules::amd::amd_with_resolver(resolver, base, config)
                    ))
                }
            }
            Some(ModuleConfig::SystemJs(config)) => {
                if paths.is_empty() {
                    Box::new(modules::system_js::system_js(root_mark, config))
                } else {
                    let resolver = build_resolver(base_url, paths);

                    Box::new(modules::system_js::system_js_with_resolver(
                        resolver, base, root_mark, config,
                    ))
                }
            }
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

    #[serde(default)]
    pub decorator_metadata: bool,

    #[serde(default)]
    pub hidden: HiddenTransformConfig,

    #[serde(default)]
    pub regenerator: regenerator::Config,

    #[serde(default)]
    pub treat_const_enum_as_enum: bool,

    #[serde(default)]
    pub use_define_for_class_fields: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct HiddenTransformConfig {
    #[serde(default)]
    pub jest: bool,
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

    #[serde(default = "true_by_default")]
    pub simplify: bool,

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

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ErrorConfig {
    pub filename: bool,
}
impl Default for ErrorConfig {
    fn default() -> Self {
        ErrorConfig { filename: true }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct GlobalPassOption {
    #[serde(default)]
    pub vars: IndexMap<JsWord, JsWord, ahash::RandomState>,
    #[serde(default)]
    pub envs: GlobalInliningPassEnvs,

    #[serde(default)]
    pub typeofs: AHashMap<JsWord, JsWord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GlobalInliningPassEnvs {
    List(AHashSet<String>),
    Map(AHashMap<JsWord, JsWord>),
}

impl Default for GlobalInliningPassEnvs {
    fn default() -> Self {
        let mut v = HashSet::default();
        v.insert(String::from("NODE_ENV"));
        v.insert(String::from("SWC_ENV"));

        GlobalInliningPassEnvs::List(v)
    }
}

impl GlobalPassOption {
    pub fn build(self, cm: &SourceMap, handler: &Handler) -> impl 'static + Fold {
        type ValuesMap = Arc<AHashMap<JsWord, Expr>>;

        fn expr(cm: &SourceMap, handler: &Handler, src: String) -> Box<Expr> {
            let fm = cm.new_source_file(FileName::Anon, src);

            let mut errors = vec![];
            let expr = parse_file_as_expr(
                &fm,
                Syntax::Es(Default::default()),
                Default::default(),
                None,
                &mut errors,
            );

            for e in errors {
                e.into_diagnostic(handler).emit()
            }

            match expr {
                Ok(v) => v,
                _ => panic!("{} is not a valid expression", fm.src),
            }
        }

        fn mk_map(
            cm: &SourceMap,
            handler: &Handler,
            values: impl Iterator<Item = (JsWord, JsWord)>,
            is_env: bool,
        ) -> ValuesMap {
            let mut m = HashMap::default();

            for (k, v) in values {
                let v = if is_env {
                    format!("'{}'", v)
                } else {
                    (*v).into()
                };
                let v_str = v.clone();

                let e = expr(cm, handler, v_str);

                m.insert((*k).into(), *e);
            }

            Arc::new(m)
        }

        let env_map = if cfg!(target_arch = "wasm32") {
            Arc::new(Default::default())
        } else {
            match &self.envs {
                GlobalInliningPassEnvs::List(env_list) => {
                    static CACHE: Lazy<DashMap<Vec<String>, ValuesMap, ahash::RandomState>> =
                        Lazy::new(Default::default);

                    let cache_key = env_list.iter().cloned().collect::<Vec<_>>();
                    if let Some(v) = CACHE.get(&cache_key).as_deref().cloned() {
                        v
                    } else {
                        let map = mk_map(
                            cm,
                            handler,
                            env::vars()
                                .filter(|(k, _)| env_list.contains(&*k))
                                .map(|(k, v)| (k.into(), v.into())),
                            true,
                        );
                        CACHE.insert(cache_key, map.clone());
                        map
                    }
                }

                GlobalInliningPassEnvs::Map(map) => {
                    static CACHE: Lazy<
                        DashMap<Vec<(JsWord, JsWord)>, ValuesMap, ahash::RandomState>,
                    > = Lazy::new(Default::default);

                    let cache_key = self
                        .vars
                        .iter()
                        .map(|(k, v)| (k.clone(), v.clone()))
                        .collect::<Vec<_>>();
                    if let Some(v) = CACHE.get(&cache_key) {
                        (*v).clone()
                    } else {
                        let map = mk_map(
                            cm,
                            handler,
                            map.iter().map(|(k, v)| (k.clone(), v.clone())),
                            false,
                        );
                        CACHE.insert(cache_key, map.clone());
                        map
                    }
                }
            }
        };

        let global_exprs = {
            static CACHE: Lazy<DashMap<Vec<(JsWord, JsWord)>, GlobalExprMap, ahash::RandomState>> =
                Lazy::new(Default::default);

            let cache_key = self
                .vars
                .iter()
                .filter(|(k, _)| k.contains('.'))
                .map(|(k, v)| (k.clone(), v.clone()))
                .collect::<Vec<_>>();

            if let Some(v) = CACHE.get(&cache_key) {
                (*v).clone()
            } else {
                let map = self
                    .vars
                    .iter()
                    .filter(|(k, _)| k.contains('.'))
                    .map(|(k, v)| {
                        (
                            *expr(cm, handler, k.to_string()),
                            *expr(cm, handler, v.to_string()),
                        )
                    })
                    .collect::<Vec<_>>();
                let map = Arc::new(map);
                CACHE.insert(cache_key, map.clone());
                map
            }
        };

        let global_map = {
            static CACHE: Lazy<DashMap<Vec<(JsWord, JsWord)>, ValuesMap, ahash::RandomState>> =
                Lazy::new(Default::default);

            let cache_key = self
                .vars
                .iter()
                .filter(|(k, _)| !k.contains('.'))
                .map(|(k, v)| (k.clone(), v.clone()))
                .collect::<Vec<_>>();
            if let Some(v) = CACHE.get(&cache_key) {
                (*v).clone()
            } else {
                let map = mk_map(
                    cm,
                    handler,
                    self.vars.into_iter().filter(|(k, _)| !k.contains('.')),
                    false,
                );
                CACHE.insert(cache_key, map.clone());
                map
            }
        };

        inline_globals2(env_map, global_map, global_exprs, Arc::new(self.typeofs))
    }
}

fn default_env_name() -> String {
    if let Ok(v) = env::var("SWC_ENV") {
        return v;
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
        if let Some(ref from) = *from {
            match *self {
                Some(ref mut v) => v.merge(from),
                None => *self = Some(from.clone()),
            }
        }
    }
}

impl Merge for Config {
    fn merge(&mut self, from: &Self) {
        self.jsc.merge(&from.jsc);
        self.module.merge(&from.module);
        self.minify.merge(&from.minify);
        self.env.merge(&from.env);
        self.source_maps.merge(&from.source_maps);
        self.input_source_map.merge(&from.input_source_map);
        self.inline_sources_content
            .merge(&from.inline_sources_content);
    }
}

impl Merge for JsMinifyOptions {
    fn merge(&mut self, from: &Self) {
        self.compress.merge(&from.compress);
        self.mangle.merge(&from.mangle);
        self.format.merge(&from.format);
        self.ecma.merge(&from.ecma);
        self.keep_classnames |= from.keep_classnames;
        self.keep_fnames |= from.keep_fnames;
        self.safari10 |= from.safari10;
        self.toplevel |= from.toplevel;
        self.inline_sources_content |= from.inline_sources_content;
    }
}

impl Merge for TerserCompressorOptions {
    fn merge(&mut self, from: &Self) {
        self.defaults |= from.defaults;
        // TODO
    }
}

impl Merge for MangleOptions {
    fn merge(&mut self, from: &Self) {
        self.props.merge(&from.props);

        self.top_level |= from.top_level;
        self.keep_class_names |= from.keep_class_names;
        self.keep_fn_names |= from.keep_fn_names;
        self.keep_private_props |= from.keep_private_props;
        self.safari10 |= from.safari10;
    }
}

impl Merge for JsMinifyFormatOptions {
    fn merge(&mut self, from: &Self) {
        self.comments.merge(&from.comments);
    }
}

impl Merge for JsMinifyCommentOption {
    fn merge(&mut self, _: &Self) {}
}

impl Merge for ManglePropertiesOptions {
    fn merge(&mut self, from: &Self) {
        self.undeclared |= from.undeclared;
    }
}

impl Merge for TerserEcmaVersion {
    fn merge(&mut self, from: &Self) {
        *self = from.clone();
    }
}

impl Merge for SourceMapsConfig {
    fn merge(&mut self, _: &Self) {}
}

impl Merge for InputSourceMap {
    fn merge(&mut self, r: &Self) {
        if let InputSourceMap::Bool(false) = *self {
            *self = r.clone();
        }
    }
}

impl Merge for swc_ecma_preset_env::Config {
    fn merge(&mut self, from: &Self) {
        *self = from.clone();
    }
}

impl Merge for JscConfig {
    fn merge(&mut self, from: &Self) {
        self.assumptions.merge(&from.assumptions);
        self.syntax.merge(&from.syntax);
        self.transform.merge(&from.transform);
        self.external_helpers.merge(&from.external_helpers);
        self.target.merge(&from.target);
        self.loose.merge(&from.loose);
        self.keep_class_names.merge(&from.keep_class_names);
        self.paths.merge(&from.paths);
        self.minify.merge(&from.minify);
        self.experimental.merge(&from.experimental);
        self.preserve_all_comments
            .merge(&from.preserve_all_comments)
    }
}

impl<K, V, S> Merge for IndexMap<K, V, S>
where
    K: Clone + Eq + std::hash::Hash,
    V: Clone,
    S: Clone + BuildHasher,
{
    fn merge(&mut self, from: &Self) {
        if self.is_empty() {
            *self = (*from).clone();
        }
    }
}

impl<K, V, S> Merge for HashMap<K, V, S>
where
    K: Clone + Eq + std::hash::Hash,
    V: Clone,
    S: Clone + BuildHasher,
{
    fn merge(&mut self, from: &Self) {
        if self.is_empty() {
            *self = (*from).clone();
        } else {
            for (k, v) in from {
                self.entry(k.clone()).or_insert_with(|| v.clone());
            }
        }
    }
}

impl Merge for EsVersion {
    fn merge(&mut self, from: &Self) {
        if *self < *from {
            *self = *from
        }
    }
}

impl Merge for Option<ModuleConfig> {
    fn merge(&mut self, from: &Self) {
        if let Some(ref c2) = *from {
            *self = Some(c2.clone())
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
        match (&mut *self, from) {
            (Syntax::Es(a), Syntax::Es(b)) => {
                a.merge(b);
            }
            (Syntax::Typescript(a), Syntax::Typescript(b)) => {
                a.merge(b);
            }
            _ => {
                *self = *from;
            }
        }
    }
}

impl Merge for swc_ecma_parser::EsConfig {
    fn merge(&mut self, from: &Self) {
        self.jsx |= from.jsx;
        self.fn_bind |= from.fn_bind;
        self.decorators |= from.decorators;
        self.decorators_before_export |= from.decorators_before_export;
        self.export_default_from |= from.export_default_from;
        self.import_assertions |= from.import_assertions;
        self.private_in_object |= from.private_in_object;
    }
}

impl Merge for swc_ecma_parser::TsConfig {
    fn merge(&mut self, from: &Self) {
        self.tsx |= from.tsx;
        self.decorators |= from.decorators;
    }
}

impl Merge for Assumptions {
    fn merge(&mut self, from: &Self) {
        self.array_like_is_iterable |= from.array_like_is_iterable;
        self.constant_reexports |= from.constant_reexports;
        self.constant_super |= from.constant_super;
        self.enumerable_module_meta |= from.enumerable_module_meta;
        self.ignore_function_length |= from.ignore_function_length;
        self.ignore_function_name |= from.ignore_function_name;
        self.ignore_to_primitive_hint |= from.ignore_to_primitive_hint;
        self.iterable_is_array |= from.iterable_is_array;
        self.mutable_template_object |= from.mutable_template_object;
        self.no_class_calls |= from.no_class_calls;
        self.no_document_all |= from.no_document_all;
        self.no_incomplete_ns_import_detection |= from.no_incomplete_ns_import_detection;
        self.no_new_arrows |= from.no_new_arrows;
        self.object_rest_no_symbols |= from.object_rest_no_symbols;
        self.private_fields_as_properties |= from.private_fields_as_properties;
        self.pure_getters |= from.pure_getters;
        self.set_class_methods |= from.set_class_methods;
        self.set_computed_properties |= from.set_computed_properties;
        self.set_public_class_fields |= from.set_public_class_fields;
        self.set_spread_properties |= from.set_spread_properties;
        self.skip_for_of_iterator_closing |= from.skip_for_of_iterator_closing;
        self.super_is_callable_constructor |= from.super_is_callable_constructor;
        self.ts_enum_is_readonly |= from.ts_enum_is_readonly;
    }
}

impl Merge for TransformConfig {
    fn merge(&mut self, from: &Self) {
        self.optimizer.merge(&from.optimizer);
        self.const_modules.merge(&from.const_modules);
        self.react.merge(&from.react);
        self.hidden.merge(&from.hidden);
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
        if *from != react::Options::default() {
            *self = from.clone();
        }
    }
}

impl Merge for ConstModulesConfig {
    fn merge(&mut self, from: &Self) {
        *self = from.clone()
    }
}

impl Merge for HiddenTransformConfig {
    fn merge(&mut self, from: &Self) {
        self.jest |= from.jest;
    }
}

fn build_resolver(base_url: PathBuf, paths: CompiledPaths) -> Box<SwcImportResolver> {
    static CACHE: Lazy<DashMap<(PathBuf, CompiledPaths), SwcImportResolver, ahash::RandomState>> =
        Lazy::new(Default::default);

    if let Some(cached) = CACHE.get(&(base_url.clone(), paths.clone())) {
        return Box::new((*cached).clone());
    }

    let r = {
        let r = TsConfigResolver::new(
            NodeModulesResolver::default(),
            base_url.clone(),
            paths.clone(),
        );
        let r = CachingResolver::new(40, r);

        let r = NodeImportResolver::new(r);
        Arc::new(r)
    };

    CACHE.insert((base_url, paths), r.clone());

    Box::new(r)
}
