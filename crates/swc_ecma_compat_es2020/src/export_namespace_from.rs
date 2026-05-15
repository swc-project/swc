use swc_ecma_ast::Pass;

pub fn export_namespace_from() -> impl Pass {
    swc_ecma_transformer::es2020_export_namespace_from()
}
