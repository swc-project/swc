#![deny(clippy::all)]
#![allow(dead_code)]
#![recursion_limit = "256"]

use std::{path::PathBuf, sync::Arc};

use preset_env_base::query::targets_to_versions;
pub use preset_env_base::{
    query::{TargetInfo, Targets},
    version::Version,
    BrowserData, Versions,
};
use rustc_hash::FxHashSet;
use serde::Deserialize;
use swc_atoms::{atom, Atom};
use swc_common::{comments::Comments, pass::Optional, FromVariant, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
#[cfg(feature = "es3")]
use swc_ecma_transforms::compat::es3;
use swc_ecma_transforms::{
    compat::{
        bugfixes,
        class_fields_use_set::class_fields_use_set,
        es2015::{self, generator::generator},
        es2020, es2022,
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
    #[cfg_attr(not(feature = "es3"), allow(unused_variables))] dynamic_import: bool,
    debug: bool,
    caniuse: impl (Fn(Feature) -> bool),
) -> impl Pass
where
    C: Comments + Clone,
{
    let pass = noop_pass();
    let mut options = swc_ecma_transformer::Options::default();

    options.unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
    options.assumptions = assumptions;

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

    let pass = (
        pass,
        Optional::new(
            class_fields_use_set(assumptions.pure_getters),
            assumptions.set_public_class_fields,
        ),
    );

    {
        let t = &mut options.env.regexp;

        t.dot_all_regex = !caniuse(Feature::DotAllRegex);
        t.named_capturing_groups_regex = !caniuse(Feature::NamedCapturingGroupsRegex);
        t.sticky_regex = !caniuse(Feature::StickyRegex);
        t.unicode_property_regex = !caniuse(Feature::UnicodePropertyRegex);
        t.unicode_regex = !caniuse(Feature::UnicodeRegex);
        t.unicode_sets_regex = !caniuse(Feature::UnicodeSetsRegex);
        // TODO: add Feature:HasIndicesRegex
        t.has_indices = false;
        // TODO: add Feature::LookbehindAssertion
        t.lookbehind_assertion = false;
    }

    // Proposals

    // ES2022
    // static block needs to be placed before class property
    // because it transforms into private static property

    let pass = add!(pass, ClassStaticBlock, es2022::static_blocks());
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

    if !caniuse(Feature::PrivatePropertyInObject) {
        options.env.es2022.private_property_in_object = true;
    }

    if !caniuse(Feature::LogicalAssignmentOperators) {
        options.env.es2021.logical_assignment_operators = true;
    }

    if !caniuse(Feature::ExportNamespaceFrom) {
        options.env.es2020.export_namespace_from = true;
    }

    // ES2020
    if !caniuse(Feature::NullishCoalescing) {
        options.env.es2020.nullish_coalescing = true;
    }

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
    if !caniuse(Feature::OptionalCatchBinding) {
        options.env.es2019.optional_catch_binding = true;
    }

    // ES2018
    if !caniuse(Feature::ObjectRestSpread) {
        options.env.es2018.object_rest_spread = true;
    }

    if !caniuse(Feature::AsyncToGenerator) {
        options.env.es2017.async_to_generator = true;
    }

    // ES2016
    if !caniuse(Feature::ExponentiationOperator) {
        options.env.es2016.exponentiation_operator = true;
    }

    // Single-pass compiler - skip traversal when no transforms are enabled
    let is_enabled = options.env.is_enabled();
    let pass = (pass, Optional::new(options.into_pass(), is_enabled));

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
        es2015::spread(es2015::spread::Config { loose }, unresolved_mark),
        true
    );
    let pass = add!(pass, ObjectSuper, es2015::object_super());
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
    let pass = {
        // We use a separate options for es2015 transforms because of the pass order.
        let mut options = swc_ecma_transformer::Options::default();

        options.unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
        options.assumptions = assumptions;

        if !caniuse(Feature::ShorthandProperties) {
            options.env.es2015.shorthand = true;
        }

        if !caniuse(Feature::FunctionName) {
            options.env.es2015.function_name = true;
        }

        if !caniuse(Feature::DuplicateKeys) {
            options.env.es2015.duplicate_keys = true;
        }

        if !caniuse(Feature::StickyRegex) {
            options.env.es2015.sticky_regex = true;
        }

        if !caniuse(Feature::TypeOfSymbol) {
            options.env.es2015.instanceof = true;
            options.env.es2015.typeof_symbol = true;
        }

        // Skip traversal when no transforms are enabled
        let is_enabled = options.env.is_enabled();
        (pass, Optional::new(options.into_pass(), is_enabled))
    };

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
    #[cfg(feature = "es3")]
    let pass = add!(pass, PropertyLiterals, es3::property_literals());
    #[cfg(feature = "es3")]
    let pass = add!(
        pass,
        MemberExpressionLiterals,
        es3::member_expression_literals()
    );
    #[cfg(feature = "es3")]
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
            unknown_version: env_config.core_js_config.unknown_version,
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
    /// True if the browserslist query returned an empty result (unknown browser
    /// version). When this is true, we should add no polyfills, similar to
    /// Babel's behavior.
    unknown_version: bool,
}
impl Polyfills {
    fn collect<T>(&mut self, m: &mut T) -> Vec<Atom>
    where
        T: VisitWith<corejs2::UsageVisitor>
            + VisitWith<corejs3::UsageVisitor>
            + VisitMutWith<corejs2::Entry>
            + VisitMutWith<corejs3::Entry>,
    {
        // If browserslist returned empty (unknown browser version), don't add any
        // polyfills. This matches Babel's behavior where unknown versions are
        // assumed to support all features.
        if self.unknown_version {
            return Default::default();
        }

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
                            value: src.into(),
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
                            value: src.into(),
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

        m.body.retain(|item| !matches!(item, ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { src, .. })) if src.span == DUMMY_SP && src.value .is_empty()));
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
                                value: src.into(),
                                raw: None,
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
                                value: src.into(),
                                raw: None,
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
    /// True if the browserslist query returned an empty result (unknown browser
    /// version). When this is true, we should assume the browser is a
    /// recent version that supports all modern features (no transforms
    /// needed), similar to Babel's behavior.
    unknown_version: bool,
    force_all_transforms: bool,
    bugfixes: bool,
}

