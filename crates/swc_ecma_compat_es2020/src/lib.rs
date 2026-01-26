use serde::Deserialize;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::Pass;

pub use self::{
    export_namespace_from::export_namespace_from, nullish_coalescing::nullish_coalescing,
    optional_chaining::optional_chaining,
};

mod export_namespace_from;
pub mod nullish_coalescing;
pub mod optional_chaining;

pub fn es2020(config: Config, unresolved_mark: Mark) -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
    options.assumptions.no_document_all = config.nullish_coalescing.no_document_all;
    options.env.es2020.nullish_coalescing = true;
    options.env.es2020.export_namespace_from = true;

    (
        optional_chaining(config.optional_chaining, unresolved_mark),
        options.into_pass(),
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
