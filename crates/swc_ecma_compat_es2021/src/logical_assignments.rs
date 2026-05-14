use swc_ecma_ast::Pass;

/// Creates a logical assignments transformation pass.
///
/// This enables both:
/// - ES2021 logical assignment operators (&&=, ||=, ??=)
/// - ES2020 nullish coalescing (to transform the ?? operator generated from
///   ??=)
pub fn logical_assignments() -> impl Pass {
    swc_ecma_transformer::es2021_logical_assignments()
}
