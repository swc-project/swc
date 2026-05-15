use swc_ecma_ast::Pass;

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl Pass {
    swc_ecma_transformer::es2022_private_in_object()
}
