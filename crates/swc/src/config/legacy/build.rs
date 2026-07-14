use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

#[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
use anyhow::Context;
use anyhow::{bail, Error};
use either::Either;
#[cfg(feature = "plugin")]
use swc_common::plugin::metadata::TransformPluginMetadataContext;
#[cfg(feature = "react-compiler")]
use swc_common::Spanned;
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::Handler,
    FileName, Mark, SourceMap,
};
use swc_compiler_base::SourceMapsConfig;
use swc_config::{
    file_pattern::FilePattern,
    is_module::IsModule,
    merge::Merge,
    types::{BoolOr, BoolOrDataConfig},
};
use swc_ecma_ast::{noop_pass, EsVersion, Pass, Program};
use swc_ecma_ext_transforms::jest;
#[cfg(feature = "lint")]
use swc_ecma_lints::rules::{lint_pass, LintParams};
use swc_ecma_minifier::{
    js::{JsMinifyCommentOption, JsMinifyOptions},
    option::terser::TerserTopLevelOptions,
};
use swc_ecma_parser::Syntax;
use swc_ecma_preset_env::{Caniuse, Feature};
use swc_ecma_transforms::{
    fixer::{fixer, paren_remover},
    helpers,
    hygiene::{self, hygiene_with_config},
    optimization::{const_modules, json_parse, simplifier},
    proposals::{
        decorators, explicit_resource_management::explicit_resource_management,
        export_default_from, import_attributes, DecoratorVersion,
    },
    react::{self, default_pragma, default_pragma_frag},
    resolver,
    typescript::{self, TsImportExportAssignConfig},
    Assumptions,
};
#[cfg(feature = "module")]
use swc_ecma_transforms_module::{
    self as modules,
    path::{ImportResolver, Resolver},
    rewriter::import_rewriter,
};
use swc_ecma_transforms_optimization::simplify::{
    dce::Config as DceConfig, Config as SimplifyConfig,
};
use swc_ecma_visit::VisitMutWith;
use swc_visit::Optional;

#[cfg(feature = "react-compiler")]
use super::super::{emit_react_compiler_diagnostics, react_compiler_options};
use super::{
    super::{
        Config, InputSourceMap, JscConfig, JscOutputConfig, ModuleConfig, Options, OutputCharset,
        SimplifyOption,
    },
    minifier::MinifierPass,
};
use crate::dropped_comments_preserver::dropped_comments_preserver;

impl Options {
    /// Builds a legacy program and delayed transform graph.
    ///
    /// The `parse` callback receives `(syntax, target, is_module)` and should
    /// use the supplied comment storage. Its boolean result marks a Flow
    /// type-only module that must become a script after type stripping. React
    /// Compiler and the initial resolver run immediately;
    /// [`BuiltInput::pass`] contains the remaining transforms.
    #[allow(clippy::too_many_arguments)]
    pub fn build_as_input<'a, P>(
        &self,
        cm: &Arc<SourceMap>,
        base: &FileName,
        parse: impl FnOnce(Syntax, EsVersion, IsModule) -> Result<(Program, bool), Error>,
        output_path: Option<&Path>,
        source_root: Option<String>,
        source_file_name: Option<String>,
        source_map_ignore_list: Option<FilePattern>,

