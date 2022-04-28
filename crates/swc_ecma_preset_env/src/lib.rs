#![deny(clippy::all)]
#![allow(dead_code)]
#![recursion_limit = "256"]

use std::path::PathBuf;

use preset_env_base::query::{targets_to_versions, Query};
pub use preset_env_base::{query::Targets, version::Version, BrowserData, Versions};
use serde::Deserialize;
use swc_atoms::{js_word, JsWord};
use swc_common::{chain, collections::AHashSet, comments::Comments, FromVariant, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    compat::{
        bugfixes, es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es3,
        regexp::{self, regexp},
    },
    pass::{noop, Optional},
    Assumptions,
};
use swc_ecma_utils::prepend_stmts;
use swc_ecma_visit::{Fold, FoldWith, VisitWith};

pub use self::transform_data::Feature;

#[macro_use]
mod util;
mod corejs2;
mod corejs3;
mod regenerator;
mod transform_data;

pub fn preset_env<C>(
    global_mark: Mark,
    comments: Option<C>,
    c: Config,
    assumptions: Assumptions,
) -> impl Fold
where
    C: Comments + Clone,
{
    let loose = c.loose;
    let targets: Versions = targets_to_versions(c.targets).expect("failed to parse targets");
    let is_any_target = targets.is_any_target();

    let (include, included_modules) = FeatureOrModule::split(c.include);
    let (exclude, excluded_modules) = FeatureOrModule::split(c.exclude);

    let pass = noop();

    macro_rules! should_enable {
        ($feature:ident, $default:expr) => {{
            let f = transform_data::Feature::$feature;
            !exclude.contains(&f)
                && (c.force_all_transforms
                    || (is_any_target
                        || include.contains(&f)
                        || f.should_enable(targets, c.bugfixes, $default)))
        }};
    }

    macro_rules! add {
        ($prev:expr, $feature:ident, $pass:expr) => {{
            add!($prev, $feature, $pass, false)
        }};
        ($prev:expr, $feature:ident, $pass:expr, $default:expr) => {{
            let f = transform_data::Feature::$feature;

            let enable = should_enable!($feature, $default);
            if c.debug {
                println!("{}: {:?}", f.as_str(), enable);
            }
            chain!($prev, Optional::new($pass, enable))
        }};
    }

    let pass = {
        let enable_dot_all_regex = should_enable!(DotAllRegex, false);
        let enable_named_capturing_groups_regex = should_enable!(NamedCapturingGroupsRegex, false);
        let enable_sticky_regex = should_enable!(StickyRegex, false);
        let enable_unicode_property_regex = should_enable!(UnicodePropertyRegex, false);
        let enable_unicode_regex = should_enable!(UnicodeRegex, false);

        let enable = enable_dot_all_regex
            || enable_named_capturing_groups_regex
            || enable_sticky_regex
            || enable_unicode_property_regex
            || enable_unicode_regex;

        chain!(
            pass,
            Optional::new(
                regexp(regexp::Config {
                    dot_all_regex: enable_dot_all_regex,

                    // TODO: add Feature::LookbehindAssertion
                    lookbehind_assertion: false,
                    named_capturing_groups_regex: enable_named_capturing_groups_regex,
                    sticky_regex: enable_sticky_regex,
                    unicode_property_regex: enable_unicode_property_regex,
                    unicode_regex: enable_unicode_regex,
                }),
                enable
            )
        )
    };

    // Proposals

    // ES2022
    // static block needs to be placed before class property
    // because it transforms into private static property
    let pass = add!(pass, ClassStaticBlock, es2022::static_blocks());
    let pass = add!(
        pass,
        ClassProperties,
        es2022::class_properties(
            comments.clone(),
            es2022::class_properties::Config {
                private_as_properties: loose || assumptions.private_fields_as_properties,
                set_public_fields: loose || assumptions.set_public_class_fields,
                constant_super: loose || assumptions.constant_super,
                no_document_all: loose || assumptions.no_document_all
            }
        )
    );
    let pass = add!(pass, PrivatePropertyInObject, es2022::private_in_object());

    // ES2021
    let pass = add!(
        pass,
        LogicalAssignmentOperators,
        es2021::logical_assignments()
    );

    // ES2020

    let pass = add!(pass, ExportNamespaceFrom, es2020::export_namespace_from());
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
        es2020::optional_chaining(es2020::opt_chaining::Config {
            no_document_all: loose || assumptions.no_document_all,
            pure_getter: loose || assumptions.pure_getters
        })
    );

    // ES2019
    let pass = add!(pass, OptionalCatchBinding, es2019::optional_catch_binding());

    // ES2018
    let pass = add!(
        pass,
        ObjectRestSpread,
        es2018::object_rest_spread(es2018::object_rest_spread::Config {
            no_symbol: loose || assumptions.object_rest_no_symbols,
            set_property: loose || assumptions.set_spread_properties
        })
    );

    // ES2017
    let pass = add!(
        pass,
        AsyncToGenerator,
        es2017::async_to_generator(es2017::async_to_generator::Config {
            ignore_function_name: loose || assumptions.ignore_function_name,
            ignore_function_length: loose || assumptions.ignore_function_length,
        })
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
        es2015::classes(
            comments,
            es2015::classes::Config {
                constant_super: loose || assumptions.constant_super,
                no_class_calls: loose || assumptions.no_class_calls,
                set_class_methods: loose || assumptions.set_class_methods,
                super_is_callable_constructor: loose || assumptions.super_is_callable_constructor,
            }
        )
    );
    let pass = add!(
        pass,
        Spread,
        es2015::spread(es2015::spread::Config { loose }),
        true
    );
    let pass = add!(pass, ObjectSuper, es2015::object_super());
    let pass = add!(pass, FunctionName, es2015::function_name());
    let pass = add!(pass, ArrowFunctions, es2015::arrow());
    let pass = add!(pass, DuplicateKeys, es2015::duplicate_keys());
    let pass = add!(pass, StickyRegex, es2015::sticky_regex());
    // TODO:    InstanceOf,
    let pass = add!(pass, TypeOfSymbol, es2015::typeof_symbol());
    let pass = add!(pass, ShorthandProperties, es2015::shorthand());
    let pass = add!(
        pass,
        Parameters,
        es2015::parameters(es2015::parameters::Config {
            ignore_function_length: loose || assumptions.ignore_function_length
        })
    );
    let pass = add!(
        pass,
        ForOf,
        es2015::for_of(es2015::for_of::Config {
            assume_array: loose || assumptions.iterable_is_array
        }),
        true
    );
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
        Regenerator,
        es2015::regenerator(Default::default(), global_mark),
        true
    );
    let pass = add!(pass, BlockScoping, es2015::block_scoping(), true);

    let pass = add!(pass, NewTarget, es2015::new_target(), true);

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
    let pass = add!(pass, ReservedWords, es3::reserved_words(c.dynamic_import));

    // Bugfixes
    let pass = add!(pass, BugfixEdgeDefaultParam, bugfixes::edge_default_param());
    let pass = add!(
        pass,
        BugfixAsyncArrowsInClass,
        bugfixes::async_arrows_in_class()
    );
    let pass = add!(
        pass,
        BugfixTaggedTemplateCaching,
        bugfixes::template_literal_caching()
    );
    let pass = add!(
        pass,
        BugfixSafariIdDestructuringCollisionInFunctionExpression,
        bugfixes::safari_id_destructuring_collision_in_function_expression()
    );

    if c.debug {
        println!("Targets: {:?}", targets);
    }

    chain!(
        pass,
        Polyfills {
            mode: c.mode,
            regenerator: should_enable!(Regenerator, true),
            corejs: c.core_js.unwrap_or(Version {
                major: 3,
                minor: 0,
                patch: 0
            }),
            shipped_proposals: c.shipped_proposals,
            targets,
            includes: included_modules,
            excludes: excluded_modules,
        }
    )
}

