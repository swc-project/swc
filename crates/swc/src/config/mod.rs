use std::{
    collections::HashMap,
    env,
    path::{Path, PathBuf},
    sync::Arc,
};

#[cfg(feature = "module")]
use anyhow::Context;
use anyhow::{bail, Error};
use bytes_str::BytesStr;
use dashmap::DashMap;
use indexmap::IndexMap;
use once_cell::sync::Lazy;
use rustc_hash::{FxBuildHasher, FxHashMap, FxHashSet};
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::{errors::Handler, FileName, Mark, SourceMap};
#[cfg(feature = "react-compiler")]
use swc_common::{BytePos, Span};
pub use swc_compiler_base::SourceMapsConfig;
pub use swc_config::is_module::IsModule;
#[cfg(feature = "react-compiler")]
use swc_config::types::BoolOr;
use swc_config::{
    file_pattern::FilePattern,
    merge::Merge,
    types::{BoolConfig, BoolOrDataConfig, MergingOption},
};
use swc_ecma_ast::{EsVersion, Expr, Pass};
#[cfg(feature = "lint")]
use swc_ecma_lints::config::LintConfig;
#[cfg(feature = "module")]
use swc_ecma_loader::resolvers::{
    lru::CachingResolver, node::NodeModulesResolver, tsc::TsConfigResolver,
};
pub use swc_ecma_minifier::js::*;
use swc_ecma_parser::{parse_file_as_expr, Syntax, TsSyntax};
pub use swc_ecma_transforms::proposals::DecoratorVersion;
use swc_ecma_transforms::{react, Assumptions};
use swc_ecma_transforms_compat::es2015::regenerator;
#[cfg(feature = "module")]
use swc_ecma_transforms_module::{
    self as modules,
    path::{ImportResolver, NodeImportResolver},
    util, EsModuleConfig,
};
use swc_ecma_transforms_optimization::{inline_globals, GlobalExprMap};
use swc_ecma_utils::NodeIgnoringSpan;

pub use crate::plugin::PluginConfig;

mod legacy;
mod loader;

pub use legacy::BuiltInput;

#[cfg(feature = "module")]
type SwcImportResolver = Arc<
    NodeImportResolver<CachingResolver<TsConfigResolver<CachingResolver<NodeModulesResolver>>>>,
>;

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
    fs_cache_store_root: Option<&str>,
) {
    PLUGIN_MODULE_CACHE.inner.get_or_init(|| {
        parking_lot::Mutex::new(swc_plugin_runner::cache::PluginModuleCache::create_inner(
            enable_fs_cache_store,
            fs_cache_store_root,
        ))
    });
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

    #[cfg(not(all(target_arch = "wasm32", not(target_os = "wasi"))))]
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

    #[cfg(not(all(target_arch = "wasm32", not(target_os = "wasi"))))]
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

    #[serde(skip, default)]
    pub runtime_options: RuntimeOptions,
}

#[derive(Clone, Debug)]
pub struct RuntimeOptions {
    #[cfg(feature = "plugin")]
    pub(crate) plugin_runtime: Option<Arc<dyn swc_plugin_runner::runtime::Runtime>>,
}

impl RuntimeOptions {
    #[cfg(feature = "plugin")]
    pub fn plugin_runtime(
        mut self,
        plugin_runtime: Arc<dyn swc_plugin_runner::runtime::Runtime>,
    ) -> Self {
        self.plugin_runtime = Some(plugin_runtime);
        self
    }
}

#[allow(clippy::derivable_impls)]
impl Default for RuntimeOptions {
    fn default() -> Self {
        RuntimeOptions {
            #[cfg(all(feature = "plugin", feature = "plugin_backend_wasmer"))]
            plugin_runtime: Some(Arc::new(swc_plugin_backend_wasmer::WasmerRuntime)),
            #[cfg(all(feature = "plugin", not(feature = "plugin_backend_wasmer")))]
            plugin_runtime: None,
        }
    }
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

#[derive(Debug, Clone, Serialize, Deserialize)]
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Default)]
pub enum RootMode {
    #[default]
    #[serde(rename = "root")]
    Root,
    #[serde(rename = "upward")]
    Upward,
    #[serde(rename = "upward-optional")]
    UpwardOptional,
}

