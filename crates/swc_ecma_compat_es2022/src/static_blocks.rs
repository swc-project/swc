use swc_ecma_ast::*;

pub fn static_blocks() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2022.class_static_block = true;
    options.into_pass()
}
