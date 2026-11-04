use serde::Deserialize;
use swc_ecma_transforms_base::assumptions::Assumptions;
use swc_ecma_transforms_react::Options as ReactOptions;
use swc_ecma_transforms_typescript::Config;

#[derive(Default, Deserialize)]
#[serde(default)]
pub(super) struct Swcrc {
    pub(super) jsc: Jsc,
    pub(super) env: Option<Env>,
}
#[derive(Default, Deserialize)]
#[serde(default)]
pub(super) struct Jsc {
    pub(super) transform: Transform,
    pub(super) assumptions: Option<Assumptions>,
    pub(super) parser: Parser,
    pub(super) loose: bool,
    pub(super) target: Option<serde_json::Value>,
}

/// The subset of env features that this runner can reproduce for Chrome 120.
#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub(super) struct Env {
    pub(super) targets: Targets,
    pub(super) include: Vec<Feature>,
    pub(super) exclude: Vec<Feature>,
    pub(super) loose: bool,
    pub(super) force_all_transforms: bool,
    pub(super) bugfixes: bool,
    pub(super) mode: Option<serde_json::Value>,
}

#[derive(Default, Deserialize)]
#[serde(deny_unknown_fields)]
pub(super) struct Targets {
    pub(super) chrome: String,
}

#[derive(Clone, Copy, Deserialize, PartialEq, Eq)]
pub(super) enum Feature {
    #[serde(rename = "transform-class-static-block")]
    StaticBlocks,
    #[serde(rename = "transform-class-properties")]
    ClassProperties,
    #[serde(rename = "transform-optional-chaining")]
    OptionalChaining,
    #[serde(rename = "transform-nullish-coalescing-operator")]
    NullishCoalescing,
    #[serde(rename = "transform-async-to-generator")]
    AsyncToGenerator,
    #[serde(rename = "transform-parameters")]
    Parameters,
    #[serde(rename = "transform-destructuring")]
    Destructuring,
    #[serde(rename = "transform-block-scoping")]
    BlockScoping,
}

impl Env {
    pub(super) fn enabled(&self, feature: Feature) -> bool {
        self.include.contains(&feature) && !self.exclude.contains(&feature)
    }
}

#[derive(Default, Deserialize)]
#[serde(default)]
pub(super) struct Parser {
    pub(super) decorators: bool,
}

#[derive(Deserialize)]
#[serde(default, rename_all = "camelCase")]
pub(super) struct Transform {
    #[serde(flatten)]
    pub(super) typescript: Config,
    pub(super) use_define_for_class_fields: bool,
    pub(super) legacy_decorator: bool,
    pub(super) decorator_metadata: bool,
    pub(super) react: ReactOptions,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            typescript: Config::default(),
            use_define_for_class_fields: true,
            legacy_decorator: false,
            decorator_metadata: false,
            react: ReactOptions::default(),
        }
    }
}
