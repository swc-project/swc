use swc_ecma_ast::Pass;

pub fn logical_assignments() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2021.logical_assignment_operators = true;
    options.into_pass()
}
