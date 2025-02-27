//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(not(any(
    target_family = "wasm",
    target_env = "musl",
    all(target_os = "linux", target_env = "gnu", target_arch = "aarch64")
)))]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

// On linux aarch64, mimalloc fails to build.
// So we use tikv-jemallocator instead.

#[cfg(all(target_os = "linux", target_env = "gnu", target_arch = "aarch64"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
