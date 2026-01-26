use swc_ecma_ast::Pass;

pub fn duplicate_keys() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.duplicate_keys = true;
    options.into_pass()
}