struct CoreJSConfig {
    targets: Arc<Versions>,
    included_modules: FxHashSet<String>,
    excluded_modules: FxHashSet<String>,
    /// True if the browserslist query returned an empty result (unknown browser
    /// version).
    unknown_version: bool,
}

pub struct EnvConfig {
    config: Config,
    feature_config: Arc<FeatureConfig>,
    core_js_config: CoreJSConfig,
}

impl From<Config> for EnvConfig {
    fn from(mut config: Config) -> Self {
        let target_info = targets_to_versions(config.targets.take(), config.path.take())
            .expect("failed to parse targets");
        let is_any_target = target_info.versions.is_any_target();

        let (include, included_modules) = FeatureOrModule::split(config.include.clone());
        let (exclude, excluded_modules) = FeatureOrModule::split(config.exclude.clone());

        let feature_config = FeatureConfig {
            targets: Arc::clone(&target_info.versions),
            include,
            exclude,
            is_any_target,
            unknown_version: target_info.unknown_version,
            force_all_transforms: config.force_all_transforms,
            bugfixes: config.bugfixes,
        };
        let core_js_config = CoreJSConfig {
            targets: Arc::clone(&target_info.versions),
            included_modules,
            excluded_modules,
            unknown_version: target_info.unknown_version,
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

        // If browserslist returned empty (unknown browser version), assume all
        // features are supported (like Babel does). This handles cases like
        // "Chrome > 130" where the version is newer than the browserslist database.
        if self.unknown_version {
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
