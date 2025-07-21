use swc_ecma_ast::*;
use swc_ecma_compiler::{Compiler, Features};

pub fn static_blocks() -> impl Pass {
    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::STATIC_BLOCKS,
        ..Default::default()
    })
}