        handler: &Handler,
        config: Option<Config>,
        comments: Option<&'a SingleThreadedComments>,
        custom_before_pass: impl FnOnce(&Program) -> P,
    ) -> Result<BuiltInput<Box<dyn 'a + Pass>>, Error>
    where
        P: 'a + Pass,
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
            #[cfg(feature = "lint")]
            lints,
            preserve_all_comments,
            rewrite_relative_import_extensions,
            preserve_symlinks,
            ..
        } = cfg.jsc;
        let loose = loose.into_bool();
        let preserve_all_comments = preserve_all_comments.into_bool();
        let preserve_symlinks = preserve_symlinks.into_bool();
        let keep_class_names = keep_class_names.into_bool();
        let external_helpers = external_helpers.into_bool();

        let mut assumptions = assumptions.unwrap_or_else(|| {
            if loose {
                Assumptions::all()
            } else {
                Assumptions::default()
            }
        });

        let unresolved_mark = self.unresolved_mark.unwrap_or_default();
        let top_level_mark = self.top_level_mark.unwrap_or_default();

        if target.is_some() && cfg.env.is_some() {
            bail!("`env` and `jsc.target` cannot be used together");
        }

        let es_version = target.unwrap_or_default();

        let syntax = syntax.unwrap_or_default();

        let (mut program, flow_strip_script_like_module) = parse(syntax, es_version, is_module)?;

        let mut transform = transform.into_inner().unwrap_or_default();

        #[cfg(feature = "react-compiler")]
        if let Some(options) = react_compiler_options(transform.react_compiler.clone(), base) {
            let fm = if program.span().is_dummy() {
                cm.get_source_file(base)
            } else {
                cm.try_lookup_byte_offset(program.span().lo)
                    .ok()
                    .map(|source| source.sf)
            };

            if let Some(fm) = fm {
                let source_type = swc_ecma_react_compiler::SourceType::from_program(&program)
                    .with_typescript(syntax.typescript());
                let result = swc_ecma_react_compiler::transform(
                    &program,
                    source_type,
                    &fm.src,
                    comments,
                    options,
                );
                emit_react_compiler_diagnostics(handler, &result.diagnostics);

                if let Some(compiled) = result.program {
                    program = compiled;
                }
            } else {
                handler
                    .struct_warn("React Compiler is enabled, but the source text is unavailable")
                    .emit();
            }
        }

        #[cfg(not(feature = "react-compiler"))]
        if transform.react_compiler.is_true() || transform.react_compiler.is_obj() {
            handler
                .struct_warn(
                    "React Compiler is configured, but swc was built without the `react-compiler` \
                     feature",
                )
                .emit();
        }

        // Resolve before constructing delayed transforms so custom passes can
        // use syntax contexts for variable management.
        if syntax.typescript() {
            assumptions.set_class_methods |= !transform.use_define_for_class_fields.into_bool();
        }

        assumptions.set_public_class_fields |= !transform.use_define_for_class_fields.into_bool();

        program.visit_mut_with(&mut resolver(
            unresolved_mark,
            top_level_mark,
            syntax.typescript(),
        ));

        let default_top_level = program.is_module() && !flow_strip_script_like_module;

        js_minify = js_minify.map(|mut c| {
            let compress = c
                .compress
                .unwrap_as_option(|default| match default {
                    Some(true) => Some(Default::default()),
                    _ => None,
                })
                .map(|mut c| {
                    if c.toplevel.is_none() {
                        c.toplevel = Some(TerserTopLevelOptions::Bool(default_top_level));
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
                        c.top_level = Some(default_top_level);
                    }

                    c
                })
                .map(BoolOrDataConfig::from_obj)
                .unwrap_or_else(|| BoolOrDataConfig::from_bool(false));

            if c.toplevel.is_none() {
                c.toplevel = Some(default_top_level);
            }

            JsMinifyOptions {
                compress,
                mangle,
                ..c
            }
        });

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
            optimizer
                .as_ref()
                .and_then(|v| v.jsonify)
                .as_ref()
                .map(|cfg| json_parse(cfg.min_cost))
        };

        let simplifier_pass = {
            if let Some(ref opts) = optimizer.as_ref().and_then(|o| o.simplify) {
                match opts {
                    SimplifyOption::Bool(allow_simplify) => {
                        if *allow_simplify {
                            Some(simplifier(unresolved_mark, Default::default()))
                        } else {
                            None
                        }
                    }
                    SimplifyOption::Json(cfg) => Some(simplifier(
                        unresolved_mark,
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
                None
            }
        };

        let optimization = {
            optimizer
                .and_then(|o| o.globals)
                .map(|opts| opts.build(cm, handler))
        };

        let pass = (
            const_modules,
            optimization,
            Optional::new(export_default_from(), syntax.export_default_from()),
            simplifier_pass,
            json_parse_pass,
        );

        let import_export_assign_config = match cfg.module {
            Some(ModuleConfig::Es6(..)) => TsImportExportAssignConfig::EsNext,
            Some(ModuleConfig::CommonJs(..))
            | Some(ModuleConfig::Amd(..))
            | Some(ModuleConfig::Umd(..))
            | Some(ModuleConfig::SystemJs(..)) => TsImportExportAssignConfig::Preserve,
            Some(ModuleConfig::NodeNext(..)) => TsImportExportAssignConfig::NodeNext,
            _ => TsImportExportAssignConfig::Classic,
        };

        let verbatim_module_syntax = transform.verbatim_module_syntax.into_bool();
        let ts_enum_is_mutable = transform.ts_enum_is_mutable.into_bool();

        let charset = cfg.jsc.output.charset.or_else(|| {
            if js_minify.as_ref()?.format.ascii_only {
                Some(OutputCharset::Ascii)
            } else {
                None
            }
        });

        // inline_script defaults to true, but it's case only if minify is enabled.
        // This is because minifier API is compatible with Terser, and Terser
        // defaults to true, while by default swc itself doesn't enable
        // inline_script by default.
        let codegen_inline_script = js_minify.as_ref().is_some_and(|v| v.format.inline_script);

        let preamble = if !cfg.jsc.output.preamble.is_empty() {
            cfg.jsc.output.preamble
        } else {
            js_minify
                .as_ref()
                .map(|v| v.format.preamble.clone())
                .unwrap_or_default()
        };

        let paths = paths.into_iter().collect();
        let resolver = ModuleConfig::get_resolver(
            &base_url,
            paths,
            base,
            cfg.module.as_ref(),
            preserve_symlinks,
        );

        let target = es_version;
        let inject_helpers = !self.skip_helper_injection;
        let fixer_enabled = !self.disable_fixer;
        let hygiene_config = if self.disable_hygiene {
            None
        } else {
            Some(hygiene::Config {
                keep_class_names,
                ..hygiene::Config::hygiene_default()
            })
        };
        let env = cfg.env.map(Into::into);

        // Implementing finalize logic directly
        #[cfg(feature = "module")]
        let (need_analyzer, import_interop, ignore_dynamic) = match cfg.module {
            Some(ModuleConfig::CommonJs(ref c)) => (true, c.import_interop(), c.ignore_dynamic),
            Some(ModuleConfig::Amd(ref c)) => {
                (true, c.config.import_interop(), c.config.ignore_dynamic)
            }
            Some(ModuleConfig::Umd(ref c)) => {
                (true, c.config.import_interop(), c.config.ignore_dynamic)
            }
            Some(ModuleConfig::SystemJs(_))
            | Some(ModuleConfig::Es6(..))
            | Some(ModuleConfig::NodeNext(..))
            | None => (false, true.into(), true),
        };

        let feature_config = env
            .as_ref()
            .map(|e: &swc_ecma_preset_env::EnvConfig| e.get_feature_config());

        // compat
        let compat_pass = {
            if let Some(env_config) = env {
                Either::Left(swc_ecma_preset_env::transform_from_env(
                    unresolved_mark,
                    comments.map(|v| v as &dyn Comments),
                    env_config,
                    assumptions,
                ))
            } else {
                Either::Right(swc_ecma_preset_env::transform_from_es_version(
                    unresolved_mark,
                    comments.map(|v| v as &dyn Comments),
                    target,
                    assumptions,
                    loose,
                ))
            }
        };

        let is_mangler_enabled = js_minify
            .as_ref()
            .map(|v| v.mangle.is_obj() || v.mangle.is_true())
            .unwrap_or(false);

        let jsx_preserve = transform.react.runtime == Some(react::Runtime::Preserve);

        #[cfg(feature = "module")]
        let rewrite_import_pass: Box<dyn Pass> = {
            let swc_import_rewriter: Box<dyn Pass> = match resolver.clone() {
                Some((base, resolver)) => match cfg.module {
                    None | Some(ModuleConfig::Es6(..)) | Some(ModuleConfig::NodeNext(..)) => {
                        Box::new(import_rewriter(base, resolver))
                    }
                    _ => Box::new(noop_pass()),
                },
                None => Box::new(noop_pass()),
            };

            let typescript_import_rewriter = Optional::new(
                modules::rewriter::typescript_import_rewriter(jsx_preserve),
                rewrite_relative_import_extensions.into_bool(),
            );

            // swc_import_rewriter should be in front of typescript_import_rewriter
            // because path aliases should be resolved before rewriting relative import
            // extensions
            Box::new((swc_import_rewriter, typescript_import_rewriter))
        };
        #[cfg(not(feature = "module"))]
        let rewrite_import_pass: Box<dyn Pass> = {
            let _ = &resolver;
            let _ = &cfg.module;
            let _ = rewrite_relative_import_extensions;
            Box::new(noop_pass())
        };

        #[cfg(feature = "module")]
        let module_pass: Box<dyn Pass> = Box::new((
            // module / helper
            Optional::new(
                modules::import_analysis::import_analyzer(import_interop, ignore_dynamic),
                need_analyzer,
            ),
            // Rewrite import pass should be before inject_helpers pass because typescript import
            // rewriter may require ts_rewrite_relative_import_extension helper
            rewrite_import_pass,
            Optional::new(helpers::inject_helpers(unresolved_mark), inject_helpers),
            ModuleConfig::build(
                cm.clone(),
                comments.map(|v| v as &dyn Comments),
                cfg.module,
                unresolved_mark,
                resolver.clone(),
                |f| {
                    feature_config
                        .as_ref()
                        .map_or_else(|| target.caniuse(f), |env| env.caniuse(f))
                },
            ),
        ));
        #[cfg(not(feature = "module"))]
        let module_pass: Box<dyn Pass> = {
            let _ = &cfg.module;
            let _ = &resolver;
            let _ = &feature_config;
            Box::new((
                rewrite_import_pass,
                Optional::new(helpers::inject_helpers(unresolved_mark), inject_helpers),
                ModuleConfig::build(
                    cm.clone(),
                    comments.map(|v| v as &dyn Comments),
                    cfg.module,
                    unresolved_mark,
                    |_f| true,
                ),
            ))
        };

        let built_pass = (
            pass,
            Optional::new(
                paren_remover(comments.map(|v| v as &dyn Comments)),
                fixer_enabled,
            ),
            compat_pass,
            module_pass,
            MinifierPass {
                options: js_minify,
                cm: cm.clone(),
                comments: comments.map(|v| v as &dyn Comments),
                top_level_mark,
            },
            Optional::new(
                hygiene_with_config(swc_ecma_transforms_base::hygiene::Config {
                    top_level_mark,
                    ..hygiene_config
                        .clone()
                        .unwrap_or_else(hygiene::Config::hygiene_default)
                }),
                hygiene_config.is_some() && !is_mangler_enabled,
            ),
            Optional::new(fixer(comments.map(|v| v as &dyn Comments)), fixer_enabled),
        );

        let keep_import_attributes = experimental.keep_import_attributes.into_bool();

        #[cfg(feature = "plugin")]
        let plugin_transforms: Box<dyn Pass> = {
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
                let plugin_runtime = self
                    .runtime_options
                    .plugin_runtime
                    .clone()
                    .context("plugin runtime not configured")?;

                if let Some(plugins) = &experimental.plugins {
                    crate::plugin::compile_wasm_plugins(
                        experimental.cache_root.as_deref(),
                        plugins,
                        &*plugin_runtime,
                    )
                    .context("Failed to compile wasm plugins")?;
                }

                Box::new(crate::plugin::plugins(
                    experimental.plugins,
                    experimental.plugin_env_vars,
                    transform_metadata_context,
                    comments.cloned(),
                    cm.clone(),
                    unresolved_mark,
                    plugin_runtime,
                ))
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

                Box::new(noop_pass())
            }
        };

        #[cfg(not(feature = "plugin"))]
        let plugin_transforms: Box<dyn Pass> = {
            if experimental.plugins.is_some() {
                handler.warn(
                    "Plugin is not supported with current @swc/core. Plugin transform will be \
                     skipped.",
                );
            }
            Box::new(noop_pass())
        };

        let mut plugin_transforms = Some(plugin_transforms);

        let pass: Box<dyn Pass> = if experimental
            .disable_builtin_transforms_for_internal_testing
            .into_bool()
        {
            plugin_transforms.unwrap()
        } else {
            let jsx_enabled = syntax.jsx() && !jsx_preserve;

            let decorator_pass: Box<dyn Pass> =
                match transform.decorator_version.unwrap_or_default() {
                    DecoratorVersion::V202112 => Box::new(decorators(decorators::Config {
                        legacy: transform.legacy_decorator.into_bool(),
                        emit_metadata: transform.decorator_metadata.into_bool(),
                        use_define_for_class_fields: !assumptions.set_public_class_fields,
                    })),
                    DecoratorVersion::V202203 => Box::new(
                        swc_ecma_transforms::proposals::decorator_2022_03::decorator_2022_03(),
                    ),
                    DecoratorVersion::V202311 => Box::new(
                        swc_ecma_transforms::proposals::decorator_2023_11::decorator_2023_11(),
                    ),
                };
            #[cfg(feature = "lint")]
            let lint = {
                use swc_common::SyntaxContext;
                let disable_all_lints = experimental.disable_all_lints.into_bool();
                let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
                let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);
                Optional::new(
                    lint_pass(swc_ecma_lints::rules::all(LintParams {
                        program: &program,
                        lint_config: &lints,
                        top_level_ctxt,
                        unresolved_ctxt,
                        es_version,
                        source_map: cm.clone(),
                    })),
                    !disable_all_lints,
                )
            };
            Box::new((
                (
                    if experimental.run_plugin_first.into_bool() {
                        plugin_transforms.take()
                    } else {
                        None
                    },
                    #[cfg(feature = "lint")]
                    lint,
                    // Decorators may use type information
                    Optional::new(decorator_pass, syntax.decorators()),
                    Optional::new(
                        explicit_resource_management(),
                        syntax.explicit_resource_management(),
                    ),
                    // The transform strips import attributes unless they are kept.
                    Optional::new(import_attributes(), !keep_import_attributes),
                ),
                ({
                    let native_class_properties = !assumptions.set_public_class_fields
                        && feature_config.as_ref().map_or_else(
                            || target.caniuse(Feature::ClassProperties),
                            |env| env.caniuse(Feature::ClassProperties),
                        );

                    let ts_config = typescript::Config {
                        import_export_assign_config,
                        verbatim_module_syntax,
                        native_class_properties,
                        ts_enum_is_mutable,
                        flow_syntax: syntax.flow(),
                        ..Default::default()
                    };

                    (
                        Optional::new(
                            typescript::typescript(ts_config, unresolved_mark, top_level_mark),
                            syntax.typescript() && !jsx_enabled,
                        ),
                        Optional::new(
                            typescript::tsx::<Option<&dyn Comments>>(
                                cm.clone(),
                                ts_config,
                                typescript::TsxConfig {
                                    pragma: Some(
                                        transform
                                            .react
                                            .pragma
                                            .clone()
                                            .unwrap_or_else(default_pragma),
                                    ),
                                    pragma_frag: Some(
                                        transform
                                            .react
                                            .pragma_frag
                                            .clone()
                                            .unwrap_or_else(default_pragma_frag),
                                    ),
                                },
                                comments.map(|v| v as _),
                                unresolved_mark,
                                top_level_mark,
                            ),
                            syntax.typescript() && jsx_enabled,
                        ),
                    )
                }),
                (
                    plugin_transforms.take(),
                    custom_before_pass(&program),
                    // handle jsx
                    Optional::new(
                        react::react::<&dyn Comments>(
                            cm.clone(),
                            comments.map(|v| v as _),
                            transform.react,
                            top_level_mark,
                            unresolved_mark,
                        ),
                        jsx_enabled,
                    ),
                    built_pass,
                    Optional::new(jest::jest(), transform.hidden.jest.into_bool()),
                    Optional::new(
                        dropped_comments_preserver(comments.cloned()),
                        preserve_all_comments,
                    ),
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
            source_root,
            source_file_name,
            source_map_ignore_list,
            comments: comments.cloned(),
            preserve_comments,
            emit_source_map_columns: cfg.emit_source_map_columns.into_bool(),
            output: JscOutputConfig {
                charset,
                preamble,
                ..cfg.jsc.output
            },
            emit_assert_for_import_attributes: experimental
                .emit_assert_for_import_attributes
                .into_bool(),
            emit_source_map_scopes: experimental.emit_source_map_scopes.into_bool(),
            codegen_inline_script,
            flow_strip_script_like_module,
            emit_isolated_dts: experimental.emit_isolated_dts.into_bool(),
            unresolved_mark,
            #[cfg(feature = "module")]
            resolver,
        })
    }
}

/// A program, delayed transform graph, and emit configuration for one legacy
/// compilation.
///
/// `program` has passed optional React Compiler and the initial resolver;
/// `pass` has not run.
#[non_exhaustive]
pub struct BuiltInput<P: Pass> {
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

    pub source_root: Option<String>,
    pub source_file_name: Option<String>,
    pub source_map_ignore_list: Option<FilePattern>,

    pub comments: Option<SingleThreadedComments>,
    pub preserve_comments: BoolOr<JsMinifyCommentOption>,

    pub inline_sources_content: bool,
    pub emit_source_map_columns: bool,

    pub output: JscOutputConfig,
    pub emit_assert_for_import_attributes: bool,
    pub emit_source_map_scopes: bool,
    pub codegen_inline_script: bool,
    /// Whether a Flow type-only module must become a script after stripping.
    pub flow_strip_script_like_module: bool,

    pub emit_isolated_dts: bool,
    pub unresolved_mark: Mark,
    #[cfg(feature = "module")]
    pub resolver: Option<(FileName, Arc<dyn ImportResolver>)>,
}

impl<P> BuiltInput<P>
where
    P: Pass,
{
    /// Replaces the delayed pass without applying it.
    pub fn with_pass<N>(self, map: impl FnOnce(P) -> N) -> BuiltInput<N>
    where
        N: Pass,
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
            source_root: self.source_root,
            source_file_name: self.source_file_name,
            source_map_ignore_list: self.source_map_ignore_list,
            comments: self.comments,
            preserve_comments: self.preserve_comments,
            inline_sources_content: self.inline_sources_content,
            emit_source_map_columns: self.emit_source_map_columns,
            output: self.output,
            emit_assert_for_import_attributes: self.emit_assert_for_import_attributes,
            emit_source_map_scopes: self.emit_source_map_scopes,
            codegen_inline_script: self.codegen_inline_script,
            flow_strip_script_like_module: self.flow_strip_script_like_module,
            emit_isolated_dts: self.emit_isolated_dts,
            unresolved_mark: self.unresolved_mark,
            #[cfg(feature = "module")]
            resolver: self.resolver,
        }
    }
}

