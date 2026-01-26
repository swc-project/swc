use swc_ecma_ast::Pass;

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2022.private_property_in_object = true;
    options.into_pass()
}
