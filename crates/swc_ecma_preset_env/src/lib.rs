#![deny(clippy::all)]
#![allow(dead_code)]
#![recursion_limit = "256"]

use std::{path::PathBuf, sync::Arc};

use preset_env_base::query::targets_to_versions;
pub use preset_env_base::{query::Targets, version::Version, BrowserData, Versions};
use rustc_hash::FxHashSet;
use serde::Deserialize;
use swc_atoms::{atom, Atom};
use swc_common::{comments::Comments, pass::Optional, FromVariant, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    compat::{
        bugfixes,
        class_fields_use_set::class_fields_use_set,
        es2015::{self, generator::generator},
        es2016, es2017, es2018, es2019, es2020, es2022, es3,
        regexp::{self, regexp},
    },
    Assumptions,
};
use swc_ecma_utils::{prepend_stmts, ExprFactory};
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith, VisitWith};

pub use self::transform_data::Feature;

#[macro_use]
mod util;
mod corejs2;
mod corejs3;
mod node_colon_prefix_strip;
mod regenerator;
mod transform_data;

pub trait Caniuse {
    fn caniuse(&self, feature: Feature) -> bool;
}

fn transform_internal<C>(
    unresolved_mark: Mark,
    comments: Option<C>,
    assumptions: Assumptions,
    loose: bool,
    dynamic_import: bool,
    debug: bool,
    caniuse: impl (Fn(Feature) -> bool),
) -> impl Pass
where
    C: Comments + Clone,
{
    let pass = noop_pass();

    macro_rules! add {
        ($prev:expr, $feature:ident, $pass:expr) => {{
            add!($prev, $feature, $pass, false)
        }};
        ($prev:expr, $feature:ident, $pass:expr, $default:expr) => {{
            let f = transform_data::Feature::$feature;

            let enable = !caniuse(f);

            if debug {
                println!("{}: {:?}", f.as_str(), enable);
            }
            ($prev, Optional::new($pass, enable))
        }};
    }

    macro_rules! add_compiler {
        ($($feature:ident)|*) => {{
            let mut feature = swc_ecma_compiler::Features::empty();
            $(
                {
                    let f = transform_data::Feature::$feature;
                    let enable = !caniuse(f);

                    if debug {
                        println!("{}: {:?}", f.as_str(), enable);
                    }

                    if enable {
                        feature |= swc_ecma_compiler::Features::from(f);
                    }
                }
            )*
            feature
        }};
        (| $($feature:ident)|*) => {{
            add_compiler!($($feature)|*)
        }};
        ($prev:expr, $($feature:ident)|*) => {{
            let feature = add_compiler!($($feature)|*);
            (
                $prev,
                swc_ecma_compiler::Compiler::new(swc_ecma_compiler::Config {
                    includes: feature,
                    assumptions,
                    ..Default::default()
                }),
            )
        }};
        ($prev:expr, | $($feature:ident)|*) => {{
            add_compiler!($prev, $($feature)|*)
        }};
    }

    let pass = (
        pass,
        Optional::new(
            class_fields_use_set(assumptions.pure_getters),
            assumptions.set_public_class_fields,
        ),
    );

    let pass = {
        let enable_dot_all_regex = !caniuse(Feature::DotAllRegex);
        let enable_named_capturing_groups_regex = !caniuse(Feature::NamedCapturingGroupsRegex);
        let enable_sticky_regex = !caniuse(Feature::StickyRegex);
        let enable_unicode_property_regex = !caniuse(Feature::UnicodePropertyRegex);
        let enable_unicode_regex = !caniuse(Feature::UnicodeRegex);
        let enable_unicode_sets_regex = !caniuse(Feature::UnicodeSetsRegex);

        let enable = enable_dot_all_regex
            || enable_named_capturing_groups_regex
            || enable_sticky_regex
            || enable_unicode_property_regex
            || enable_unicode_regex;

        (
            pass,
            Optional::new(
                regexp(regexp::Config {
                    dot_all_regex: enable_dot_all_regex,
                    // TODO: add Feature:HasIndicesRegex
                    has_indices: false,
                    // TODO: add Feature::LookbehindAssertion
                    lookbehind_assertion: false,
                    named_capturing_groups_regex: enable_named_capturing_groups_regex,
                    sticky_regex: enable_sticky_regex,
                    unicode_property_regex: enable_unicode_property_regex,
                    unicode_regex: enable_unicode_regex,
                    unicode_sets_regex: enable_unicode_sets_regex,
                }),
                enable,
            ),
        )
    };

    // Proposals

    // ES2022
    // static block needs to be placed before class property
    // because it transforms into private static property

    let pass = add_compiler!(pass, ClassStaticBlock);
    let pass = add!(
        pass,
        ClassProperties,
        es2022::class_properties(
            es2022::class_properties::Config {
                private_as_properties: loose || assumptions.private_fields_as_properties,
                set_public_fields: loose || assumptions.set_public_class_fields,
                constant_super: loose || assumptions.constant_super,
                no_document_all: loose || assumptions.no_document_all,
                pure_getter: loose || assumptions.pure_getters,
            },
            unresolved_mark
        )
    );

    #[rustfmt::skip]
    let pass = add_compiler!(
        pass,
        /* ES2022 */ | PrivatePropertyInObject
        /* ES2021 */ | LogicalAssignmentOperators
        /* ES2020 */ | ExportNamespaceFrom
    );

    // ES2020
    let pass = add!(
        pass,
        NullishCoalescing,
        es2020::nullish_coalescing(es2020::nullish_coalescing::Config {
            no_document_all: loose || assumptions.no_document_all
        })
    );

    let pass = add!(
        pass,
        OptionalChaining,
        es2020::optional_chaining(
            es2020::optional_chaining::Config {
                no_document_all: loose || assumptions.no_document_all,
                pure_getter: loose || assumptions.pure_getters
            },
            unresolved_mark
        )
    );

    // ES2019
    let pass = add!(pass, OptionalCatchBinding, es2019::optional_catch_binding());

    // ES2018
    let pass = add!(
        pass,
        ObjectRestSpread,
        es2018::object_rest_spread(es2018::object_rest_spread::Config {
            no_symbol: loose || assumptions.object_rest_no_symbols,
            set_property: loose || assumptions.set_spread_properties,
            pure_getters: loose || assumptions.pure_getters
        })
    );

    // ES2017
    let pass = add!(
        pass,
        AsyncToGenerator,
        es2017::async_to_generator(
            es2017::async_to_generator::Config {
                ignore_function_length: loose || assumptions.ignore_function_length,
            },
            unresolved_mark
        )
    );

    // ES2016
    let pass = add!(pass, ExponentiationOperator, es2016::exponentiation());

    // ES2015
    let pass = add!(pass, BlockScopedFunctions, es2015::block_scoped_functions());
    let pass = add!(
        pass,
        TemplateLiterals,
        es2015::template_literal(es2015::template_literal::Config {
            ignore_to_primitive: loose || assumptions.ignore_to_primitive_hint,
            mutable_template: loose || assumptions.mutable_template_object
        }),
        true
    );
    let pass = add!(
        pass,
        Classes,
        es2015::classes(es2015::classes::Config {
            constant_super: loose || assumptions.constant_super,
            no_class_calls: loose || assumptions.no_class_calls,
            set_class_methods: loose || assumptions.set_class_methods,
            super_is_callable_constructor: loose || assumptions.super_is_callable_constructor,
        })
    );
    let pass = add!(pass, NewTarget, es2015::new_target(), true);
    let pass = add!(
        pass,
        Spread,
        es2015::spread(es2015::spread::Config { loose }),
        true
    );
    let pass = add!(pass, ObjectSuper, es2015::object_super());
    let pass = add!(pass, ShorthandProperties, es2015::shorthand());
    let pass = add!(pass, FunctionName, es2015::function_name());
    let pass = add!(
        pass,
        ForOf,
        es2015::for_of(es2015::for_of::Config {
            loose,
            assume_array: loose || assumptions.iterable_is_array
        }),
        true
    );
    let pass = add!(
        pass,
        Parameters,
        es2015::parameters(
            es2015::parameters::Config {
                ignore_function_length: loose || assumptions.ignore_function_length
            },
            unresolved_mark
        )
    );
    let pass = add!(pass, ArrowFunctions, es2015::arrow(unresolved_mark));
    let pass = add!(pass, DuplicateKeys, es2015::duplicate_keys());
    let pass = add!(pass, StickyRegex, es2015::sticky_regex());
    let pass = add!(pass, TypeOfSymbol, es2015::instance_of());
    let pass = add!(pass, TypeOfSymbol, es2015::typeof_symbol());
    let pass = add!(
        pass,
        ComputedProperties,
        es2015::computed_properties(es2015::computed_props::Config { loose }),
        true
    );
    let pass = add!(
        pass,
        Destructuring,
        es2015::destructuring(es2015::destructuring::Config { loose }),
        true
    );
    let pass = add!(
        pass,
        BlockScoping,
        es2015::block_scoping(unresolved_mark),
        true
    );
    let pass = add!(
        pass,
        Regenerator,
        generator(unresolved_mark, comments),
        true
    );

    // TODO:
    //    Literals,
    //    ObjectSuper,
    //    DotAllRegex,
    //    UnicodeRegex,
    //    AsyncGeneratorFunctions,
    //    UnicodePropertyRegex,
    //    JsonStrings,
    //    NamedCapturingGroupsRegex,

    // ES 3
    let pass = add!(pass, PropertyLiterals, es3::property_literals());
    let pass = add!(
        pass,
        MemberExpressionLiterals,
        es3::member_expression_literals()
    );
    let pass = add!(pass, ReservedWords, es3::reserved_words(dynamic_import));

    // Bugfixes
    let pass = add!(pass, BugfixEdgeDefaultParam, bugfixes::edge_default_param());
    let pass = add!(
        pass,
        BugfixAsyncArrowsInClass,
        bugfixes::async_arrows_in_class(unresolved_mark)
    );
    let pass = add!(
        pass,
        BugfixTaggedTemplateCaching,
        bugfixes::template_literal_caching()
    );

    add!(
        pass,
        BugfixSafariIdDestructuringCollisionInFunctionExpression,
        bugfixes::safari_id_destructuring_collision_in_function_expression()
    )
}

