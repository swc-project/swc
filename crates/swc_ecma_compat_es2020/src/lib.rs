use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};
use swc_ecma_transforms_base::assumptions::Assumptions;

pub use self::{
    export_namespace_from::export_namespace_from, nullish_coalescing::nullish_coalescing,
    optional_chaining::optional_chaining,
};

mod export_namespace_from;
pub mod nullish_coalescing;
pub mod optional_chaining;

pub fn es2020(config: Config, unresolved_mark: Mark) -> impl Pass {
    let mut assumptions = Assumptions::default();
    assumptions.no_document_all = config.nullish_coalescing.no_document_all;
    assumptions.pure_getters = config.optional_chaining.pure_getter;

    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::EXPORT_NAMESPACE_FROM
            | Features::NULLISH_COALESCING
            | Features::OPTIONAL_CHAINING,
        assumptions,
        unresolved_mark,
        ..Default::default()
    })
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(flatten)]
    pub nullish_coalescing: nullish_coalescing::Config,
    #[serde(flatten)]
    pub optional_chaining: optional_chaining::Config,
}
