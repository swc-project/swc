//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(all(
    not(all(target_os = "linux", target_env = "musl", target_arch = "aarch64")),
    not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;