pub fn transform_from_env<C>(
    unresolved_mark: Mark,
    comments: Option<C>,
    env_config: EnvConfig,
    assumptions: Assumptions,
) -> impl Pass
where
    C: Comments + Clone,
{
    let pass = Optional::new(
        node_colon_prefix_strip::strip_node_colon_prefix(unresolved_mark),
        env_config.feature_config.targets.node.is_some_and(|v| {
            // Manually copied from https://nodejs.org/api/esm.html#node-imports
            v < Version {
                major: 14,
                minor: 18,
                patch: 0,
            } || v.major == 15
        }),
    );

    let pass = (
        pass,
        transform_internal(
            unresolved_mark,
            comments,
            assumptions,
            env_config.config.loose,
            env_config.config.dynamic_import,
            env_config.config.debug,
            move |f| env_config.feature_config.caniuse(f),
        ),
    );

    if env_config.config.debug {
        println!("Targets: {:?}", &env_config.core_js_config.targets);
    }

    (
        pass,
        visit_mut_pass(Polyfills {
            mode: env_config.config.mode,
            regenerator: false,
            corejs: env_config.config.core_js.unwrap_or(Version {
                major: 3,
                minor: 0,
                patch: 0,
            }),
            shipped_proposals: env_config.config.shipped_proposals,
            targets: env_config.core_js_config.targets,
            includes: env_config.core_js_config.included_modules,
            excludes: env_config.core_js_config.excluded_modules,
            unresolved_mark,
        }),
    )
}

