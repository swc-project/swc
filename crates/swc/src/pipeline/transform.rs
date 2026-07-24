use std::sync::Arc;

use swc_common::comments::Comments;
use swc_ecma_preset_env::{Caniuse, Feature};
use swc_ecma_transforms::{
    fixer::paren_remover,
    helpers,
    optimization::{const_modules, json_parse, simplifier},
    proposals::{
        decorators, explicit_resource_management::explicit_resource_management,
        export_default_from, import_attributes,
    },
    react::{self, default_pragma, default_pragma_frag},
    typescript,
};
#[cfg(feature = "module")]
use swc_ecma_transforms_module::{self as modules, rewriter::import_rewriter};
use swc_ecma_transforms_optimization::simplify::{
    dce::Config as DceConfig, Config as SimplifyConfig,
};

use super::{
    state::{CompilationUnit, ModuleResolver, PipelineContextData},
    Pipeline,
};
use crate::config::{DecoratorVersion, ModuleConfig, SimplifyOption, TransformConfig};

/// Configuration for the built-in syntax and lowering stages.
pub(super) struct BuiltinTransformOptions {
    pub(super) assumptions: swc_ecma_transforms::Assumptions,
    pub(super) loose: bool,
    pub(super) transform: TransformConfig,
    pub(super) env: Option<swc_ecma_preset_env::EnvConfig>,
    pub(super) feature_config: Option<Arc<swc_ecma_preset_env::FeatureConfig>>,
    pub(super) module: Option<ModuleConfig>,
    pub(super) import_export_assign_config: typescript::TsImportExportAssignConfig,
    pub(super) rewrite_relative_import_extensions: bool,
    pub(super) module_resolver: ModuleResolver,
    pub(super) inject_helpers: bool,
    pub(super) remove_parentheses: bool,
    pub(super) keep_import_attributes: bool,
}

