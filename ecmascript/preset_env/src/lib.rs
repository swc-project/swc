#![recursion_limit = "256"]

pub use self::{transform_data::Feature, version::Version};
use dashmap::DashMap;
use fxhash::{FxHashMap, FxHashSet};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use st_map::StaticMap;
use std::{
    path::{Path, PathBuf},
    process::Command,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{chain, FromVariant, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    compat::{bugfixes, es2015, es2016, es2017, es2018, es2020, es3},
    pass::{noop, Optional},
};
use swc_ecma_utils::prepend_stmts;
use swc_ecma_visit::{Fold, FoldWith, VisitWith};

#[macro_use]
mod util;
mod corejs2;
mod corejs3;
mod regenerator;
mod transform_data;
mod version;

pub fn preset_env(global_mark: Mark, c: Config) -> impl Fold {
    let loose = c.loose;
    let targets: Versions =
        targets_to_versions(c.targets, &c.path).expect("failed to parse targets");
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

    // ES2020

    let pass = add!(pass, NullishCoalescing, es2020::nullish_coalescing());
    let pass = add!(pass, OptionalChaining, es2020::optional_chaining());
    let pass = add!(pass, ClassProperties, es2020::class_properties());

    // ES2018
    let pass = add!(pass, ObjectRestSpread, es2018::object_rest_spread());
    let pass = add!(pass, OptionalCatchBinding, es2018::optional_catch_binding());

    // ES2017
    let pass = add!(pass, AsyncToGenerator, es2017::async_to_generator());

    // ES2016
    let pass = add!(pass, ExponentiationOperator, es2016::exponentation());

    // ES2015
    let pass = add!(pass, BlockScopedFunctions, es2015::block_scoped_functions());
    let pass = add!(pass, TemplateLiterals, es2015::template_literal(), true);
    let pass = add!(pass, Classes, es2015::classes());
    let pass = add!(
        pass,
        Spread,
        es2015::spread(es2015::spread::Config { loose }),
        true
    );
    let pass = add!(pass, FunctionName, es2015::function_name());
    let pass = add!(pass, ArrowFunctions, es2015::arrow());
    let pass = add!(pass, DuplicateKeys, es2015::duplicate_keys());
    let pass = add!(pass, StickyRegex, es2015::sticky_regex());
    // TODO:    InstanceOf,
    let pass = add!(pass, TypeOfSymbol, es2015::typeof_symbol());
    let pass = add!(pass, ShorthandProperties, es2015::shorthand());
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
    let pass = add!(pass, Regenerator, es2015::regenerator(global_mark), true);
    let pass = add!(pass, BlockScoping, es2015::block_scoping(), true);

    // TODO:
    //    Literals,
    //    ObjectSuper,
    //    DotAllRegex,
    //    UnicodeRegex,
    //    NewTarget,
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
    #[serde(default)]
    pub opera_mobile: T,
}

#[derive(Debug)]
struct Polyfills {
    mode: Option<Mode>,
    targets: Versions,
    shipped_proposals: bool,
    corejs: Version,
    regenerator: bool,
    includes: FxHashSet<String>,
    excludes: FxHashSet<String>,
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
                        m.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

                        v.required
                    }
                    Version { major: 3, .. } => {
                        let mut v =
                            corejs3::UsageVisitor::new(self.targets, self.shipped_proposals);
                        m.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                        v.required
                    }

                    _ => unimplemented!("corejs version other than 2 / 3"),
                };

                if regenerator::is_required(&m) {
                    r.insert("regenerator-runtime/runtime".into());
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
                if s != "regenerator-runtime/runtime" {
                    format!("core-js/modules/{}", s).into()
                } else {
                    format!("regenerator-runtime/runtime").into()
                }
            })
            .chain(self.includes.iter().map(|s| {
                if s != "regenerator-runtime/runtime" {
                    format!("core-js/modules/{}", s).into()
                } else {
                    format!("regenerator-runtime/runtime").into()
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
                            value: src,
                            has_escape: false,
                            kind: Default::default(),
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
                            value: src,
                            has_escape: false,
                            kind: Default::default(),
                        },
                        type_only: false,
                        asserts: None,
                    }))
                }),
            );
        }

        m.body.retain(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                src:
                    Str {
                        span: DUMMY_SP,
                        value: js_word!(""),
                        ..
                    },
                ..
            })) => false,
            _ => true,
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

pub type Versions = BrowserData<Option<Version>>;

impl BrowserData<Option<Version>> {
    pub fn is_any_target(&self) -> bool {
        self.iter().all(|(_, v)| v.is_none())
    }