pub fn transform_from_es_version<C>(
    unresolved_mark: Mark,
    comments: Option<C>,
    es_version: EsVersion,
    assumptions: Assumptions,
    loose: bool,
) -> impl Pass
where
    C: Comments + Clone,
{
    transform_internal(
        unresolved_mark,
        comments,
        assumptions,
        loose,
        true,
        false,
        move |f| es_version.caniuse(f),
    )
}

#[derive(Debug)]
struct Polyfills {
    mode: Option<Mode>,
    targets: Arc<Versions>,
    shipped_proposals: bool,
    corejs: Version,
    regenerator: bool,
    includes: FxHashSet<String>,
    excludes: FxHashSet<String>,
    unresolved_mark: Mark,
}
impl Polyfills {
    fn collect<T>(&mut self, m: &mut T) -> Vec<Atom>
    where
        T: VisitWith<corejs2::UsageVisitor>
            + VisitWith<corejs3::UsageVisitor>
            + VisitMutWith<corejs2::Entry>
            + VisitMutWith<corejs3::Entry>,
    {
        let required = match self.mode {
            None => Default::default(),
            Some(Mode::Usage) => {
                let mut r = match self.corejs {
                    Version { major: 2, .. } => {
                        let mut v = corejs2::UsageVisitor::new(self.targets.clone());
                        m.visit_with(&mut v);

                        v.required
                    }
                    Version { major: 3, .. } => {
                        let mut v = corejs3::UsageVisitor::new(
                            self.targets.clone(),
                            self.shipped_proposals,
                            self.corejs,
                        );
                        m.visit_with(&mut v);
                        v.required
                    }

                    _ => unimplemented!("corejs version other than 2 / 3"),
                };

                if regenerator::is_required(m) {
                    r.insert("regenerator-runtime/runtime.js");
                }

                r
            }
            Some(Mode::Entry) => match self.corejs {
                Version { major: 2, .. } => {
                    let mut v = corejs2::Entry::new(self.targets.clone(), self.regenerator);
                    m.visit_mut_with(&mut v);
                    v.imports
                }

                Version { major: 3, .. } => {
                    let mut v =
                        corejs3::Entry::new(self.targets.clone(), self.corejs, !self.regenerator);
                    m.visit_mut_with(&mut v);
                    v.imports
                }

                _ => unimplemented!("corejs version other than 2 / 3"),
            },
        };
        required
            .iter()
            .filter(|s| {
                !s.starts_with("esnext") || !required.contains(&s.replace("esnext", "es").as_str())
            })
            .filter(|s| !self.excludes.contains(&***s))
            .map(|s| -> Atom {
                if *s != "regenerator-runtime/runtime.js" {
                    format!("core-js/modules/{s}.js").into()
                } else {
                    "regenerator-runtime/runtime.js".to_string().into()
                }
            })
            .chain(self.includes.iter().map(|s| {
                if s != "regenerator-runtime/runtime.js" {
                    format!("core-js/modules/{s}.js").into()
                } else {
                    "regenerator-runtime/runtime.js".to_string().into()
                }
            }))
            .collect::<Vec<_>>()
    }
}
impl VisitMut for Polyfills {
    fn visit_mut_module(&mut self, m: &mut Module) {
        let span = m.span;
        let required = self.collect(m);
        if cfg!(debug_assertions) {
            let mut v = required.into_iter().collect::<Vec<_>>();
            v.sort();
            prepend_stmts(
                &mut m.body,
                v.into_iter().map(|src| {
                    ImportDecl {
                        span,
                        specifiers: Vec::new(),
                        src: Str {
                            span: DUMMY_SP,
                            raw: None,
                            lone_surrogates: false,
                            value: src,
                        }
                        .into(),
                        type_only: false,
                        with: None,
                        phase: Default::default(),
                    }
                    .into()
                }),
            );
        } else {
            prepend_stmts(
                &mut m.body,
                required.into_iter().map(|src| {
                    ImportDecl {
                        span,
                        specifiers: Vec::new(),
                        src: Str {
                            span: DUMMY_SP,
                            raw: None,
                            lone_surrogates: false,
                            value: src,
                        }
                        .into(),
                        type_only: false,
                        with: None,
                        phase: Default::default(),
                    }
                    .into()
                }),
            );
        }

        m.body.retain(|item| !matches!(item, ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { src, .. })) if src.span == DUMMY_SP && src.value == atom!("")));
    }

    fn visit_mut_script(&mut self, m: &mut Script) {
        let span = m.span;
        let required = self.collect(m);
        if cfg!(debug_assertions) {
            let mut v = required.into_iter().collect::<Vec<_>>();
            v.sort();
            prepend_stmts(
                &mut m.body,
                v.into_iter().map(|src| {
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: CallExpr {
                            span,
                            callee: Ident {
                                ctxt: SyntaxContext::empty().apply_mark(self.unresolved_mark),
                                sym: atom!("require"),
                                ..Default::default()
                            }
                            .as_callee(),
                            args: vec![Str {
                                span: DUMMY_SP,
                                value: src,
                                raw: None,
                                lone_surrogates: false,
                            }
                            .as_arg()],
                            type_args: None,
                            ..Default::default()
                        }
                        .into(),
                    }
                    .into()
                }),
            );
        } else {
            prepend_stmts(
                &mut m.body,
                required.into_iter().map(|src| {
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: CallExpr {
                            span,
                            callee: Ident {
                                ctxt: SyntaxContext::empty().apply_mark(self.unresolved_mark),
                                sym: atom!("require"),
                                ..Default::default()
                            }
                            .as_callee(),
                            args: vec![Str {
                                span: DUMMY_SP,
                                value: src,
                                raw: None,
                                lone_surrogates: false,
                            }
                            .as_arg()],
                            ..Default::default()
                        }
                        .into(),
                    }
                    .into()
                }),
            );
        }
    }
}

