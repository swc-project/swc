use serde::Deserialize;
use swc_ecma_ast::EsVersion;
use swc_ecma_preset_env::Config as Env;
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
    pub(super) target: Option<EsVersion>,
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