    pub fn parse_versions<'a>(lines: impl Iterator<Item = &'a str>) -> Result<Self, &'a str> {
        fn remap(key: &str) -> String {
            match key {
                "and_chr" => "chrome".into(),
                "and_ff" => "firefox".into(),
                "ie_mob" => "ie".into(),
                "ios_saf" => "ios".into(),
                "op_mob" => "opera".into(),
                _ => key.into(),
            }
        }

        let browsers = lines.map(|v| {
            let mut v = v.split(' ');
            (remap(v.next().unwrap()), v.next().unwrap().to_string())
        });

        let mut data: Versions = BrowserData::default();
        for (browser, version) in browsers {
            match &*browser {
                "and_qq" | "and_uc" | "baidu" | "bb" | "kaios" | "op_mini" => continue,

                _ => {}
            }

            let version = if version.contains("-") {
                version.split('-').next().unwrap().parse().unwrap()
            } else {
                version.parse().unwrap()
            };

            // lowest version
            if data[&browser].is_none() || data[&browser].unwrap() > version {
                for (k, v) in data.iter_mut() {
                    if browser == k {
                        *v = Some(version);
                    }
                }
            }
        }

        Ok(data)
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
    std::env::current_dir().unwrap()
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

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum Targets {
    Query(Query),
    EsModules(EsModules),
    Versions(Versions),
    HashMap(FxHashMap<String, QueryOrVersion>),
}

#[derive(Debug, Clone, Copy, Deserialize)]
pub struct EsModules {
    esmodules: bool,
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum QueryOrVersion {
    Query(Query),
    Version(Version),
}

#[derive(Debug, Clone, Deserialize, FromVariant, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[serde(untagged)]
pub enum Query {
    Single(String),
    Multiple(Vec<String>),
}

type QueryResult = Result<Versions, ()>;

impl Query {
    fn exec(&self, path: &Path) -> QueryResult {
        fn query<T>(s: &[T], path: &Path) -> QueryResult
        where
            T: AsRef<str> + Serialize,
        {
            let output = {
                let output = Command::new("node")
                    .current_dir(path)
                    .arg("-e")
                    .arg(include_str!("query.js"))
                    .arg(serde_json::to_string(&s).expect("failed to serialize with serde"))
                    .output()
                    .expect("failed to collect output");
                if !output.status.success() {
                    println!("query.js: Status {:?}", output.status,);
                    println!(
                        "{}\n{}",
                        String::from_utf8_lossy(&output.stdout),
                        String::from_utf8_lossy(&output.stderr),
                    );
                    return Err(());
                }

                output.stdout
            };

            let browsers: Vec<String> =
                serde_json::from_slice(&output).expect("failed to read browser data output");
            let versions = BrowserData::parse_versions(browsers.iter().map(|s| &**s))
                .expect("failed to parse browser version");

            Ok(versions)
        }

        static CACHE: Lazy<DashMap<Query, QueryResult>> = Lazy::new(Default::default);

        if let Some(v) = CACHE.get(self) {
            return match &*v {
                Ok(v) => Ok(*v),
                Err(err) => Err(*err),
            };
        }

        let result = match *self {
            Query::Single(ref s) => query(&[s], path),
            Query::Multiple(ref s) => query(&s, path),
        };

        CACHE.insert(self.clone(), result);

        result
    }
}

fn targets_to_versions(v: Option<Targets>, path: &Path) -> Result<Versions, ()> {
    match v {
        None => Ok(Default::default()),
        Some(Targets::Versions(v)) => Ok(v),
        Some(Targets::Query(q)) => q.exec(path),
        Some(Targets::HashMap(mut map)) => {
            let q = map.remove("browsers").map(|q| match q {
                QueryOrVersion::Query(q) => q.exec(path).expect("failed to run query"),
                _ => unreachable!(),
            });

            let node = map.remove("node").map(|q| match q {
                QueryOrVersion::Version(v) => v,
                QueryOrVersion::Query(..) => unreachable!(),
            });

            if map.is_empty() {
                if let Some(mut q) = q {
                    q.node = node;
                    return Ok(q);
                }
            }

            unimplemented!("Targets: {:?}", map)
        }
        _ => unimplemented!("Option<Targets>: {:?}", v),
    }
}

#[cfg(test)]
mod tests {
    use super::Query;

    #[test]
    fn test_empty() {
        let path = std::env::current_dir().unwrap();
        let res = Query::Single("".into()).exec(&path).unwrap();
        assert!(
            !res.is_any_target(),
            "empty query should return non-empty result"
        );
    }
}
