#![cfg_attr(test, feature(test))]

#[cfg(test)]
extern crate test;

/// Explicit extern crate to use allocator.
extern crate swc_malloc;

pub mod loaders;
#[cfg(feature = "swc_v1")]
pub mod v1;
#[cfg(feature = "swc_v2")]
pub mod v2;

#[cfg(all(not(feature = "swc_v1"), not(feature = "swc_v2")))]
compile_error!("Please enable swc_v1 or swc_v2 feature");
