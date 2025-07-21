use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl Pass {
    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::PRIVATE_IN_OBJECT,
        excludes: Features::empty(),
    })
}
