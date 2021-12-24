//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(all(
    not(debug_assertions),
    not(all(target_os = "linux", target_arch = "aarch64", target_env = "musl")),
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;