#[derive(Debug)]
struct Polyfills {
    mode: Option<Mode>,
    targets: Versions,
    shipped_proposals: bool,
    corejs: Version,
    regenerator: bool,
    includes: AHashSet<String>,
    excludes: AHashSet<String>,
}

impl Fold for Polyfills {
    fn fold_module(&mut self, mut m: Module) -> Module {
        let span = m.span;

        let required = match self.mode {
            None => Default::default(),
            Some(Mode::Usage) => {
                let mut r = match self.corejs {
                    Version { major: 2, .. } => {
                        let mut v = corejs2::UsageVisitor::new(self.targets);
                        m.visit_with(&mut v);

                        v.required
                    }
                    Version { major: 3, .. } => {
                        let mut v = corejs3::UsageVisitor::new(
                            self.targets,
                            self.shipped_proposals,
                            self.corejs,
                        );
                        m.visit_with(&mut v);
                        v.required
                    }

                    _ => unimplemented!("corejs version other than 2 / 3"),
                };

                if regenerator::is_required(&m) {
                    r.insert("regenerator-runtime/runtime.js");
                }

                r
            }
            Some(Mode::Entry) => match self.corejs {
                Version { major: 2, .. } => {
                    let mut v = corejs2::Entry::new(self.targets, self.regenerator);
                    m = m.fold_with(&mut v);
                    v.imports
                }

                Version { major: 3, .. } => {
                    let mut v = corejs3::Entry::new(self.targets, self.corejs, !self.regenerator);
                    m = m.fold_with(&mut v);
                    v.imports
                }

                _ => unimplemented!("corejs version other than 2 / 3"),
            },
        };
        let required = required
            .into_iter()
            .filter(|s| !self.excludes.contains(&**s))
            .map(|s| -> JsWord {
                if s != "regenerator-runtime/runtime.js" {
                    format!("core-js/modules/{}.js", s).into()
                } else {
                    "regenerator-runtime/runtime.js".to_string().into()
                }
            })
            .chain(self.includes.iter().map(|s| {
                if s != "regenerator-runtime/runtime.js" {
                    format!("core-js/modules/{}.js", s).into()
                } else {
                    "regenerator-runtime/runtime.js".to_string().into()
                }
            }))
            .collect::<Vec<_>>();

        if cfg!(debug_assertions) {
            let mut v = required.into_iter().collect::<Vec<_>>();
            v.sort();
            prepend_stmts(
                &mut m.body,
                v.into_iter().map(|src| {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span,
                        specifiers: vec![],
                        src: Str {
                            span: DUMMY_SP,
                            raw: None,
                            value: src,
                        },
                        type_only: false,
                        asserts: None,
                    }))
                }),
            );
        } else {
            prepend_stmts(
                &mut m.body,
                required.into_iter().map(|src| {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span,
                        specifiers: vec![],
                        src: Str {
                            span: DUMMY_SP,
                            raw: None,
                            value: src,
                        },
                        type_only: false,
                        asserts: None,
                    }))
                }),
            );
        }

        m.body.retain(|item| {
            !matches!(
                item,
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    src: Str {
                        span: DUMMY_SP,
                        value: js_word!(""),
                        ..
                    },
                    ..
                }))
            )
        });

        m
    }

    fn fold_script(&mut self, _: Script) -> Script {
        unimplemented!("automatic polyfill for scripts")
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
    pub skip: Vec<JsWord>,

    #[serde(default)]
    pub include: Vec<FeatureOrModule>,

    #[serde(default)]
    pub exclude: Vec<FeatureOrModule>,

    /// The version of the used core js.
    #[serde(default)]
    pub core_js: Option<Version>,

    #[serde(default = "default_targets")]
    pub targets: Option<Targets>,

    #[serde(default = "default_path")]
    pub path: PathBuf,

    #[serde(default)]
    pub shipped_proposals: bool,

    #[serde(default)]
    pub force_all_transforms: bool,

    #[serde(default)]
    pub bugfixes: bool,
}

fn default_targets() -> Option<Targets> {
    Some(Targets::Query(Query::Single("".into())))
}

fn default_path() -> PathBuf {
    if cfg!(target_arch = "wasm32") {
        Default::default()
    } else {
        std::env::current_dir().unwrap()
    }
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum FeatureOrModule {
    Feature(Feature),
    CoreJsModule(String),
}

impl FeatureOrModule {
    pub fn split(vec: Vec<FeatureOrModule>) -> (Vec<Feature>, AHashSet<String>) {
        let mut features: Vec<_> = Default::default();
        let mut modules: AHashSet<_> = Default::default();

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
