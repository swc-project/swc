use swc_ecma_utils::stack_size::maybe_grow;

/// Protect recursive expression conversion and the scans preceding compilation.
///
/// These frames are larger than the usual SWC visitors, so keep 256 KiB free
/// before entering another expression and grow in 1 MiB segments.
#[inline]
pub(crate) fn with_expression_stack<R>(callback: impl FnOnce() -> R) -> R {
    maybe_grow(256 * 1024, 1024 * 1024, callback)
}

/// Provide the stack budget used by the upstream React Compiler's napi bridge.
///
/// Its AST visitors, HIR lowering, and AST destruction recurse without stack
/// growth checks. Keep the entire compilation, including temporary AST drops,
/// on this stack instead of spawning another thread for each file. This is a
/// finite budget, not support for arbitrarily deep input. The shared SWC helper
/// runs callbacks directly on wasm32, ARM, and Miri, where growth is
/// unsupported.
pub(crate) fn with_compiler_stack<R>(callback: impl FnOnce() -> R) -> R {
    const STACK_SIZE: usize = 64 * 1024 * 1024;
    maybe_grow(STACK_SIZE, STACK_SIZE, callback)
}
