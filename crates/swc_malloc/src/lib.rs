//! This crate configures memory allocator.
//!
//! The swc crates related to the node binding should depend on this crate.
//!
//! # Memory Allocator Selection Strategy
//!
//! This crate configures the global memory allocator based on the target
//! platform:
//!
//! - **mimalloc**: Used on non-Linux native targets (for example Windows and
//!   macOS), and Linux GNU on x86_64 / aarch64 where it provides excellent
//!   performance and memory efficiency.
//!
//! - **jemalloc**: Used for Linux ARM 32-bit (armv7) with glibc. This is
//!   because mimalloc has known issues on this architecture.
//!
//! - **System allocator (default)**: Used for musl libc targets (Alpine Linux
//!   and other musl-based distributions). This is intentional and correct
//!   because:
//!   - mimalloc has known segfault issues on ARM64 musl targets (see https://github.com/microsoft/mimalloc/issues/556)
//!   - jemalloc has threading issues with musl libc (see https://github.com/jemalloc/jemalloc/issues/1443)
//!   - musl's built-in allocator is designed to work reliably across all
//!     architectures
//!   - Linux GNU targets like s390x / powerpc64le may use cross toolchains
//!     where C11 headers (such as `stdatomic.h`) are unavailable for mimalloc
//!     builds in CI
//!
//! - **WASM**: Uses the default allocator for WebAssembly targets.
//!
//! If you encounter segmentation faults on ARM64 or Alpine Linux during
//! installation, the issue is likely not related to allocator configuration,
//! but rather to binary loading or compatibility issues. See the postinstall.js
//! script for troubleshooting options.

// Use mimalloc for non-linux native targets and Linux GNU x86_64/aarch64.
#[cfg(any(
    all(not(target_os = "linux"), not(target_family = "wasm")),
    all(
        target_os = "linux",
        target_env = "gnu",
        any(target_arch = "x86_64", target_arch = "aarch64")
    )
))]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

// On linux ARM 32-bit (armv7) with glibc, use jemalloc instead of mimalloc
// because mimalloc has known compatibility issues on this architecture.
#[cfg(all(target_os = "linux", target_env = "gnu", target_arch = "arm"))]
#[global_allocator]
static GLOBAL: tikv_jemallocator::Jemalloc = tikv_jemallocator::Jemalloc;
