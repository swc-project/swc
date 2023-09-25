#![cfg_attr(
    any(not(any(feature = "plugin")), target_arch = "wasm32"),
    allow(unused)
)]
use std::{
    collections::{HashMap, HashSet},
    env, fmt,
    path::{Path, PathBuf},
    sync::Arc,
    usize,
};

use anyhow::{bail, Context, Error};
use dashmap::DashMap;
use either::Either;
use indexmap::IndexMap;
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use serde::{
    de::{Unexpected, Visitor},
    Deserialize, Deserializer, Serialize, Serializer,
};
use swc_atoms::JsWord;
use swc_cached::regex::CachedRegex;
use swc_common::{
    chain,
    collections::{AHashMap, AHashSet, ARandomState},
    comments::{Comments, SingleThreadedComments},
    errors::Handler,
    plugin::metadata::TransformPluginMetadataContext,
    FileName, Mark, SourceMap, SyntaxContext,
};
use swc_config::{
    config_types::{BoolConfig, BoolOr, BoolOrDataConfig, MergingOption},
    merge::Merge,
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
    MangleOptions,
};
#[allow(deprecated)]
pub use swc_ecma_parser::JscTarget;
use swc_ecma_parser::{parse_file_as_expr, Syntax, TsConfig};
use swc_ecma_transforms::{
    feature::FeatureFlag,
    hygiene, modules,
    modules::{path::NodeImportResolver, rewriter::import_rewriter, EsModuleConfig},
    optimization::{const_modules, json_parse, simplifier},
    pass::{noop, Optional},
    proposals::{
        decorators, explicit_resource_management::explicit_resource_management,
        export_default_from, import_assertions,
    },
    react::{self, default_pragma, default_pragma_frag},
    resolver,
    typescript::{self, TsImportExportAssignConfig},
    Assumptions,
};
use swc_ecma_transforms_compat::es2015::regenerator;
use swc_ecma_transforms_optimization::{
    inline_globals2,
    simplify::{dce::Config as DceConfig, Config as SimplifyConfig},
    GlobalExprMap,
};
use swc_ecma_utils::NodeIgnoringSpan;
use swc_ecma_visit::{Fold, VisitMutWith};

pub use crate::plugin::PluginConfig;
use crate::{
    builder::PassBuilder, dropped_comments_preserver::dropped_comments_preserver, SwcImportResolver,
};

#[cfg(test)]
mod tests;

#[cfg(feature = "plugin")]
/// A shared instance to plugin's module bytecode cache.
pub static PLUGIN_MODULE_CACHE: Lazy<swc_plugin_runner::cache::PluginModuleCache> =
    Lazy::new(Default::default);

/// Create a new cache instance if not initialized. This can be called multiple
/// time, but any subsequent call will be ignored.
///
/// This fn have a side effect to create path to cache if given path is not
/// resolvable if fs_cache_store is enabled. If root is not specified, it'll
/// generate default root for cache location.
///
/// If cache failed to initialize filesystem cache for given location
/// it'll be serve in-memory cache only.
#[cfg(feature = "plugin")]
pub fn init_plugin_module_cache_once(
    enable_fs_cache_store: bool,
    fs_cache_store_root: &Option<String>,
) {
    PLUGIN_MODULE_CACHE.inner.get_or_init(|| {
        parking_lot::Mutex::new(swc_plugin_runner::cache::PluginModuleCache::create_inner(
            enable_fs_cache_store,
            fs_cache_store_root,
        ))
    });
}

#[derive(Clone, Debug, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum IsModule {
    Bool(bool),
    Unknown,
}

impl Default for IsModule {
    fn default() -> Self {
        IsModule::Bool(true)
    }
}

