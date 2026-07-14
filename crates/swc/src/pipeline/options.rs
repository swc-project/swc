#[cfg(feature = "plugin")]
use std::sync::Arc;

use anyhow::{bail, Error};
use swc_common::{FileName, SourceFile};
use swc_compiler_base::SourceMapsConfig;
use swc_config::{
    merge::Merge,
    types::{BoolOr, BoolOrDataConfig},
};
use swc_ecma_minifier::option::terser::TerserTopLevelOptions;
use swc_ecma_transforms::{hygiene, typescript::TsImportExportAssignConfig};

#[cfg(feature = "lint")]
use super::lint::LintOptions;
use super::{
    finalize::{BuiltinFinalizeOptions, FinalizeStageOptions},
    minify::MinifyStageOptions,
    plugin::{PluginOptions, PluginPlacement},
    preparation::PreparationOptions,
    state::{CompilationUnit, PipelineContextData},
    terminal::{CodegenTerminalState, PipelineTerminal},
    transform::BuiltinTransformOptions,
    Pipeline,
};
use crate::{
    codegen::CodegenOptions,
    config::{
        Config, JsMinifyCommentOption, JsMinifyOptions, JscConfig, JscOutputConfig, ModuleConfig,
        Options, OutputCharset,
    },
};

/// Stage options resolved for one pipeline execution.
pub(super) struct ResolvedPipelineOptions<T> {
    pub(super) plugin: PluginOptions,
    #[cfg(feature = "lint")]
    pub(super) lint: Option<LintOptions>,
    pub(super) transform: Option<BuiltinTransformOptions>,
    pub(super) minify: Option<MinifyStageOptions>,
    pub(super) finalize: FinalizeStageOptions,
    pub(super) terminal: T,
}

/// Resolved configuration and hook context for one pipeline execution.
///
/// Program-dependent options are resolved after the resolver hook boundary,
/// so hook mutations affect the defaults used by later stages.
pub(super) struct PipelineConfig {
    pub(super) config: Config,
    pub(super) context: PipelineContextData,
    pub(super) inject_helpers: bool,
    pub(super) fixer_enabled: bool,
    pub(super) hygiene_enabled: bool,
    #[cfg(feature = "plugin")]
    pub(super) plugin_env_name: String,
    #[cfg(feature = "plugin")]
    pub(super) plugin_runtime: Option<Arc<dyn swc_plugin_runner::runtime::Runtime>>,
}

