use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};

pub fn export_namespace_from() -> impl Pass {
    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::EXPORT_NAMESPACE_FROM,
        ..Default::default()
    })
}