#[derive(Debug, Clone, Copy, Deserialize, PartialEq, Eq)]
pub enum Mode {
    #[serde(rename = "usage")]
    Usage,
    #[serde(rename = "entry")]
    Entry,
}

#[derive(Debug, Clone, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub mode: Option<Mode>,

    #[serde(default)]
    pub debug: bool,

    #[serde(default)]
    pub dynamic_import: bool,

    #[serde(default)]
    pub loose: bool,

    /// Skipped es features.
    ///
    /// e.g.)
    ///  - `core-js/modules/foo`
    #[serde(default)]
    pub skip: Vec<Atom>,

    #[serde(default)]
    pub include: Vec<FeatureOrModule>,

    #[serde(default)]
    pub exclude: Vec<FeatureOrModule>,

    /// The version of the used core js.
    #[serde(default)]
    pub core_js: Option<Version>,

    #[serde(default)]
    pub targets: Option<Targets>,

    #[serde(default)]
    pub path: Option<PathBuf>,

    #[serde(default)]
    pub shipped_proposals: bool,

    #[serde(default)]
    pub force_all_transforms: bool,

    #[serde(default)]
    pub bugfixes: bool,
}

#[derive(Debug, Clone, Default)]
pub struct FeatureConfig {
    targets: Arc<Versions>,
    include: Vec<Feature>,
    exclude: Vec<Feature>,
    is_any_target: bool,
    force_all_transforms: bool,
    bugfixes: bool,
}

