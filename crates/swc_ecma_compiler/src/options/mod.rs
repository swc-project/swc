use std::path::PathBuf;

use crate::{
    common::helper_loader::{HelperLoaderMode, HelperLoaderOptions},
    compiler_assumptions::CompilerAssumptions,
    decorator::DecoratorOptions,
    es2015::ES2015Options,
    es2016::ES2016Options,
    es2017::ES2017Options,
    es2018::ES2018Options,
    es2019::ES2019Options,
    es2020::ES2020Options,
    es2021::ES2021Options,
    es2022::ES2022Options,
    es2026::ES2026Options,
    jsx::JsxOptions,
    plugins::{PluginsOptions, StyledComponentsOptions},
    proposals::ProposalOptions,
    regexp::RegExpOptions,
    typescript::TypeScriptOptions,
    ReactRefreshOptions,
};

pub mod babel;
mod env;
mod module;

use babel::BabelOptions;
pub use env::EnvOptions;
pub use module::Module;

/// <https://babel.dev/docs/options>
#[derive(Debug, Default, Clone)]
pub struct TransformOptions {
    //
    // Primary Options
    /// The working directory that all paths in the programmatic options will be
    /// resolved relative to.
    pub cwd: PathBuf,

    // Core
    /// Set assumptions in order to produce smaller output.
    /// For more information, check the [assumptions](https://babel.dev/docs/assumptions) documentation page.
    pub assumptions: CompilerAssumptions,

    // Plugins
    /// [preset-typescript](https://babeljs.io/docs/babel-preset-typescript)
    pub typescript: TypeScriptOptions,

    /// Decorator
    pub decorator: DecoratorOptions,

    /// Jsx Transform
    ///
    /// See [preset-react](https://babeljs.io/docs/babel-preset-react)
    pub jsx: JsxOptions,

    /// ECMAScript Env Options
    pub env: EnvOptions,

    /// Proposals
    pub proposals: ProposalOptions,

    /// Plugins
    pub plugins: PluginsOptions,

    pub helper_loader: HelperLoaderOptions,
}

impl TransformOptions {
    /// Explicitly enable all plugins that are ready, mainly for testing
    /// purposes.
    ///
    /// NOTE: for internal use only
    #[doc(hidden)]
    pub fn enable_all() -> Self {
        Self {
            cwd: PathBuf::new(),
            assumptions: CompilerAssumptions::default(),
            typescript: TypeScriptOptions::default(),
            decorator: DecoratorOptions {
                legacy: true,
                emit_decorator_metadata: true,
            },
            jsx: JsxOptions {
                development: true,
                refresh: Some(ReactRefreshOptions::default()),
                ..JsxOptions::default()
            },
            env: EnvOptions::enable_all(/* include_unfinished_plugins */ false),
            proposals: ProposalOptions::default(),
            plugins: PluginsOptions {
                styled_components: Some(StyledComponentsOptions::default()),
            },
            helper_loader: HelperLoaderOptions {
                mode: HelperLoaderMode::Runtime,
                ..Default::default()
            },
        }
    }

    /// Initialize from a comma separated list of `target`s and `environmens`s.
    ///
    /// e.g. `es2022,chrome58,edge16`.
    ///
    /// # Errors
    ///
    /// * Same targets specified multiple times.
    /// * No matching target.
    /// * Invalid version.
    pub fn from_target(s: &str) -> Result<Self, String> {
        EnvOptions::from_target(s).map(|env| Self {
            env,
            ..Self::default()
        })
    }

    /// Initialize from a list of `target`s and `environmens`s.
    ///
    /// e.g. `["es2020", "chrome58", "edge16", "firefox57", "node12",
    /// "safari11"]`.
    ///
    /// `target`: `es5`, `es2015` ... `es2024`, `esnext`.
    /// `environment`: `chrome`, `deno`, `edge`, `firefox`, `hermes`, `ie`,
    /// `ios`, `node`, `opera`, `rhino`, `safari`
    ///
    /// <https://esbuild.github.io/api/#target>
    ///
    /// # Errors
    ///
    /// * Same targets specified multiple times.
    /// * No matching target.
    /// * Invalid version.
    pub fn from_target_list<S: AsRef<str>>(list: &[S]) -> Result<Self, String> {
        EnvOptions::from_target_list(list).map(|env| Self {
            env,
            ..Self::default()
        })
    }
}

impl TryFrom<&BabelOptions> for TransformOptions {
    type Error = Vec<String>;

