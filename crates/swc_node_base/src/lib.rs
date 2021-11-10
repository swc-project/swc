//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(all(
    target_arch = "x86_64",
    not(target_env = "musl"),
    not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;
