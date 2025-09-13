use swc_ecma_ast::Pass;
pub use swc_ecma_compiler::es2020::nullish_coalescing::Config;
use swc_ecma_compiler::{Compiler, Features};
use swc_ecma_transforms_base::assumptions::Assumptions;

pub fn nullish_coalescing(c: Config) -> impl Pass {
    let mut assumptions = Assumptions::default();
    assumptions.no_document_all = c.no_document_all;

    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::NULLISH_COALESCING,
        excludes: Features::empty(),
        assumptions,
    })
}