    /// If the `options` contains any unknown fields, they will be returned as a
    /// list of errors.
    fn try_from(options: &BabelOptions) -> Result<Self, Self::Error> {
        let mut errors = Vec::<String>::new();
        errors.extend(options.plugins.errors.iter().map(Clone::clone));
        errors.extend(options.presets.errors.iter().map(Clone::clone));

        let typescript = options
            .presets
            .typescript
            .clone()
            .or_else(|| options.plugins.typescript.clone())
            .unwrap_or_default();

        let decorator = DecoratorOptions {
            legacy: options.plugins.legacy_decorator.is_some(),
            emit_decorator_metadata: options
                .plugins
                .legacy_decorator
                .is_some_and(|o| o.emit_decorator_metadata),
        };

        let jsx = if let Some(options) = &options.presets.jsx {
            options.clone()
        } else {
            let mut jsx_options = if let Some(options) = &options.plugins.react_jsx_dev {
                options.clone()
            } else if let Some(options) = &options.plugins.react_jsx {
                options.clone()
            } else {
                JsxOptions::default()
            };
            jsx_options.development = options.plugins.react_jsx_dev.is_some();
            jsx_options.jsx_plugin = options.plugins.react_jsx.is_some();
            jsx_options.display_name_plugin = options.plugins.react_display_name;
            jsx_options.jsx_self_plugin = options.plugins.react_jsx_self;
            jsx_options.jsx_source_plugin = options.plugins.react_jsx_source;
            jsx_options
        };

        let env = options.presets.env.unwrap_or_default();

        let module = Module::try_from(&options.plugins).unwrap_or_else(|_| {
            options
                .presets
                .env
                .as_ref()
                .map(|env| env.module)
                .unwrap_or_default()
        });

        let regexp = RegExpOptions {
            sticky_flag: env.regexp.sticky_flag || options.plugins.sticky_flag,
            unicode_flag: env.regexp.unicode_flag || options.plugins.unicode_flag,
            dot_all_flag: env.regexp.dot_all_flag || options.plugins.dot_all_flag,
            look_behind_assertions: env.regexp.look_behind_assertions
                || options.plugins.look_behind_assertions,
            named_capture_groups: env.regexp.named_capture_groups
                || options.plugins.named_capture_groups,
            unicode_property_escapes: env.regexp.unicode_property_escapes
                || options.plugins.unicode_property_escapes,
            match_indices: env.regexp.match_indices,
            set_notation: env.regexp.set_notation || options.plugins.set_notation,
        };

        let es2015 = ES2015Options {
            arrow_function: options.plugins.arrow_function.or(env.es2015.arrow_function),
        };

        let es2016 = ES2016Options {
            exponentiation_operator: options.plugins.exponentiation_operator
                || env.es2016.exponentiation_operator,
        };

        let es2017 = ES2017Options {
            async_to_generator: options.plugins.async_to_generator || env.es2017.async_to_generator,
        };

        let es2018 = ES2018Options {
            object_rest_spread: options
                .plugins
                .object_rest_spread
                .or(env.es2018.object_rest_spread),
            async_generator_functions: options.plugins.async_generator_functions
                || env.es2018.async_generator_functions,
        };

        let es2019 = ES2019Options {
            optional_catch_binding: options.plugins.optional_catch_binding
                || env.es2019.optional_catch_binding,
        };

        let es2020 = ES2020Options {
            export_namespace_from: options.plugins.export_namespace_from
                || env.es2020.export_namespace_from,
            optional_chaining: options.plugins.optional_chaining || env.es2020.optional_chaining,
            nullish_coalescing_operator: options.plugins.nullish_coalescing_operator
                || env.es2020.nullish_coalescing_operator,
            big_int: env.es2020.big_int,
            arbitrary_module_namespace_names: env.es2020.arbitrary_module_namespace_names,
        };

        let es2021 = ES2021Options {
            logical_assignment_operators: options.plugins.logical_assignment_operators
                || env.es2021.logical_assignment_operators,
        };

        let es2022 = ES2022Options {
            class_static_block: options.plugins.class_static_block || env.es2022.class_static_block,
            class_properties: options
                .plugins
                .class_properties
                .or(env.es2022.class_properties),
            top_level_await: env.es2022.top_level_await,
        };

        if !errors.is_empty() {
            return Err(errors);
        }

        let helper_loader = HelperLoaderOptions {
            mode: if options.external_helpers {
                HelperLoaderMode::External
            } else {
                HelperLoaderMode::default()
            },
            ..HelperLoaderOptions::default()
        };

        let mut plugins = PluginsOptions::default();
        if let Some(styled_components) = &options.plugins.styled_components {
            plugins.styled_components = Some(styled_components.clone());
        }

        Ok(Self {
            cwd: options.cwd.clone().unwrap_or_default(),
            assumptions: options.assumptions,
            typescript,
            decorator,
            jsx,
            env: EnvOptions {
                module,
                regexp,
                es2015,
                es2016,
                es2017,
                es2018,
                es2019,
                es2020,
                es2021,
                es2022,
                es2026: ES2026Options {
                    explicit_resource_management: options.plugins.explicit_resource_management,
                },
            },
            proposals: ProposalOptions::default(),
            helper_loader,
            plugins,
        })
    }
}
