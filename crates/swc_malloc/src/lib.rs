//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(any(
    not(any(
        target_os = "linux",
        target_family = "wasm",
        target_env = "musl",
        all(target_os = "linux", any(target_arch = "aarch64", target_arch = "arm"))
    )),
    all(
        target_os = "linux",
        not(any(
            target_family = "wasm",
            target_env = "musl",
            all(target_os = "linux", any(target_arch = "aarch64", target_arch = "arm"))
        ))
    )
))]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

// On linux aarch64, mimalloc fails to build.
// So we use tikv-jemallocator instead.

#[cfg(all(target_os = "linux", any(target_arch = "aarch64", target_arch = "arm")))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