impl Pipeline<'_> {
    /// Runs the early built-in syntax transforms.
    pub(super) fn transform_syntax(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: Option<&mut BuiltinTransformOptions>,
    ) {
        let Some(options) = options else {
            return;
        };

        self.run_decorator_transform(unit, context, options);

        if context.syntax.explicit_resource_management() {
            unit.program.mutate(explicit_resource_management());
        }
        if !options.keep_import_attributes {
            unit.program.mutate(import_attributes());
        }

        self.run_typescript_transform(unit, context, options);
    }

    /// Runs the remaining built-in transforms after the `after_typescript`
    /// hook boundary.
    pub(super) fn transform_after_typescript(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        stage: Option<BuiltinTransformOptions>,
    ) {
        let Some(mut options) = stage else {
            return;
        };

        self.run_react_transform(unit, context, &mut options);
        self.run_optimizer_transforms(unit, context, &mut options);
        self.run_compat_transform(unit, context, &mut options);
        #[cfg(feature = "module")]
        self.run_import_transforms(unit, &options);
        if options.inject_helpers {
            unit.program
                .mutate(helpers::inject_helpers(context.unresolved_mark));
        }
        self.run_module_transform(unit, context, &mut options);
    }

    fn run_decorator_transform(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &BuiltinTransformOptions,
    ) {
        if !context.syntax.decorators() {
            return;
        }

        match options.transform.decorator_version.unwrap_or_default() {
            DecoratorVersion::V202112 => {
                unit.program.mutate(decorators(decorators::Config {
                    legacy: options.transform.legacy_decorator.into_bool(),
                    emit_metadata: options.transform.decorator_metadata.into_bool(),
                    use_define_for_class_fields: !options.assumptions.set_public_class_fields,
                }));
            }
            DecoratorVersion::V202203 => unit
                .program
                .mutate(swc_ecma_transforms::proposals::decorator_2022_03::decorator_2022_03()),
            DecoratorVersion::V202311 => unit
                .program
                .mutate(swc_ecma_transforms::proposals::decorator_2023_11::decorator_2023_11()),
        }
    }

    fn run_typescript_transform(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &BuiltinTransformOptions,
    ) {
        if !context.syntax.typescript() {
            return;
        }

        let jsx_enabled = context.syntax.jsx()
            && options.transform.react.runtime != Some(react::Runtime::Preserve);
        let native_class_properties = !options.assumptions.set_public_class_fields
            && options.feature_config.as_ref().map_or_else(
                || context.target.caniuse(Feature::ClassProperties),
                |env| env.caniuse(Feature::ClassProperties),
            );
        let ts_config = typescript::Config {
            import_export_assign_config: options.import_export_assign_config,
            verbatim_module_syntax: options.transform.verbatim_module_syntax.into_bool(),
            native_class_properties,
            ts_enum_is_mutable: options.transform.ts_enum_is_mutable.into_bool(),
            flow_syntax: context.syntax.flow(),
            ..Default::default()
        };

        if jsx_enabled {
            unit.program.mutate(typescript::tsx(
                self.compiler.cm.clone(),
                ts_config,
                typescript::TsxConfig {
                    pragma: Some(
                        options
                            .transform
                            .react
                            .pragma
                            .clone()
                            .unwrap_or_else(default_pragma),
                    ),
                    pragma_frag: Some(
                        options
                            .transform
                            .react
                            .pragma_frag
                            .clone()
                            .unwrap_or_else(default_pragma_frag),
                    ),
                },
                Some(&unit.comments as &dyn Comments),
                context.unresolved_mark,
                context.top_level_mark,
            ));
        } else {
            unit.program.mutate(typescript::typescript(
                ts_config,
                context.unresolved_mark,
                context.top_level_mark,
            ));
        }
    }

    fn run_react_transform(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &mut BuiltinTransformOptions,
    ) {
        if !context.syntax.jsx()
            || options.transform.react.runtime == Some(react::Runtime::Preserve)
        {
            return;
        }

        unit.program.mutate(react::react(
            self.compiler.cm.clone(),
            Some(&unit.comments as &dyn Comments),
            std::mem::take(&mut options.transform.react),
            context.top_level_mark,
            context.unresolved_mark,
        ));
    }

    fn run_optimizer_transforms(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &mut BuiltinTransformOptions,
    ) {
        if let Some(config) = options.transform.const_modules.take() {
            unit.program
                .mutate(const_modules(self.compiler.cm.clone(), config.globals));
        }

        let Some(mut optimizer) = options.transform.optimizer.take() else {
            if context.syntax.export_default_from() {
                unit.program.mutate(export_default_from());
            }
            return;
        };

        if let Some(globals) = optimizer.globals.take() {
            unit.program
                .mutate(globals.build(&self.compiler.cm, self.handler));
        }
        if context.syntax.export_default_from() {
            unit.program.mutate(export_default_from());
        }
        if let Some(simplify) = optimizer.simplify.take() {
            match simplify {
                SimplifyOption::Bool(true) => unit
                    .program
                    .mutate(simplifier(context.unresolved_mark, Default::default())),
                SimplifyOption::Bool(false) => {}
                SimplifyOption::Json(config) => unit.program.mutate(simplifier(
                    context.unresolved_mark,
                    SimplifyConfig {
                        dce: DceConfig {
                            preserve_imports_with_side_effects: config
                                .preserve_imports_with_side_effects,
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                )),
            }
        }
        if let Some(config) = optimizer.jsonify {
            unit.program.mutate(json_parse(config.min_cost));
        }
    }

    fn run_compat_transform(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &mut BuiltinTransformOptions,
    ) {
        if options.remove_parentheses {
            unit.program
                .mutate(paren_remover(Some(&unit.comments as &dyn Comments)));
        }

        if let Some(env) = options.env.take() {
            unit.program.mutate(swc_ecma_preset_env::transform_from_env(
                context.unresolved_mark,
                Some(&unit.comments as &dyn Comments),
                env,
                options.assumptions,
            ));
        } else {
            unit.program
                .mutate(swc_ecma_preset_env::transform_from_es_version(
                    context.unresolved_mark,
                    Some(&unit.comments as &dyn Comments),
                    context.target,
                    options.assumptions,
                    options.loose,
                ));
        }
    }

    #[cfg(feature = "module")]
    fn run_import_transforms(&self, unit: &mut CompilationUnit, options: &BuiltinTransformOptions) {
        let (need_analyzer, import_interop, ignore_dynamic) = match &options.module {
            Some(ModuleConfig::CommonJs(config)) => {
                (true, config.import_interop(), config.ignore_dynamic)
            }
            Some(ModuleConfig::Amd(config)) => (
                true,
                config.config.import_interop(),
                config.config.ignore_dynamic,
            ),
            Some(ModuleConfig::Umd(config)) => (
                true,
                config.config.import_interop(),
                config.config.ignore_dynamic,
            ),
            Some(ModuleConfig::SystemJs(_))
            | Some(ModuleConfig::Es6(_))
            | Some(ModuleConfig::NodeNext(_))
            | None => (false, true.into(), true),
        };

        if need_analyzer {
            unit.program
                .mutate(modules::import_analysis::import_analyzer(
                    import_interop,
                    ignore_dynamic,
                ));
        }

        if matches!(
            options.module,
            None | Some(ModuleConfig::Es6(_)) | Some(ModuleConfig::NodeNext(_))
        ) {
            if let Some((base, resolver)) = options.module_resolver.clone() {
                unit.program.mutate(import_rewriter(base, resolver));
            }
        }

        if options.rewrite_relative_import_extensions {
            let jsx_preserve = options.transform.react.runtime == Some(react::Runtime::Preserve);
            unit.program
                .mutate(modules::rewriter::typescript_import_rewriter(jsx_preserve));
        }
    }

    #[cfg(feature = "module")]
    fn run_module_transform(
        &self,
        unit: &mut CompilationUnit,
        context: &PipelineContextData,
        options: &mut BuiltinTransformOptions,
    ) {
        let target = context.target;
        let feature_config = options.feature_config.as_ref();
        let caniuse = |feature| {
            feature_config.map_or_else(|| target.caniuse(feature), |env| env.caniuse(feature))
        };
        let resolver = match options.module_resolver.clone() {
            Some((base, resolver)) => modules::path::Resolver::Real { base, resolver },
            None => modules::path::Resolver::Default,
        };
        let support_block_scoping = caniuse(Feature::BlockScoping);
        let support_arrow = caniuse(Feature::ArrowFunctions);

        match options.module.take() {
            Some(ModuleConfig::CommonJs(config)) => {
                unit.program.mutate(modules::common_js::common_js(
                    resolver,
                    context.unresolved_mark,
                    config,
                    modules::common_js::FeatureFlag {
                        support_block_scoping,
                        support_arrow,
                    },
                ));
            }
            Some(ModuleConfig::Umd(config)) => {
                unit.program.mutate(modules::umd::umd(
                    self.compiler.cm.clone(),
                    resolver,
                    context.unresolved_mark,
                    config,
                    modules::umd::FeatureFlag {
                        support_block_scoping,
                    },
                ));
            }
            Some(ModuleConfig::Amd(config)) => {
                unit.program.mutate(modules::amd::amd(
                    resolver,
                    context.unresolved_mark,
                    config,
                    modules::amd::FeatureFlag {
                        support_block_scoping,
                        support_arrow,
                    },
                    Some(&unit.comments as &dyn Comments),
                ));
            }
            Some(ModuleConfig::SystemJs(config)) => {
                unit.program.mutate(modules::system_js::system_js(
                    resolver,
                    context.unresolved_mark,
                    config,
                ));
            }
            Some(ModuleConfig::Es6(_)) | Some(ModuleConfig::NodeNext(_)) | None => {}
        }
    }

    #[cfg(not(feature = "module"))]
    fn run_module_transform(
        &self,
        _unit: &mut CompilationUnit,
        _context: &PipelineContextData,
        options: &mut BuiltinTransformOptions,
    ) {
        let _ = options.rewrite_relative_import_extensions;
        let _ = &options.module_resolver;
        let _ = options.module.take();
    }
}
