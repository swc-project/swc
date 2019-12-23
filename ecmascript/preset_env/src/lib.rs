#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]

pub use self::transform_data::{parse_version, Feature};
use semver::Version;
use serde::Deserialize;
use st_map::StaticMap;
use std::convert::{TryFrom, TryInto};
use swc_atoms::JsWord;
use swc_common::{chain, Fold, FromVariant, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    compat::{es2015, es2016, es2017, es2018, es3},
    pass::{noop, Optional, Pass},
    util::prepend_stmts,
};

mod corejs2;
mod corejs3;
mod transform_data;

pub fn preset_env(mut c: Config) -> impl Pass {
    if c.core_js == 0 {
        c.core_js = 2;
    }
    let loose = c.loose;
    let targets: Versions = c.targets.try_into().expect("failed to parse targets");
    let is_any_target = targets.is_any_target();

    let pass = noop();
    macro_rules! add {
        ($prev:expr, $feature:ident, $pass:expr) => {{
            add!($prev, $feature, $pass, false)
        }};
        ($prev:expr, $feature:ident, $pass:expr, $default:expr) => {{
            let f = transform_data::Feature::$feature;

            let enable = !c.exclude.contains(&f)
                && (is_any_target || c.include.contains(&f) || f.should_enable(&targets, $default));
            if c.debug {
                println!("{}: {:?}", f.as_str(), enable);
            }
            chain!($prev, Optional::new($pass, enable))
        }};
    }

    // ES2018
    let pass = add!(pass, ObjectRestSpread, es2018::object_rest_spread());
    let pass = add!(pass, OptionalCatchBinding, es2018::optional_catch_binding());

    // ES2017
    let pass = add!(pass, AsyncToGenerator, es2017::async_to_generator());

    // ES2016
    let pass = add!(pass, ExponentiationOperator, es2016::exponentation());

    // ES2015
    let pass = add!(pass, BlockScopedFunctions, es2015::BlockScopedFns);
    let pass = add!(
        pass,
        TemplateLiterals,
        es2015::TemplateLiteral::default(),
        true
    );
    let pass = add!(pass, Classes, es2015::Classes::default());
    let pass = add!(
        pass,
        Spread,
        es2015::spread(es2015::spread::Config { loose }),
        true
    );
    let pass = add!(pass, FunctionName, es2015::function_name());
    let pass = add!(pass, ArrowFunctions, es2015::arrow());
    let pass = add!(pass, DuplicateKeys, es2015::duplicate_keys());
    let pass = add!(pass, StickyRegex, es2015::StickyRegex);
    // TODO:    InstanceOf,
    let pass = add!(pass, TypeOfSymbol, es2015::TypeOfSymbol);
    let pass = add!(pass, ShorthandProperties, es2015::Shorthand);
    let pass = add!(pass, Parameters, es2015::parameters());
    let pass = add!(
        pass,
        ForOf,
        es2015::for_of(es2015::for_of::Config {
            assume_array: loose
        }),
        true
    );
    let pass = add!(
        pass,
        ComputedProperties,
        es2015::computed_properties(),
        true
    );
    let pass = add!(
        pass,
        Destructuring,
        es2015::destructuring(es2015::destructuring::Config { loose }),
        true
    );
    let pass = add!(pass, BlockScoping, es2015::block_scoping(), true);

    // TODO:
    //    Literals,
    //    ObjectSuper,
    //    DotAllRegex,
    //    UnicodeRegex,
    //    NewTarget,
    //    Regenerator,
    //    AsyncGeneratorFunctions,
    //    UnicodePropertyRegex,
    //    JsonStrings,
    //    NamedCapturingGroupsRegex,

    // ES 3
    let pass = add!(pass, PropertyLiterals, es3::PropertyLiteral);
    let pass = add!(pass, MemberExpressionLiterals, es3::MemberExprLit);
    let pass = add!(
        pass,
        ReservedWords,
        es3::ReservedWord {
            preserve_import: c.dynamic_import
        }
    );

    chain!(
        pass,
        Polyfills {
            mode: c.mode,
            targets
        }
    )
}

/// A map without allocation.
#[derive(Debug, Default, Deserialize, Clone, Copy, StaticMap)]
#[serde(deny_unknown_fields)]
pub struct BrowserData<T: Default> {
    #[serde(default)]
    pub chrome: T,
    #[serde(default)]
    pub ie: T,
    #[serde(default)]
    pub edge: T,
    #[serde(default)]
    pub firefox: T,
    #[serde(default)]
    pub safari: T,
    #[serde(default)]
    pub node: T,
    #[serde(default)]
    pub ios: T,
    #[serde(default)]
    pub samsung: T,
    #[serde(default)]
    pub opera: T,
    #[serde(default)]
    pub android: T,
    #[serde(default)]
    pub electron: T,
    #[serde(default)]
    pub phantom: T,
}

impl<T> BrowserData<Option<T>> {
    pub fn as_ref(&self) -> BrowserData<Option<&T>> {
        BrowserData {
            chrome: self.chrome.as_ref(),
            ie: self.ie.as_ref(),
            edge: self.edge.as_ref(),
            firefox: self.firefox.as_ref(),
            safari: self.safari.as_ref(),
            node: self.node.as_ref(),
            ios: self.ios.as_ref(),
            samsung: self.samsung.as_ref(),
            opera: self.opera.as_ref(),
            android: self.android.as_ref(),
            electron: self.electron.as_ref(),
            phantom: self.phantom.as_ref(),
        }
    }
}

struct Polyfills {
    mode: Option<Mode>,
    targets: Versions,
}

impl Fold<Module> for Polyfills {
    fn fold(&mut self, mut node: Module) -> Module {
        let span = node.span;

        if self.mode == Some(Mode::Usage) {
            let mut v = corejs2::UsageVisitor::new(&self.targets);
            node.visit_with(&mut v);

            if cfg!(debug_assertions) {
                v.required.sort();
            }

            prepend_stmts(
                &mut node.body,
                v.required.into_iter().map(|src| {
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span,
                        specifiers: vec![],
                        src: Str {
                            span: DUMMY_SP,
                            value: src,
                            has_escape: false,
                        },
                    }))
                }),
            );
        }

        node
    }
}

impl Fold<Script> for Polyfills {
    fn fold(&mut self, _: Script) -> Script {
        unimplemented!("automatic polyfill for scripts")
    }
}

#[derive(Debug, Clone, Copy, Deserialize, PartialEq, Eq)]
#[serde(untagged)]
pub enum Mode {
    #[serde(rename = "usage")]
    Usage,
    #[serde(rename = "entry")]
    Entry,
}

pub type Versions = BrowserData<Option<Version>>;

impl BrowserData<Option<Version>> {
    pub fn is_any_target(&self) -> bool {
        self.iter().all(|(_, v)| v.is_none())
    }
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
    pub include: Vec<Feature>,

    #[serde(default)]
    pub exclude: Vec<Feature>,

    /// The version of the used core js.
    #[serde(default)]
    pub core_js: usize,

    #[serde(default)]
    pub targets: Option<Target>,
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum Target {
    Versions(Versions),
    Queries(Vec<String>),
    Query(String),
}

impl TryFrom<Option<Target>> for Versions {
    type Error = ();

    fn try_from(v: Option<Target>) -> Result<Self, Self::Error> {
        match v {
            None => Ok(Versions::default()),
            Some(Target::Versions(v)) => Ok(v),
            _ => unimplemented!(),
        }
    }
}
