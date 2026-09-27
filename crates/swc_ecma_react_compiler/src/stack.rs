//! Stack growth for the recursive AST conversions.
//!
//! Expressions such as long member-call chains are converted recursively, one
//! frame per link. Bundlers commonly run SWC on threads with a 2 MiB stack, so
//! the conversions grow the stack on demand instead of overflowing.

/// Space that must remain before growing the stack. Debug builds use large
/// frames for the conversion `match`es, so this is generous.
#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
const RED_ZONE: usize = 256 * 1024;

/// Size of each newly allocated stack segment.
#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
const STACK_SIZE: usize = 1024 * 1024;

/// Runs `callback`, first switching to a new stack segment if fewer than
/// [`RED_ZONE`] bytes remain.
#[inline(always)]
#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
pub(crate) fn maybe_grow<R>(callback: impl FnOnce() -> R) -> R {
    stacker::maybe_grow(RED_ZONE, STACK_SIZE, callback)
}

/// Runs `callback` on the current stack; `stacker` is unavailable here.
#[inline(always)]
#[cfg(any(
    target_arch = "wasm32",
    target_arch = "arm",
    miri,
    not(feature = "stacker")
))]
pub(crate) fn maybe_grow<R>(callback: impl FnOnce() -> R) -> R {
    callback()
}
