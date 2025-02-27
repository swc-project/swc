//! This crate configures memory allocator.
//!
//! The swc crates related to the  node binding should depend on this crate.

#[cfg(not(any(target_family = "wasm", target_env = "musl")))]
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;