struct CoreJSConfig {
    targets: Arc<Versions>,
    included_modules: FxHashSet<String>,
    excluded_modules: FxHashSet<String>,
}

pub struct EnvConfig {
    config: Config,
    feature_config: Arc<FeatureConfig>,
    core_js_config: CoreJSConfig,
}

impl From<Config> for EnvConfig {
    fn from(mut config: Config) -> Self {
        let targets = targets_to_versions(config.targets.take(), config.path.take())
            .expect("failed to parse targets");
        let is_any_target = targets.is_any_target();

        let (include, included_modules) = FeatureOrModule::split(config.include.clone());
        let (exclude, excluded_modules) = FeatureOrModule::split(config.exclude.clone());

        let feature_config = FeatureConfig {
            targets: Arc::clone(&targets),
            include,
            exclude,
            is_any_target,
            force_all_transforms: config.force_all_transforms,
            bugfixes: config.bugfixes,
        };
        let core_js_config = CoreJSConfig {
            targets: Arc::clone(&targets),
            included_modules,
            excluded_modules,
        };
        Self {
            config,
            feature_config: Arc::new(feature_config),
            core_js_config,
        }
    }
}

impl EnvConfig {
    pub fn get_feature_config(&self) -> Arc<FeatureConfig> {
        Arc::clone(&self.feature_config)
    }
}