pub const fn default_swcrc() -> bool {
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

#[cfg(not(all(target_arch = "wasm32", not(target_os = "wasi"))))]
fn default_cwd() -> PathBuf {
    static CWD: Lazy<PathBuf> = Lazy::new(|| ::std::env::current_dir().unwrap());

    CWD.clone()
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
                exclude: Some(FileMatcher::Pattern(FilePattern::Regex("\\.tsx?$".into()))),
                jsc: JscConfig {
                    syntax: Some(Default::default()),
                    ..Default::default()
                },
                ..Default::default()
            },
            Config {
                env: None,
                test: Some(FileMatcher::Pattern(FilePattern::Regex("\\.tsx$".into()))),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    })),
                    ..Default::default()
                },
                ..Default::default()
            },
            Config {
                env: None,
                test: Some(FileMatcher::Pattern(FilePattern::Regex(
                    "\\.(cts|mts)$".into(),
                ))),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
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
                test: Some(FileMatcher::Pattern(FilePattern::Regex("\\.ts$".into()))),
                exclude: None,
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
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
    pub source_map_ignore_list: Option<FilePattern>,

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

impl Config {
    /// Adjust config for `file`.
    ///
    ///
    ///
    /// - typescript: `tsx` will be modified if file extension is `ts`.
    pub fn adjust(&mut self, file: &Path) {
        if let Some(Syntax::Typescript(TsSyntax { tsx, dts, .. })) = &mut self.jsc.syntax {
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

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(untagged)]
pub enum FileMatcher {
    #[default]
    None,
    Pattern(FilePattern),
    Multi(Vec<FileMatcher>),
}

impl FileMatcher {
    pub fn matches(&self, filename: &Path) -> Result<bool, Error> {
        match self {
            FileMatcher::None => Ok(false),

            FileMatcher::Pattern(re) => {
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
    #[cfg(feature = "lint")]
    pub lints: LintConfig,

    #[serde(default)]
    pub preserve_all_comments: BoolConfig<false>,

    #[serde(default)]
    pub output: JscOutputConfig,

    /// <https://www.typescriptlang.org/tsconfig/#rewriteRelativeImportExtensions>
    #[serde(default)]
    pub rewrite_relative_import_extensions: BoolConfig<false>,

    /// When `true`, symlinked paths are preserved in generated module
    /// specifiers instead of being canonicalized to their real paths.
    ///
    /// This is the config-level analogue of Node's `--preserve-symlinks`.
    /// Enable it when your project relies on symlinked source files (for
    /// example, a monorepo that symlinks shared sources into each package)
    /// and you want relative imports inside those files to continue to
    /// resolve against their symlinked location rather than the real path.
    #[serde(default)]
    pub preserve_symlinks: BoolConfig<false>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscOutputConfig {
    #[serde(default)]
    pub charset: Option<OutputCharset>,

    #[serde(default)]
    pub preamble: String,

    #[serde(default)]
    pub preserve_annotations: BoolConfig<false>,

    #[serde(default)]
    pub source_map_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub enum OutputCharset {
    #[default]
    #[serde(rename = "utf8")]
    Utf8,
    #[serde(rename = "ascii")]
    Ascii,
}

/// `jsc.experimental` in `.swcrc`
#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct JscExperimental {
    /// This requires cargo feature `plugin`.
    #[serde(default)]
    pub plugins: Option<Vec<PluginConfig>>,
    #[serde(default)]
    pub plugin_env_vars: Option<Vec<Atom>>,
    /// If true, keeps import attributes in the output.
    #[serde(default, alias = "keepImportAssertions")]
    pub keep_import_attributes: BoolConfig<false>,

    #[serde(default)]
    pub emit_assert_for_import_attributes: BoolConfig<false>,

    #[serde(default)]
    pub emit_source_map_scopes: BoolConfig<false>,
    /// Location where swc may stores its intermediate cache.
    /// Currently this is only being used for wasm plugin's bytecache.
    /// Path should be absolute directory, which will be created if not exist.
    /// This configuration behavior can change anytime under experimental flag
    /// and will not be considered as breaking changes.
    #[serde(default)]
    pub cache_root: Option<String>,

    #[serde(default)]
    pub run_plugin_first: BoolConfig<false>,

    #[serde(default)]
    pub disable_builtin_transforms_for_internal_testing: BoolConfig<false>,

    /// Emit TypeScript definitions for `.ts`, `.tsx` files.
    ///
    /// This requires `isolatedDeclartion` feature of TypeScript 5.5.
    #[serde(default)]
    pub emit_isolated_dts: BoolConfig<false>,

    #[serde(default)]
    pub disable_all_lints: BoolConfig<true>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, Default)]
pub enum ErrorFormat {
    #[serde(rename = "json")]
    Json,
    #[serde(rename = "normal")]
    #[default]
    Normal,
}

impl ErrorFormat {
    pub fn format(&self, err: &Error) -> String {
        match self {
            ErrorFormat::Normal => format!("{err:?}"),
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

/// `paths` section of `tsconfig.json`.
pub type Paths = IndexMap<String, Vec<String>, FxBuildHasher>;
pub(crate) type CompiledPaths = Vec<(String, Vec<String>)>;

#[cfg(feature = "module")]
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

/// Stub enum when module feature is disabled.
/// Config will still deserialize but transforms won't run.
#[cfg(not(feature = "module"))]
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
#[serde(tag = "type")]
pub enum ModuleConfig {
    #[serde(rename = "commonjs")]
    CommonJs(serde_json::Value),
    #[serde(rename = "umd")]
    Umd(serde_json::Value),
    #[serde(rename = "amd")]
    Amd(serde_json::Value),
    #[serde(rename = "systemjs")]
    SystemJs(serde_json::Value),
    #[serde(rename = "es6")]
    Es6(serde_json::Value),
    #[serde(rename = "nodenext")]
    NodeNext(serde_json::Value),
}

#[cfg(feature = "module")]
impl ModuleConfig {
    pub fn get_resolver(
        base_url: &Path,
        paths: CompiledPaths,
        base: &FileName,
        config: Option<&ModuleConfig>,
        preserve_symlinks: bool,
    ) -> Option<(FileName, Arc<dyn ImportResolver>)> {
        let skip_resolver = base_url.as_os_str().is_empty() && paths.is_empty();

        if skip_resolver {
            return None;
        }

        let base = match base {
            FileName::Real(v) if !skip_resolver && !preserve_symlinks => {
                FileName::Real(v.canonicalize().unwrap_or_else(|_| v.to_path_buf()))
            }
            _ => base.clone(),
        };

        let base_url = base_url.to_path_buf();
        let resolver = match config {
            None => build_resolver(
                base_url,
                paths,
                false,
                &util::Config::default_js_ext(),
                preserve_symlinks,
            ),
            Some(ModuleConfig::Es6(config)) | Some(ModuleConfig::NodeNext(config)) => {
                build_resolver(
                    base_url,
                    paths,
                    config.config.resolve_fully,
                    &config.config.out_file_extension,
                    preserve_symlinks,
                )
            }
            Some(ModuleConfig::CommonJs(config)) => build_resolver(
                base_url,
                paths,
                config.resolve_fully,
                &config.out_file_extension,
                preserve_symlinks,
            ),
            Some(ModuleConfig::Umd(config)) => build_resolver(
                base_url,
                paths,
                config.config.resolve_fully,
                &config.config.out_file_extension,
                preserve_symlinks,
            ),
            Some(ModuleConfig::Amd(config)) => build_resolver(
                base_url,
                paths,
                config.config.resolve_fully,
                &config.config.out_file_extension,
                preserve_symlinks,
            ),
            Some(ModuleConfig::SystemJs(config)) => build_resolver(
                base_url,
                paths,
                config.resolve_fully,
                &config.out_file_extension,
                preserve_symlinks,
            ),
        };

        Some((base, resolver))
    }
}

/// Stub impl when module feature is disabled
#[cfg(not(feature = "module"))]
impl ModuleConfig {
    /// Returns None when module feature is disabled.
    #[allow(clippy::type_complexity)]
    pub fn get_resolver(
        _base_url: &Path,
        _paths: CompiledPaths,
        _base: &FileName,
        _config: Option<&ModuleConfig>,
        _preserve_symlinks: bool,
    ) -> Option<(FileName, Arc<dyn swc_ecma_loader::resolve::Resolve>)> {
        None
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TransformConfig {
    #[serde(default)]
    pub react: react::Options,

    #[serde(default)]
    pub react_compiler: BoolOrDataConfig<ReactCompilerConfig>,

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

    /// <https://www.typescriptlang.org/tsconfig#useDefineForClassFields>
    #[serde(default)]
    pub use_define_for_class_fields: BoolConfig<true>,

    /// <https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax>
    #[serde(default)]
    pub verbatim_module_syntax: BoolConfig<false>,

    #[serde(default)]
    pub decorator_version: Option<DecoratorVersion>,

    #[serde(default)]
    pub ts_enum_is_mutable: BoolConfig<false>,
}

/// Public `.swcrc` configuration for React Compiler.
///
/// This intentionally mirrors only a curated subset of upstream
/// `PluginOptions`. The nested `environment` object likewise exposes only a
/// curated subset of the compiler's environment configuration.
#[derive(Debug, Default, Clone, Serialize, Deserialize, Merge)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ReactCompilerConfig {
    #[serde(default)]
    pub compilation_mode: Option<ReactCompilerCompilationMode>,

    #[serde(default)]
    pub panic_threshold: Option<ReactCompilerPanicThreshold>,

    #[serde(default)]
    pub target: Option<ReactCompilerTarget>,

    #[serde(default)]
    pub no_emit: Option<bool>,

    #[serde(default)]
    pub output_mode: Option<ReactCompilerOutputMode>,

    #[serde(default)]
    pub ignore_use_no_forget: Option<bool>,

    #[serde(default)]
    pub flow_suppressions: Option<bool>,

    #[serde(default)]
    pub enable_reanimated: Option<bool>,

    #[serde(default)]
    pub is_dev: Option<bool>,

    #[serde(default)]
    pub eslint_suppression_rules: Option<Vec<String>>,

    #[serde(default)]
    pub custom_opt_out_directives: Option<Vec<String>>,

    #[serde(default)]
    pub gating: Option<ReactCompilerGatingConfig>,

    #[serde(default)]
    pub dynamic_gating: Option<ReactCompilerDynamicGatingConfig>,

    #[serde(default)]
    pub environment: Option<ReactCompilerEnvironmentConfig>,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerConfig {
    fn into_plugin_options(
        self,
        filename: Option<String>,
    ) -> swc_ecma_react_compiler::PluginOptions {
        let mut options = swc_ecma_react_compiler::default_plugin_options();
        options.filename = filename;

        if let Some(compilation_mode) = self.compilation_mode {
            options.compilation_mode = compilation_mode.as_str().into();
        }
        if let Some(panic_threshold) = self.panic_threshold {
            options.panic_threshold = panic_threshold.as_str().into();
        }
        if let Some(target) = self.target {
            options.target =
                swc_ecma_react_compiler::CompilerTarget::Version(target.as_str().into());
        }
        if let Some(no_emit) = self.no_emit {
            options.no_emit = no_emit;
        }
        if let Some(output_mode) = self.output_mode {
            options.output_mode = Some(output_mode.as_str().into());
        }
        if let Some(ignore_use_no_forget) = self.ignore_use_no_forget {
            options.ignore_use_no_forget = ignore_use_no_forget;
        }
        if let Some(flow_suppressions) = self.flow_suppressions {
            options.flow_suppressions = flow_suppressions;
        }
        if let Some(enable_reanimated) = self.enable_reanimated {
            options.enable_reanimated = enable_reanimated;
        }
        if let Some(is_dev) = self.is_dev {
            options.is_dev = is_dev;
        }
        if self.eslint_suppression_rules.is_some() {
            options.eslint_suppression_rules = self.eslint_suppression_rules;
        }
        if self.custom_opt_out_directives.is_some() {
            options.custom_opt_out_directives = self.custom_opt_out_directives;
        }
        if let Some(gating) = self.gating {
            options.gating = Some(gating.into());
        }
        if let Some(dynamic_gating) = self.dynamic_gating {
            options.dynamic_gating = Some(dynamic_gating.into());
        }
        if let Some(environment) = self.environment {
            environment.apply_to(&mut options);
        }

        options
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ReactCompilerCompilationMode {
    #[serde(rename = "infer")]
    Infer,
    #[serde(rename = "syntax")]
    Syntax,
    #[serde(rename = "annotation")]
    Annotation,
    #[serde(rename = "all")]
    All,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerCompilationMode {
    fn as_str(self) -> &'static str {
        match self {
            Self::Infer => "infer",
            Self::Syntax => "syntax",
            Self::Annotation => "annotation",
            Self::All => "all",
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ReactCompilerPanicThreshold {
    #[serde(rename = "none")]
    None,
    #[serde(rename = "critical_errors")]
    CriticalErrors,
    #[serde(rename = "all_errors")]
    AllErrors,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerPanicThreshold {
    fn as_str(self) -> &'static str {
        match self {
            Self::None => "none",
            Self::CriticalErrors => "critical_errors",
            Self::AllErrors => "all_errors",
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ReactCompilerTarget {
    #[serde(rename = "17")]
    React17,
    #[serde(rename = "18")]
    React18,
    #[serde(rename = "19")]
    React19,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerTarget {
    fn as_str(self) -> &'static str {
        match self {
            Self::React17 => "17",
            Self::React18 => "18",
            Self::React19 => "19",
        }
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum ReactCompilerOutputMode {
    #[serde(rename = "client")]
    Client,
    #[serde(rename = "ssr")]
    Ssr,
    #[serde(rename = "lint")]
    Lint,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerOutputMode {
    fn as_str(self) -> &'static str {
        match self {
            Self::Client => "client",
            Self::Ssr => "ssr",
            Self::Lint => "lint",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ReactCompilerGatingConfig {
    pub source: String,
    pub import_specifier_name: String,
}

#[cfg(feature = "react-compiler")]
impl From<ReactCompilerGatingConfig> for swc_ecma_react_compiler::GatingConfig {
    fn from(config: ReactCompilerGatingConfig) -> Self {
        Self {
            source: config.source,
            import_specifier_name: config.import_specifier_name,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ReactCompilerDynamicGatingConfig {
    pub source: String,
}

#[cfg(feature = "react-compiler")]
impl From<ReactCompilerDynamicGatingConfig> for swc_ecma_react_compiler::DynamicGatingConfig {
    fn from(config: ReactCompilerDynamicGatingConfig) -> Self {
        Self {
            source: config.source,
        }
    }
}

/// Curated subset of the React Compiler `environment` options exposed through
/// the SWC config, mirroring Babel's `reactCompiler.environment` object.
///
/// Only fields wired end-to-end into the compiler are exposed here. A field
/// left unset (`None`) leaves the compiler default untouched, so a partial
/// object such as `{ "enableFunctionOutlining": false }` overrides only that
/// setting.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ReactCompilerEnvironmentConfig {
    /// Extract anonymous functions that do not close over local variables into
    /// top-level helper functions. Maps to the compiler's
    /// `environment.enable_function_outlining` (default `true`).
    #[serde(default)]
    pub enable_function_outlining: Option<bool>,
}

#[cfg(feature = "react-compiler")]
impl ReactCompilerEnvironmentConfig {
    /// Apply the set (`Some`) overrides onto the compiler options' environment,
    /// leaving unset fields at their existing (default) values.
    ///
    /// This mutates the public `environment` field in place rather than naming
    /// the upstream `EnvironmentConfig` type, so the config layer does not
    /// require that type to be re-exported.
    fn apply_to(self, options: &mut swc_ecma_react_compiler::PluginOptions) {
        if let Some(enable_function_outlining) = self.enable_function_outlining {
            options.environment.enable_function_outlining = enable_function_outlining;
        }
    }
}

#[cfg(feature = "react-compiler")]
pub(crate) fn react_compiler_options(
    config: BoolOrDataConfig<ReactCompilerConfig>,
    base: &FileName,
) -> Option<swc_ecma_react_compiler::PluginOptions> {
    let filename = Some(base.to_string());

    match config.into_inner()? {
        BoolOr::Bool(true) => {
            let mut options = swc_ecma_react_compiler::default_plugin_options();
            options.filename = filename;
            Some(options)
        }
        BoolOr::Data(config) => Some(config.into_plugin_options(filename)),
        BoolOr::Bool(false) => None,
    }
}

#[cfg(feature = "react-compiler")]
pub(crate) fn emit_react_compiler_diagnostics(
    handler: &Handler,
    diagnostics: &[swc_ecma_react_compiler::diagnostics::DiagnosticMessage],
) {
    for diagnostic in diagnostics {
        let span = diagnostic
            .span
            .map(|(lo, hi)| Span::new(BytePos(lo), BytePos(hi)));

        match (&diagnostic.severity, span) {
            (swc_ecma_react_compiler::diagnostics::Severity::Error, Some(span)) => {
                handler.struct_span_err(span, &diagnostic.message).emit()
            }
            (swc_ecma_react_compiler::diagnostics::Severity::Error, None) => {
                handler.struct_err(&diagnostic.message).emit()
            }
            (swc_ecma_react_compiler::diagnostics::Severity::Warning, Some(span)) => {
                handler.struct_span_warn(span, &diagnostic.message).emit()
            }
            (swc_ecma_react_compiler::diagnostics::Severity::Warning, None) => {
                handler.struct_warn(&diagnostic.message).emit()
            }
        }
    }
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
    pub globals: FxHashMap<Atom, FxHashMap<Atom, BytesStr>>,
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
    pub vars: IndexMap<Atom, Atom, FxBuildHasher>,
    #[serde(default)]
    pub envs: GlobalInliningPassEnvs,

    #[serde(default)]
    pub typeofs: FxHashMap<Atom, Atom>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum GlobalInliningPassEnvs {
    List(FxHashSet<String>),
    Map(FxHashMap<Atom, Atom>),
}

impl Default for GlobalInliningPassEnvs {
    fn default() -> Self {
        GlobalInliningPassEnvs::List(Default::default())
    }
}

impl GlobalPassOption {
    pub fn build(self, cm: &SourceMap, handler: &Handler) -> impl 'static + Pass {
        type ValuesMap = Arc<FxHashMap<Atom, Expr>>;

        fn expr(cm: &SourceMap, handler: &Handler, src: String) -> Box<Expr> {
            let fm = cm.new_source_file(FileName::Anon.into(), src);

            let mut errors = Vec::new();
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
            values: impl Iterator<Item = (Atom, Atom)>,
            is_env: bool,
        ) -> ValuesMap {
            let mut m = HashMap::default();

            for (k, v) in values {
                let v = if is_env {
                    format!("'{v}'")
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
                    static CACHE: Lazy<DashMap<Vec<String>, ValuesMap, FxBuildHasher>> =
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
                    static CACHE: Lazy<DashMap<Vec<(Atom, Atom)>, ValuesMap, FxBuildHasher>> =
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
            static CACHE: Lazy<DashMap<Vec<(Atom, Atom)>, GlobalExprMap, FxBuildHasher>> =
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
                    .collect::<FxHashMap<_, _>>();
                let map = Arc::new(map);
                CACHE.insert(cache_key, map.clone());
                map
            }
        };

        let global_map = {
            static CACHE: Lazy<DashMap<Vec<(Atom, Atom)>, ValuesMap, FxBuildHasher>> =
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

        inline_globals(env_map, global_map, global_exprs, Arc::new(self.typeofs))
    }
}

pub(crate) fn default_env_name() -> String {
    if let Ok(v) = env::var("SWC_ENV") {
        return v;
    }

    match env::var("NODE_ENV") {
        Ok(v) => v,
        Err(_) => "development".into(),
    }
}

#[cfg(feature = "module")]
fn build_resolver(
    mut base_url: PathBuf,
    paths: CompiledPaths,
    resolve_fully: bool,
    file_extension: &str,
    preserve_symlinks: bool,
) -> SwcImportResolver {
    static CACHE: Lazy<
        DashMap<(PathBuf, CompiledPaths, bool, String, bool), SwcImportResolver, FxBuildHasher>,
    > = Lazy::new(Default::default);

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

    if let Some(cached) = CACHE.get(&(
        base_url.clone(),
        paths.clone(),
        resolve_fully,
        file_extension.to_owned(),
        preserve_symlinks,
    )) {
        return cached.clone();
    }

    let r = {
        let r = NodeModulesResolver::without_node_modules(
            swc_ecma_loader::TargetEnv::Node,
            Default::default(),
            true,
        );

        let r = CachingResolver::new(1024, r);

        let r = TsConfigResolver::new(r, base_url.clone(), paths.clone());
        let r = CachingResolver::new(256, r);

        let cfg = modules::path::Config {
            base_dir: Some(base_url.clone()),
            resolve_fully,
            file_extension: file_extension.to_owned(),
        };
        let r = if preserve_symlinks {
            NodeImportResolver::with_config_preserving_symlinks(r, cfg)
        } else {
            NodeImportResolver::with_config(r, cfg)
        };
        Arc::new(r)
    };

    CACHE.insert(
        (
            base_url,
            paths,
            resolve_fully,
            file_extension.to_owned(),
            preserve_symlinks,
        ),
        r.clone(),
    );

    r
}
