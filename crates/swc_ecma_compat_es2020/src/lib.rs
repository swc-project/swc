use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;

pub use self::{
    export_namespace_from::export_namespace_from, nullish_coalescing::nullish_coalescing,
    optional_chaining::optional_chaining,
};

mod export_namespace_from;
pub mod nullish_coalescing;
pub mod optional_chaining;

pub fn es2020(config: Config, unresolved_mark: Mark) -> impl Pass {
    (
        nullish_coalescing(config.nullish_coalescing),
        optional_chaining(config.optional_chaining, unresolved_mark),
        export_namespace_from(),
    )
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(flatten)]
    pub nullish_coalescing: nullish_coalescing::Config,
    #[serde(flatten)]
    pub optional_chaining: optional_chaining::Config,
}
