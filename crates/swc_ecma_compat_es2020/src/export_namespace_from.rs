use swc_ecma_ast::Pass;

pub fn export_namespace_from() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2020.export_namespace_from = true;
    options.into_pass()
}
