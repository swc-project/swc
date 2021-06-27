//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(all(
    unix,
    not(target_env = "musl"),
    not(target_os = "freebsd"),
    not(target_arch = "arm"),
    not(target_arch = "aarch64")
))]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

#[cfg(all(windows, not(target_arch = "aarch64")))]
#[global_allocator]
static ALLOC: mimalloc::MiMalloc = mimalloc::MiMalloc;