impl Pipeline<'_> {
    pub(super) fn resolve_config(
        &self,
        source_file: &SourceFile,
        options: &Options,
    ) -> Result<PipelineConfig, Error> {
        let base = source_file.name.clone();

        if let FileName::Real(path) = &*base {
            if !options.config.matches(path)? {
                bail!("cannot process file because it's ignored by .swcrc");
            }
        }

        let loaded_config = self.compiler.read_config(options, &base)?;
        let mut loaded_config = loaded_config
            .ok_or_else(|| Error::msg("cannot process file because it's ignored by .swcrc"))?;
        // Source-map ignore rules come from the loaded file config and retain
        // precedence over the caller's base config during emit.
        let source_map_ignore_list = loaded_config.source_map_ignore_list.take();

        let mut config = options.config.clone();
        config.merge(loaded_config);
        if let FileName::Real(path) = &*base {
            config.adjust(path);
        }
        config.source_map_ignore_list = source_map_ignore_list;

        if config.jsc.target.is_some() && config.env.is_some() {
            bail!("`env` and `jsc.target` cannot be used together");
        }

        let syntax = config.jsc.syntax.unwrap_or_default();
        let target = config.jsc.target.unwrap_or_default();
        let unresolved_mark = options.unresolved_mark.unwrap_or_default();
        let top_level_mark = options.top_level_mark.unwrap_or_default();

        Ok(PipelineConfig {
            config,
            context: PipelineContextData {
                syntax,
                target,
                unresolved_mark,
                top_level_mark,
            },
            inject_helpers: !options.skip_helper_injection,
            fixer_enabled: !options.disable_fixer,
            hygiene_enabled: !options.disable_hygiene,
            #[cfg(feature = "plugin")]
            plugin_env_name: options.env_name.clone(),
            #[cfg(feature = "plugin")]
            plugin_runtime: options.runtime_options.plugin_runtime.clone(),
        })
    }

    /// Resolves options that depend on the program at the after-resolve
    /// boundary.
    pub(super) fn resolve_pipeline_options<T>(
        &self,
        config: PipelineConfig,
        unit: &CompilationUnit,
        terminal: &T,
        options: &Options,
    ) -> Result<ResolvedPipelineOptions<T::State>, Error>
    where
        T: PipelineTerminal,
    {
        let PipelineConfig {
            config,
            context,
            inject_helpers,
            fixer_enabled,
            hygiene_enabled,
            #[cfg(feature = "plugin")]
            plugin_env_name,
            #[cfg(feature = "plugin")]
            plugin_runtime,
        } = config;
        let syntax = context.syntax;

        let JscConfig {
            assumptions,
            transform,
            syntax: _,
            external_helpers: _,
            target: _,
            loose,
            keep_class_names,
            base_url,
            paths,
            minify,
            experimental,
            #[cfg(feature = "lint")]
            lints,
            preserve_all_comments,
            output,
            rewrite_relative_import_extensions,
            preserve_symlinks,
        } = config.jsc;

        let loose = loose.into_bool();
        let preserve_all_comments = preserve_all_comments.into_bool();
        let preserve_symlinks = preserve_symlinks.into_bool();
        let keep_class_names = keep_class_names.into_bool();
        let mut assumptions = assumptions.unwrap_or_else(|| {
            if loose {
                swc_ecma_transforms::Assumptions::all()
            } else {
                swc_ecma_transforms::Assumptions::default()
            }
        });
        let mut transform = transform.into_inner().unwrap_or_default();
        if syntax.typescript() {
            assumptions.set_class_methods |= !transform.use_define_for_class_fields.into_bool();
            transform.legacy_decorator = true.into();
        }
        assumptions.set_public_class_fields |= !transform.use_define_for_class_fields.into_bool();

        let default_top_level = unit.program.is_module() && !unit.flow_strip_script_like_module;
        let ast_minify = resolve_minify_options(minify, default_top_level, config.module.as_ref());
        let is_mangler_enabled = ast_minify
            .as_ref()
            .is_some_and(|options| options.mangle.is_obj() || options.mangle.is_true());
        let codegen_minify = config.minify.into_bool();

        let import_export_assign_config = match config.module {
            Some(ModuleConfig::Es6(..)) => TsImportExportAssignConfig::EsNext,
            Some(ModuleConfig::CommonJs(..))
            | Some(ModuleConfig::Amd(..))
            | Some(ModuleConfig::Umd(..))
            | Some(ModuleConfig::SystemJs(..)) => TsImportExportAssignConfig::Preserve,
            Some(ModuleConfig::NodeNext(..)) => TsImportExportAssignConfig::NodeNext,
            _ => TsImportExportAssignConfig::Classic,
        };

        let (minify, mut minify_format) = match ast_minify {
            Some(JsMinifyOptions {
                compress,
                mangle,
                format,
                ..
            }) => (Some(MinifyStageOptions { compress, mangle }), Some(format)),
            None => (None, None),
        };
        let minify_comments = minify_format.as_mut().map(|format| {
            match std::mem::take(&mut format.comments).into_inner() {
                Some(value) => value,
                None => BoolOr::Bool(true),
            }
        });
        let preserve_comments = if preserve_all_comments {
            BoolOr::Bool(true)
        } else {
            minify_comments.unwrap_or({
                BoolOr::Data(if codegen_minify {
                    JsMinifyCommentOption::PreserveSomeComments
                } else {
                    JsMinifyCommentOption::PreserveAllComments
                })
            })
        };

        let JscOutputConfig {
            charset,
            preamble,
            preserve_annotations,
            source_map_url,
        } = output;

        #[cfg(feature = "module")]
        let module_resolver = {
            let paths: crate::config::CompiledPaths = paths.into_iter().collect();
            ModuleConfig::get_resolver(
                &base_url,
                paths,
                &unit.source_file.name,
                config.module.as_ref(),
                preserve_symlinks,
            )
        };
        #[cfg(not(feature = "module"))]
        let module_resolver = {
            let _ = (
                &base_url,
                paths,
                &unit.source_file.name,
                config.module.as_ref(),
                preserve_symlinks,
            );
        };

        let env = config.env.map(Into::into);
        let feature_config = env
            .as_ref()
            .map(|env: &swc_ecma_preset_env::EnvConfig| env.get_feature_config());
        let plugin_placement = if experimental.run_plugin_first.into_bool() {
            PluginPlacement::BeforeSyntax
        } else {
            PluginPlacement::AfterSyntax
        };
        let builtin_transforms_enabled = !experimental
            .disable_builtin_transforms_for_internal_testing
            .into_bool();
        let keep_import_attributes = experimental.keep_import_attributes.into_bool();
        #[cfg(feature = "lint")]
        let lints_enabled = !experimental.disable_all_lints.into_bool();
        let plugin = PluginOptions {
            placement: plugin_placement,
            plugins: experimental.plugins,
            #[cfg(feature = "plugin")]
            plugin_env_vars: experimental.plugin_env_vars,
            #[cfg(feature = "plugin")]
            cache_root: experimental.cache_root,
            #[cfg(feature = "plugin")]
            env_name: plugin_env_name,
            #[cfg(feature = "plugin")]
            runtime: plugin_runtime,
        };

        let terminal = terminal.resolve_state(|| {
            let mut source_maps = options.source_maps.clone();
            source_maps.merge(config.source_maps);
            let source_maps = source_maps.unwrap_or(SourceMapsConfig::Bool(false));
            let input_source_map = if source_maps.enabled() {
                Some(config.input_source_map.unwrap_or_default())
            } else {
                None
            };
            let emit_isolated_dts = experimental.emit_isolated_dts.into_bool();
            #[cfg(all(feature = "isolated-dts", feature = "module"))]
            let isolated_dts_module_resolver = if emit_isolated_dts {
                module_resolver.clone()
            } else {
                None
            };
            let preparation = PreparationOptions {
                input_source_map,
                emit_isolated_dts,
                #[cfg(all(feature = "isolated-dts", feature = "module"))]
                module_resolver: isolated_dts_module_resolver,
            };

            let (minify_ascii_only, codegen_inline_script, minify_preamble) = minify_format
                .map(|format| (format.ascii_only, format.inline_script, format.preamble))
                .unwrap_or_default();
            let mut preamble = preamble;
            if preamble.is_empty() {
                preamble = minify_preamble;
            }
            let ascii_only = match charset {
                Some(OutputCharset::Ascii) => true,
                Some(OutputCharset::Utf8) => false,
                None => minify_ascii_only,
            };
            let codegen = CodegenOptions {
                source_maps,
                output_path: options.output_path.clone(),
                source_root: options.source_root.clone(),
                source_file_name: options.source_file_name.clone(),
                source_map_ignore_list: config.source_map_ignore_list,
                inline_sources_content: config.inline_sources_content.into_bool(),
                emit_source_map_columns: config.emit_source_map_columns.into_bool(),
                preamble,
                source_map_url,
                ascii_only,
                minify: codegen_minify,
                emit_assert_for_import_attributes: experimental
                    .emit_assert_for_import_attributes
                    .into_bool(),
                emit_source_map_scopes: experimental.emit_source_map_scopes.into_bool(),
                inline_script: codegen_inline_script,
            };

            CodegenTerminalState {
                preparation,
                codegen,
                metadata: Default::default(),
            }
        });

        let run_jest = transform.hidden.jest.into_bool();
        #[cfg(feature = "lint")]
        let lint = if builtin_transforms_enabled && lints_enabled {
            Some(LintOptions { config: lints })
        } else {
            None
        };
        let transform = if builtin_transforms_enabled {
            Some(BuiltinTransformOptions {
                assumptions,
                loose,
                transform,
                env,
                feature_config,
                module: config.module,
                import_export_assign_config,
                rewrite_relative_import_extensions: rewrite_relative_import_extensions.into_bool(),
                module_resolver,
                inject_helpers,
                remove_parentheses: fixer_enabled,
                keep_import_attributes,
            })
        } else {
            None
        };

        let minify = if builtin_transforms_enabled {
            minify
        } else {
            None
        };
        let finalize_builtins = if builtin_transforms_enabled {
            Some(BuiltinFinalizeOptions {
                hygiene_config: if hygiene_enabled && !is_mangler_enabled {
                    Some(hygiene::Config {
                        keep_class_names,
                        ..hygiene::Config::hygiene_default()
                    })
                } else {
                    None
                },
                run_fixer: fixer_enabled,
                run_jest,
                preserve_dropped_comments: preserve_all_comments,
            })
        } else {
            None
        };
        let finalize = FinalizeStageOptions {
            builtins: finalize_builtins,
            preserve_comments,
            preserve_annotations: preserve_annotations.into_bool(),
        };
        Ok(ResolvedPipelineOptions {
            plugin,
            #[cfg(feature = "lint")]
            lint,
            transform,
            minify,
            finalize,
            terminal,
        })
    }
}