impl Merge for IsModule {
    fn merge(&mut self, other: Self) {
        if *self == Default::default() {
            *self = other;
        }
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

    #[serde(skip_deserializing, default)]
    pub unresolved_mark: Option<Mark>,

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
    pub output_path: Option<PathBuf>,

    #[serde(default)]
    pub experimental: ExperimentalOptions,
}

#[derive(Debug, Clone, Default, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ExperimentalOptions {
    #[serde(default)]
    pub error_format: Option<ErrorFormat>,
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
        config: Option<Config>,
        comments: Option<&'a SingleThreadedComments>,
        custom_before_pass: impl FnOnce(&Program) -> P,
    ) -> Result<BuiltInput<Box<dyn 'a + Fold>>, Error>
    where
        P: 'a + swc_ecma_visit::Fold,
    {
        let mut cfg = self.config.clone();

        cfg.merge(config.unwrap_or_default());

        if let FileName::Real(base) = base {
            cfg.adjust(base);
        }

        let is_module = cfg.is_module.unwrap_or_default();

        let mut source_maps = self.source_maps.clone();
        source_maps.merge(cfg.source_maps.clone());

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
        } = cfg.jsc;
        let loose = loose.into_bool();
        let preserve_all_comments = preserve_all_comments.into_bool();
        let keep_class_names = keep_class_names.into_bool();
        let external_helpers = external_helpers.into_bool();

        let mut assumptions = assumptions.unwrap_or_else(|| {
            if loose {
                Assumptions::all()
            } else {
                Assumptions::default()
            }
        });

        let unresolved_mark = self.unresolved_mark.unwrap_or_else(Mark::new);
        let top_level_mark = self.top_level_mark.unwrap_or_else(Mark::new);

        if target.is_some() && cfg.env.is_some() {
            bail!("`env` and `jsc.target` cannot be used together");
        }

        let es_version = target.unwrap_or_default();

        let syntax = syntax.unwrap_or_default();

        let mut program = parse(syntax, es_version, is_module)?;

        let mut transform = transform.into_inner().unwrap_or_default();

        // Do a resolver pass before everything.
        //
        // We do this before creating custom passes, so custom passses can use the
        // variable management system based on the syntax contexts.
        if syntax.typescript() {
            assumptions.set_class_methods |= !transform.use_define_for_class_fields.into_bool();
        }

        assumptions.set_public_class_fields |= !transform.use_define_for_class_fields.into_bool();

        program.visit_mut_with(&mut resolver(
            unresolved_mark,
            top_level_mark,
            syntax.typescript(),
        ));

        if program.is_module() {
            js_minify = js_minify.map(|c| {
                let compress = c
                    .compress
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        if c.toplevel.is_none() {
                            c.toplevel = Some(TerserTopLevelOptions::Bool(true));
                        }

                        if matches!(
                            cfg.module,
                            None | Some(ModuleConfig::Es6(..) | ModuleConfig::NodeNext(..))
                        ) {
                            c.module = true;
                        }

                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));

                let mangle = c
                    .mangle
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        if c.top_level.is_none() {
                            c.top_level = Some(true);
                        }

                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));

                JsMinifyOptions {
                    compress,
                    mangle,
                    ..c
                }
            });
        }

        if js_minify.is_some() && js_minify.as_ref().unwrap().keep_fnames {
            js_minify = js_minify.map(|c| {
                let compress = c
                    .compress
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        c.keep_fnames = true;
                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
                let mangle = c
                    .mangle
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        c.keep_fn_names = true;
                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
                JsMinifyOptions {
                    compress,
                    mangle,
                    ..c
                }
            });
        }

        if js_minify.is_some() && js_minify.as_ref().unwrap().keep_classnames {
            js_minify = js_minify.map(|c| {
                let compress = c
                    .compress
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        c.keep_classnames = true;
                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
                let mangle = c
                    .mangle
                    .unwrap_as_option(|default| match default {
                        Some(true) => Some(Default::default()),
                        _ => None,
                    })
                    .map(|mut c| {
                        c.keep_class_names = true;
                        c
                    })
                    .map(BoolOrDataConfig::from_obj)
                    .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
                JsMinifyOptions {
                    compress,
                    mangle,
                    ..c
                }
            });
        }

        let regenerator = transform.regenerator.clone();

        let preserve_comments = if preserve_all_comments {
            BoolOr::Bool(true)
        } else {
            js_minify
                .as_ref()
                .map(|v| match v.format.comments.clone().into_inner() {
                    Some(v) => v,
                    None => BoolOr::Bool(true),
                })
                .unwrap_or_else(|| {
                    BoolOr::Data(if cfg.minify.into_bool() {
                        JsMinifyCommentOption::PreserveSomeComments
                    } else {
                        JsMinifyCommentOption::PreserveAllComments
                    })
                })
        };

        if syntax.typescript() {
            transform.legacy_decorator = true.into();
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

        let simplifier_pass = {
            if let Some(ref opts) = optimizer.as_ref().and_then(|o| o.simplify) {
                match opts {
                    SimplifyOption::Bool(allow_simplify) => {
                        if *allow_simplify {
                            Either::Left(simplifier(top_level_mark, Default::default()))
                        } else {
                            Either::Right(noop())
                        }
                    }
                    SimplifyOption::Json(cfg) => Either::Left(simplifier(
                        top_level_mark,
                        SimplifyConfig {
                            dce: DceConfig {
                                preserve_imports_with_side_effects: cfg
                                    .preserve_imports_with_side_effects,
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                    )),
                }
            } else {
                Either::Right(noop())
            }
        };

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
            simplifier_pass,
            json_parse_pass
        );

        let import_export_assign_config = match cfg.module {
            Some(ModuleConfig::Es6(..)) => TsImportExportAssignConfig::EsNext,
            Some(ModuleConfig::CommonJs(..))
            | Some(ModuleConfig::Amd(..))
            | Some(ModuleConfig::Umd(..)) => TsImportExportAssignConfig::Preserve,
            Some(ModuleConfig::NodeNext(..)) => TsImportExportAssignConfig::NodeNext,
            // TODO: should Preserve for SystemJS
            _ => TsImportExportAssignConfig::Classic,
        };

        let verbatim_module_syntax = transform.verbatim_module_syntax.into_bool();

        let charset = cfg.jsc.output.charset.or_else(|| {
            if js_minify.as_ref()?.format.ascii_only {
                Some(OutputCharset::Ascii)
            } else {
                None
            }
        });

        let preamble = if !cfg.jsc.output.preamble.is_empty() {
            cfg.jsc.output.preamble
        } else {
            js_minify
                .as_ref()
                .map(|v| v.format.preamble.clone())
                .unwrap_or_default()
        };

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
            Some(hygiene::Config {
                keep_class_names,
                ..Default::default()
            })
        })
        .fixer(!self.disable_fixer)
        .preset_env(cfg.env)
        .regenerator(regenerator)
        .finalize(
            base_url,
            paths.into_iter().collect(),
            base,
            syntax,
            cfg.module,
            comments.map(|v| v as _),
        );

        let keep_import_attributes = experimental.keep_import_attributes.into_bool();

        #[cfg(feature = "plugin")]
        let plugin_transforms = {
            let transform_filename = match base {
                FileName::Real(path) => path.as_os_str().to_str().map(String::from),
                FileName::Custom(filename) => Some(filename.to_owned()),
                _ => None,
            };
            let transform_metadata_context = Arc::new(TransformPluginMetadataContext::new(
                transform_filename,
                self.env_name.to_owned(),
                None,
            ));

            // Embedded runtime plugin target, based on assumption we have
            // 1. filesystem access for the cache
            // 2. embedded runtime can compiles & execute wasm
            #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
            {
                use swc_ecma_loader::resolve::Resolve;

                let plugin_resolver = CachingResolver::new(
                    40,
                    NodeModulesResolver::new(TargetEnv::Node, Default::default(), true),
                );

                if let Some(plugins) = &experimental.plugins {
                    // Currently swc enables filesystemcache by default on Embedded runtime plugin
                    // target.
                    init_plugin_module_cache_once(true, &experimental.cache_root);

                    let mut inner_cache = PLUGIN_MODULE_CACHE
                        .inner
                        .get()
                        .expect("Cache should be available")
                        .lock();

                    // Populate cache to the plugin modules if not loaded
                    for plugin_config in plugins.iter() {
                        let plugin_name = &plugin_config.0;

                        if !inner_cache.contains(&plugin_name) {
                            let resolved_path = plugin_resolver.resolve(
                                &FileName::Real(PathBuf::from(&plugin_name)),
                                &plugin_name,
                            )?;

                            let path = if let FileName::Real(value) = resolved_path {
                                value
                            } else {
                                anyhow::bail!("Failed to resolve plugin path: {:?}", resolved_path);
                            };

                            inner_cache.store_bytes_from_path(&path, &plugin_name)?;
                            tracing::debug!("Initialized WASM plugin {plugin_name}");
                        }
                    }
                }

                crate::plugin::plugins(
                    experimental.plugins,
                    transform_metadata_context,
                    comments.cloned(),
                    cm.clone(),
                    unresolved_mark,
                )
            }

            // Native runtime plugin target, based on assumption we have
            // 1. no filesystem access, loading binary / cache management should be
            // performed externally
            // 2. native runtime compiles & execute wasm (i.e v8 on node, chrome)
            #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
            {
                handler.warn(
                    "Currently @swc/wasm does not support plugins, plugin transform will be \
                     skipped. Refer https://github.com/swc-project/swc/issues/3934 for the details.",
                );

                noop()
            }
        };

        #[cfg(not(feature = "plugin"))]
        let plugin_transforms = {
            if experimental.plugins.is_some() {
                handler.warn(
                    "Plugin is not supported with current @swc/core. Plugin transform will be \
                     skipped.",
                );
            }
            noop()
        };

        let pass: Box<dyn Fold> = if experimental
            .disable_builtin_transforms_for_internal_testing
            .into_bool()
        {
            Box::new(plugin_transforms)
        } else {
            Box::new(chain!(
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
                    match transform.decorator_version.unwrap_or_default() {
                        DecoratorVersion::V202112 => {
                            Either::Left(decorators(decorators::Config {
                                legacy: transform.legacy_decorator.into_bool(),
                                emit_metadata: transform.decorator_metadata.into_bool(),
                                use_define_for_class_fields: !assumptions.set_public_class_fields,
                            }))
                        }
                        DecoratorVersion::V202203 => {
                            Either::Right(
                            swc_ecma_transforms::proposals::decorator_2022_03::decorator_2022_03(),
                        )
                        }
                    },
                    syntax.decorators()
                ),
                Optional::new(
                    explicit_resource_management(),
                    syntax.explicit_resource_management()
                ),
                // The transform strips import assertions, so it's only enabled if
                // keep_import_assertions is false.
                Optional::new(import_assertions(), !keep_import_attributes),
                Optional::new(
                    typescript::tsx::<Option<&dyn Comments>>(
                        cm.clone(),
                        typescript::Config {
                            import_export_assign_config,
                            verbatim_module_syntax,
                            ..Default::default()
                        },
                        typescript::TsxConfig {
                            pragma: Some(
                                transform
                                    .react
                                    .pragma
                                    .clone()
                                    .unwrap_or_else(default_pragma)
                            ),
                            pragma_frag: Some(
                                transform
                                    .react
                                    .pragma_frag
                                    .clone()
                                    .unwrap_or_else(default_pragma_frag)
                            ),
                        },
                        comments.map(|v| v as _),
                        top_level_mark
                    ),
                    syntax.typescript()
                ),
                plugin_transforms,
                custom_before_pass(&program),
                // handle jsx
                Optional::new(
                    react::react::<&dyn Comments>(
                        cm.clone(),
                        comments.map(|v| v as _),
                        transform.react,
                        top_level_mark,
                        unresolved_mark
                    ),
                    syntax.jsx()
                ),
                pass,
                Optional::new(jest::jest(), transform.hidden.jest.into_bool()),
                Optional::new(
                    dropped_comments_preserver(comments.cloned()),
                    preserve_all_comments
                ),
            ))
        };

        Ok(BuiltInput {
            program,
            minify: cfg.minify.into_bool(),
            pass,
            external_helpers,
            syntax,
            target: es_version,
            is_module,
            source_maps: source_maps.unwrap_or(SourceMapsConfig::Bool(false)),
            inline_sources_content: cfg.inline_sources_content.into_bool(),
            input_source_map: cfg.input_source_map.clone().unwrap_or_default(),
            output_path: output_path.map(|v| v.to_path_buf()),
            source_file_name,
            comments: comments.cloned(),
            preserve_comments,
            emit_source_map_columns: cfg.emit_source_map_columns.into_bool(),
            output: JscOutputConfig { charset, preamble },
            emit_assert_for_import_attributes: experimental
                .emit_assert_for_import_attributes
                .into_bool(),
        })
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
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
                    ..Default::default()
                },
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
                    ..Default::default()
                },
                ..Default::default()
            },
            Config {
                env: None,
                test: Some(FileMatcher::Regex("\\.(cts|mts)$".into())),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsConfig {
                        tsx: false,
                        disallow_ambiguous_jsx_like: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
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
                    ..Default::default()
                },
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
#[derive(Debug, Default, Clone, Deserialize, Merge)]
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
    pub minify: BoolConfig<false>,

    #[serde(default)]
    pub input_source_map: Option<InputSourceMap>,

    /// Possible values are: `'inline'`, `true`, `false`.
    #[serde(default)]
    pub source_maps: Option<SourceMapsConfig>,

    #[serde(default)]
    pub inline_sources_content: BoolConfig<true>,

    #[serde(default)]
    pub emit_source_map_columns: BoolConfig<true>,

    #[serde(default)]
    pub error: ErrorConfig,

    #[serde(default)]
    pub is_module: Option<IsModule>,

    #[serde(rename = "$schema")]
    pub schema: Option<String>,
}

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

    #[serde(default)]
    pub module: bool,

    #[serde(default)]
    pub safari10: bool,

    #[serde(default = "true_by_default")]
    pub toplevel: bool,

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

