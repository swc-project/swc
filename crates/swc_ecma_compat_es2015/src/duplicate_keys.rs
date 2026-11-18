use swc_ecma_ast::Pass;

pub fn duplicate_keys() -> impl Pass {
    swc_ecma_transformer::es2015_duplicate_keys()
}