fn resolve_minify_options(
    minify: Option<JsMinifyOptions>,
    default_top_level: bool,
    module: Option<&ModuleConfig>,
) -> Option<JsMinifyOptions> {
    let mut minify = minify.map(|mut options| {
        let compress = options
            .compress
            .unwrap_as_option(|default| match default {
                Some(true) => Some(Default::default()),
                _ => None,
            })
            .map(|mut compress| {
                if compress.toplevel.is_none() {
                    compress.toplevel = Some(TerserTopLevelOptions::Bool(default_top_level));
                }
                if matches!(
                    module,
                    None | Some(ModuleConfig::Es6(..) | ModuleConfig::NodeNext(..))
                ) {
                    compress.module = true;
                }
                compress
            })
            .map(BoolOrDataConfig::from_obj)
            .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
        let mangle = options
            .mangle
            .unwrap_as_option(|default| match default {
                Some(true) => Some(Default::default()),
                _ => None,
            })
            .map(|mut mangle| {
                if mangle.top_level.is_none() {
                    mangle.top_level = Some(default_top_level);
                }
                mangle
            })
            .map(BoolOrDataConfig::from_obj)
            .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
        if options.toplevel.is_none() {
            options.toplevel = Some(default_top_level);
        }
        JsMinifyOptions {
            compress,
            mangle,
            ..options
        }
    });

    if minify.as_ref().is_some_and(|options| options.keep_fnames) {
        minify = minify.map(|options| {
            let compress = options
                .compress
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut compress| {
                    compress.keep_fnames = true;
                    compress
                })
                .map(BoolOrDataConfig::from_obj)
                .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
            let mangle = options
                .mangle
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut mangle| {
                    mangle.keep_fn_names = true;
                    mangle
                })
                .map(BoolOrDataConfig::from_obj)
                .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
            JsMinifyOptions {
                compress,
                mangle,
                ..options
            }
        });
    }

    if minify
        .as_ref()
        .is_some_and(|options| options.keep_classnames)
    {
        minify = minify.map(|options| {
            let compress = options
                .compress
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut compress| {
                    compress.keep_classnames = true;
                    compress
                })
                .map(BoolOrDataConfig::from_obj)
                .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
            let mangle = options
                .mangle
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut mangle| {
                    mangle.keep_class_names = true;
                    mangle
                })
                .map(BoolOrDataConfig::from_obj)
                .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));
            JsMinifyOptions {
                compress,
                mangle,
                ..options
            }
        });
    }

    minify
}
