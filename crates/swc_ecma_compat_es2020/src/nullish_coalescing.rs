use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};
use swc_ecma_transforms_base::assumptions::Assumptions;

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
    let mut assumptions = Assumptions::default();
    assumptions.no_document_all = c.no_document_all;

    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::NULLISH_COALESCING,
        assumptions,
        ..Default::default()
    })
}
