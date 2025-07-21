use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};

pub fn logical_assignments() -> impl Pass {
    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::LOGICAL_ASSIGNMENTS,
        ..Default::default()
    })
}