#[cfg(feature = "module")]
impl ModuleConfig {
    pub fn build<'cmt>(
        cm: Arc<SourceMap>,
        comments: Option<&'cmt dyn Comments>,
        config: Option<ModuleConfig>,
        unresolved_mark: Mark,
        resolver: Option<(FileName, Arc<dyn ImportResolver>)>,
        caniuse: impl Fn(Feature) -> bool,
    ) -> Box<dyn Pass + 'cmt> {
        let resolver = if let Some((base, resolver)) = resolver {
            Resolver::Real { base, resolver }
        } else {
            Resolver::Default
        };

        let support_block_scoping = caniuse(Feature::BlockScoping);
        let support_arrow = caniuse(Feature::ArrowFunctions);

        let transform_pass = match config {
            Some(ModuleConfig::CommonJs(config)) => Box::new(modules::common_js::common_js(
                resolver,
                unresolved_mark,
                config,
                modules::common_js::FeatureFlag {
                    support_block_scoping,
                    support_arrow,
                },
            )) as Box<dyn Pass>,
            Some(ModuleConfig::Umd(config)) => Box::new(modules::umd::umd(
                cm,
                resolver,
                unresolved_mark,
                config,
                modules::umd::FeatureFlag {
                    support_block_scoping,
                },
            )),
            Some(ModuleConfig::Amd(config)) => Box::new(modules::amd::amd(
                resolver,
                unresolved_mark,
                config,
                modules::amd::FeatureFlag {
                    support_block_scoping,
                    support_arrow,
                },
                comments,
            )),
            Some(ModuleConfig::SystemJs(config)) => Box::new(modules::system_js::system_js(
                resolver,
                unresolved_mark,
                config,
            )),
            _ => Box::new(noop_pass()),
        };

        Box::new(transform_pass)
    }
}

/// Stub pass builder when the module feature is disabled.
#[cfg(not(feature = "module"))]
impl ModuleConfig {
    /// Returns a noop pass when module feature is disabled.
    pub fn build<'cmt>(
        _cm: Arc<SourceMap>,
        _comments: Option<&'cmt dyn Comments>,
        _config: Option<ModuleConfig>,
        _unresolved_mark: Mark,
        _caniuse: impl Fn(Feature) -> bool,
    ) -> Box<dyn Pass + 'cmt> {
        Box::new(noop_pass())
    }
}
