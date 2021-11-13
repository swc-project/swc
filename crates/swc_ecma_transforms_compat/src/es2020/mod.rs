pub use self::{
    export_namespace_from::export_namespace_from, nullish_coalescing::nullish_coalescing,
    opt_chaining::optional_chaining,
};
use serde::Deserialize;
use swc_common::chain;
use swc_ecma_visit::Fold;

mod export_namespace_from;
pub mod nullish_coalescing;
pub mod opt_chaining;

pub fn es2020(config: Config) -> impl Fold {
    chain!(
        nullish_coalescing(config.nullish_coalescing),
        optional_chaining(config.optional_chaining),
        export_namespace_from(),
    )
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(flatten)]
    pub nullish_coalescing: nullish_coalescing::Config,
    #[serde(flatten)]
    pub optional_chaining: opt_chaining::Config,
}
