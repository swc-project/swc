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
    swc_ecma_transformer::es2020_nullish_coalescing(c.no_document_all)
}
