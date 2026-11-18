use swc_ecma_ast::*;

pub fn static_blocks() -> impl Pass {
    swc_ecma_transformer::es2022_static_blocks()
}