fn default_comments() -> BoolOrDataConfig<JsMinifyCommentOption> {
    BoolOrDataConfig::from_obj(JsMinifyCommentOption::PreserveSomeComments)
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

            if file.extension() == Some("tsx".as_ref()) {
                *tsx = true;
            } else if file.extension() == Some("ts".as_ref()) {
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
#[non_exhaustive]
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
    pub preserve_comments: BoolOr<JsMinifyCommentOption>,

    pub inline_sources_content: bool,
    pub emit_source_map_columns: bool,

    pub output: JscOutputConfig,
    pub emit_assert_for_import_attributes: bool,
}

impl<P> BuiltInput<P>
where
    P: swc_ecma_visit::Fold,
{
    pub fn with_pass<N>(self, map: impl FnOnce(P) -> N) -> BuiltInput<N>
    where
        N: swc_ecma_visit::Fold,
    {
        BuiltInput {
            program: self.program,
            pass: map(self.pass),
            syntax: self.syntax,
            target: self.target,
            minify: self.minify,
            external_helpers: self.external_helpers,
            source_maps: self.source_maps,
            input_source_map: self.input_source_map,
            is_module: self.is_module,
            output_path: self.output_path,
            source_file_name: self.source_file_name,
            preserve_comments: self.preserve_comments,
            inline_sources_content: self.inline_sources_content,
            comments: self.comments,
            emit_source_map_columns: self.emit_source_map_columns,
            output: self.output,
            emit_assert_for_import_attributes: self.emit_assert_for_import_attributes,
        }
    }
}

/// `jsc` in  `.swcrc`.
#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscConfig {
    #[serde(default)]
    pub assumptions: Option<Assumptions>,

    #[serde(rename = "parser", default)]
    pub syntax: Option<Syntax>,

    #[serde(default)]
    pub transform: MergingOption<TransformConfig>,

    #[serde(default)]
    pub external_helpers: BoolConfig<false>,

    #[serde(default)]
    pub target: Option<EsVersion>,

    #[serde(default)]
    pub loose: BoolConfig<false>,

    #[serde(default)]
    pub keep_class_names: BoolConfig<false>,

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
    pub preserve_all_comments: BoolConfig<false>,

    #[serde(default)]
    pub output: JscOutputConfig,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscOutputConfig {
    #[serde(default)]
    pub charset: Option<OutputCharset>,

    #[serde(default)]
    pub preamble: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub enum OutputCharset {
    #[serde(rename = "utf8")]
    Utf8,
    #[serde(rename = "ascii")]
    Ascii,
}

impl Default for OutputCharset {
    fn default() -> Self {
        OutputCharset::Utf8
    }
}

/// `jsc.experimental` in `.swcrc`
#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscExperimental {
    /// This requires cargo feature `plugin`.
    #[serde(default)]
    pub plugins: Option<Vec<PluginConfig>>,
    /// If true, keeps import assertions in the output.
    #[serde(default, alias = "keepImportAssertions")]
    pub keep_import_attributes: BoolConfig<false>,

    #[serde(default)]
    pub emit_assert_for_import_attributes: BoolConfig<false>,
    /// Location where swc may stores its intermediate cache.
    /// Currently this is only being used for wasm plugin's bytecache.
    /// Path should be absolute directory, which will be created if not exist.
    /// This configuration behavior can change anytime under experimental flag
    /// and will not be considered as breaking changes.
    #[serde(default)]
    pub cache_root: Option<String>,

    #[serde(default)]
    pub disable_builtin_transforms_for_internal_testing: BoolConfig<false>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ErrorFormat {
    #[serde(rename = "json")]
    Json,
    #[serde(rename = "normal")]
    Normal,
}

impl ErrorFormat {
    pub fn format(&self, err: &Error) -> String {
        match self {
            ErrorFormat::Normal => format!("{:?}", err),
            ErrorFormat::Json => {
                let mut map = serde_json::Map::new();

                map.insert("message".into(), serde_json::Value::String(err.to_string()));

                map.insert(
                    "stack".into(),
                    serde_json::Value::Array(
                        err.chain()
                            .skip(1)
                            .map(|err| err.to_string())
                            .map(serde_json::Value::String)
                            .collect(),
                    ),
                );

                serde_json::to_string(&map).unwrap()
            }
        }
    }
}

impl Default for ErrorFormat {
    fn default() -> Self {
        Self::Normal
    }
}

/// `paths` section of `tsconfig.json`.
pub type Paths = IndexMap<String, Vec<String>, ARandomState>;
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
    Es6(EsModuleConfig),
    #[serde(rename = "nodenext")]
    NodeNext(EsModuleConfig),
}

impl ModuleConfig {
    pub fn build<'cmt>(
        cm: Arc<SourceMap>,
        comments: Option<&'cmt dyn Comments>,
        base_url: PathBuf,
        paths: CompiledPaths,
        base: &FileName,
        unresolved_mark: Mark,
        config: Option<ModuleConfig>,
        available_features: FeatureFlag,
    ) -> Box<dyn swc_ecma_visit::Fold + 'cmt> {
        let skip_resolver = base_url.as_os_str().is_empty() && paths.is_empty();

        let base = match base {
            FileName::Real(v) if !skip_resolver => {
                FileName::Real(v.canonicalize().unwrap_or_else(|_| v.to_path_buf()))
            }
            _ => base.clone(),
        };

        match config {
            None => {
                if skip_resolver {
                    Box::new(noop())
                } else {
                    let resolver = build_resolver(base_url, paths, false);

                    Box::new(import_rewriter(base, resolver))
                }
            }
            Some(ModuleConfig::Es6(config)) | Some(ModuleConfig::NodeNext(config)) => {
                if skip_resolver {
                    Box::new(noop())
                } else {
                    let resolver = build_resolver(base_url, paths, config.resolve_fully);

                    Box::new(import_rewriter(base, resolver))
                }
            }
            Some(ModuleConfig::CommonJs(config)) => {
                if skip_resolver {
                    Box::new(modules::common_js::common_js(
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                } else {
                    let resolver = build_resolver(base_url, paths, config.resolve_fully);
                    Box::new(modules::common_js::common_js_with_resolver(
                        resolver,
                        base,
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                }
            }
            Some(ModuleConfig::Umd(config)) => {
                if skip_resolver {
                    Box::new(modules::umd::umd(
                        cm,
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                } else {
                    let resolver = build_resolver(base_url, paths, config.config.resolve_fully);

                    Box::new(modules::umd::umd_with_resolver(
                        cm,
                        resolver,
                        base,
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                }
            }
            Some(ModuleConfig::Amd(config)) => {
                if skip_resolver {
                    Box::new(modules::amd::amd(
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                } else {
                    let resolver = build_resolver(base_url, paths, config.config.resolve_fully);

                    Box::new(modules::amd::amd_with_resolver(
                        resolver,
                        base,
                        unresolved_mark,
                        config,
                        available_features,
                        comments,
                    ))
                }
            }
            Some(ModuleConfig::SystemJs(config)) => {
                if skip_resolver {
                    Box::new(modules::system_js::system_js(unresolved_mark, config))
                } else {
                    let resolver = build_resolver(base_url, paths, config.resolve_fully);

                    Box::new(modules::system_js::system_js_with_resolver(
                        resolver,
                        base,
                        unresolved_mark,
                        config,
                    ))
                }
            }
        }
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TransformConfig {
    #[serde(default)]
    pub react: react::Options,

    #[serde(default)]
    pub const_modules: Option<ConstModulesConfig>,

    #[serde(default)]
    pub optimizer: Option<OptimizerConfig>,

    #[serde(default)]
    pub legacy_decorator: BoolConfig<false>,

    #[serde(default)]
    pub decorator_metadata: BoolConfig<false>,

    #[serde(default)]
    pub hidden: HiddenTransformConfig,

    #[serde(default)]
    pub regenerator: regenerator::Config,

    #[serde(default)]
    #[deprecated]
    pub treat_const_enum_as_enum: BoolConfig<false>,

    /// https://www.typescriptlang.org/tsconfig#useDefineForClassFields
    #[serde(default)]
    pub use_define_for_class_fields: BoolConfig<true>,

    /// https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax
    #[serde(default)]
    pub verbatim_module_syntax: BoolConfig<false>,

    #[serde(default)]
    pub decorator_version: Option<DecoratorVersion>,
}

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub enum DecoratorVersion {
    #[default]
    #[serde(rename = "2021-12")]
    V202112,

    #[serde(rename = "2022-03")]
    V202203,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct HiddenTransformConfig {
    #[serde(default)]
    pub jest: BoolConfig<false>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ConstModulesConfig {
    #[serde(default)]
    pub globals: FxHashMap<JsWord, FxHashMap<JsWord, String>>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct OptimizerConfig {
    #[serde(default)]
    pub globals: Option<GlobalPassOption>,

    #[serde(default)]
    pub simplify: Option<SimplifyOption>,

    #[serde(default)]
    pub jsonify: Option<JsonifyOption>,
}

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SimplifyOption {
    Bool(bool),
    Json(SimplifyJsonOption),
}

impl Default for SimplifyOption {
    fn default() -> Self {
        SimplifyOption::Bool(true)
    }
}

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct SimplifyJsonOption {
    #[serde(default = "default_preserve_imports_with_side_effects")]
    pub preserve_imports_with_side_effects: bool,
}

fn default_preserve_imports_with_side_effects() -> bool {
    true
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

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ErrorConfig {
    pub filename: BoolConfig<true>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct GlobalPassOption {
    #[serde(default)]
    pub vars: IndexMap<JsWord, JsWord, ARandomState>,
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
                    static CACHE: Lazy<DashMap<Vec<String>, ValuesMap, ARandomState>> =
                        Lazy::new(Default::default);

                    let cache_key = env_list.iter().cloned().collect::<Vec<_>>();
                    if let Some(v) = CACHE.get(&cache_key).as_deref().cloned() {
                        v
                    } else {
                        let map = mk_map(
                            cm,
                            handler,
                            env::vars()
                                .filter(|(k, _)| env_list.contains(k))
                                .map(|(k, v)| (k.into(), v.into())),
                            true,
                        );
                        CACHE.insert(cache_key, map.clone());
                        map
                    }
                }

                GlobalInliningPassEnvs::Map(map) => {
                    static CACHE: Lazy<DashMap<Vec<(JsWord, JsWord)>, ValuesMap, ARandomState>> =
                        Lazy::new(Default::default);

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
            static CACHE: Lazy<DashMap<Vec<(JsWord, JsWord)>, GlobalExprMap, ARandomState>> =
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
                            NodeIgnoringSpan::owned(*expr(cm, handler, k.to_string())),
                            *expr(cm, handler, v.to_string()),
                        )
                    })
                    .collect::<AHashMap<_, _>>();
                let map = Arc::new(map);
                CACHE.insert(cache_key, map.clone());
                map
            }
        };

        let global_map = {
            static CACHE: Lazy<DashMap<Vec<(JsWord, JsWord)>, ValuesMap, ARandomState>> =
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

fn build_resolver(
    mut base_url: PathBuf,
    paths: CompiledPaths,
    resolve_fully: bool,
) -> Box<SwcImportResolver> {
    static CACHE: Lazy<DashMap<(PathBuf, CompiledPaths, bool), SwcImportResolver, ARandomState>> =
        Lazy::new(Default::default);

    // On Windows, we need to normalize path as UNC path.
    if cfg!(target_os = "windows") {
        base_url = base_url
            .canonicalize()
            .with_context(|| {
                format!(
                    "failed to canonicalize jsc.baseUrl(`{}`)\nThis is required on Windows \
                     because of UNC path.",
                    base_url.display()
                )
            })
            .unwrap();
    }

    if let Some(cached) = CACHE.get(&(base_url.clone(), paths.clone(), resolve_fully)) {
        return Box::new((*cached).clone());
    }

    let r = {
        let r = TsConfigResolver::new(
            NodeModulesResolver::without_node_modules(Default::default(), Default::default(), true),
            base_url.clone(),
            paths.clone(),
        );
        let r = CachingResolver::new(40, r);

        let r = NodeImportResolver::with_config(
            r,
            swc_ecma_transforms::modules::path::Config {
                base_dir: Some(base_url.clone()),
                resolve_fully,
            },
        );
        Arc::new(r)
    };

    CACHE.insert((base_url, paths, resolve_fully), r.clone());

    Box::new(r)
}
