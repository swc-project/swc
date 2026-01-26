use serde::Deserialize;
use swc_ecma_ast::Pass;

/// Configuration for nullish coalescing transformation
#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
}

/// Creates a nullish coalescing transformation pass
///
/// This is now a thin wrapper around the Compiler implementation.
pub fn nullish_coalescing(c: Config) -> impl Pass + 'static {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2020.nullish_coalescing = true;
    options.assumptions.no_document_all = c.no_document_all;
    options.into_pass()
}