impl Caniuse for FeatureConfig {
    fn caniuse(&self, feature: Feature) -> bool {
        if self.exclude.contains(&feature) {
            return true;
        }

        if self.force_all_transforms || self.is_any_target {
            return false;
        }

        if self.include.contains(&feature) {
            return false;
        }

        !feature.should_enable(&self.targets, self.bugfixes, false)
    }
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum FeatureOrModule {
    Feature(Feature),
    CoreJsModule(String),
}

impl FeatureOrModule {
    pub fn split(vec: Vec<FeatureOrModule>) -> (Vec<Feature>, FxHashSet<String>) {
        let mut features: Vec<_> = Default::default();
        let mut modules: FxHashSet<_> = Default::default();

        for v in vec {
            match v {
                FeatureOrModule::Feature(f) => features.push(f),
                FeatureOrModule::CoreJsModule(m) => {
                    modules.insert(m);
                }
            }
        }

        (features, modules)
    }
}

impl Caniuse for EsVersion {
    fn caniuse(&self, feature: Feature) -> bool {
        // EsNext supports all features
        if self == &EsVersion::EsNext {
            return true;
        }

        match feature {
            // ES2022
            Feature::ClassProperties
            | Feature::ClassStaticBlock
            | Feature::PrivatePropertyInObject => *self >= EsVersion::Es2022,

            // ES2021
            Feature::LogicalAssignmentOperators => *self >= EsVersion::Es2021,

            // ES2020
            Feature::ExportNamespaceFrom
            | Feature::NullishCoalescing
            | Feature::OptionalChaining => *self >= EsVersion::Es2020,

            // ES2019
            Feature::OptionalCatchBinding => *self >= EsVersion::Es2019,

            // ES2018
            Feature::ObjectRestSpread
            | Feature::DotAllRegex
            | Feature::NamedCapturingGroupsRegex
            | Feature::UnicodePropertyRegex => *self >= EsVersion::Es2018,

            // ES2017
            Feature::AsyncToGenerator => *self >= EsVersion::Es2017,

            // ES2016
            Feature::ExponentiationOperator => *self >= EsVersion::Es2016,

            // ES2015
            Feature::ArrowFunctions
            | Feature::BlockScopedFunctions
            | Feature::BlockScoping
            | Feature::Classes
            | Feature::ComputedProperties
            | Feature::Destructuring
            | Feature::DuplicateKeys
            | Feature::ForOf
            | Feature::FunctionName
            | Feature::NewTarget
            | Feature::ObjectSuper
            | Feature::Parameters
            | Feature::Regenerator
            | Feature::ShorthandProperties
            | Feature::Spread
            | Feature::StickyRegex
            | Feature::TemplateLiterals
            | Feature::TypeOfSymbol
            | Feature::UnicodeRegex => *self >= EsVersion::Es2015,

            // ES5
            Feature::PropertyLiterals
            | Feature::MemberExpressionLiterals
            | Feature::ReservedWords => *self >= EsVersion::Es5,

            // bugfix not exists in EsVsersion
            Feature::BugfixAsyncArrowsInClass
            | Feature::BugfixEdgeDefaultParam
            | Feature::BugfixTaggedTemplateCaching
            | Feature::BugfixSafariIdDestructuringCollisionInFunctionExpression
            | Feature::BugfixTransformEdgeFunctionName
            | Feature::BugfixTransformSafariBlockShadowing
            | Feature::BugfixTransformSafariForShadowing
            | Feature::BugfixTransformV8SpreadParametersInOptionalChaining
            | Feature::BugfixTransformV8StaticClassFieldsRedefineReadonly
            | Feature::BugfixTransformFirefoxClassInComputedClassKey
            | Feature::BugfixTransformSafariClassFieldInitializerScope => true,

            _ => true,
        }
    }
}
