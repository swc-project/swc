use swc_ecma_ast::Pass;

/// Creates a logical assignments transformation pass.
///
/// This enables both:
/// - ES2021 logical assignment operators (&&=, ||=, ??=)
/// - ES2020 nullish coalescing (to transform the ?? operator generated from
///   ??=)
pub fn logical_assignments() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2021.logical_assignment_operators = true;
    options.into_pass()
}
