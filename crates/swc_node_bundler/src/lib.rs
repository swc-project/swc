#![cfg_attr(test, feature(test))]

#[cfg(test)]
extern crate test;

/// Explicit extern crate to use allocator.
extern crate swc_node_base;

pub mod loaders;
#[cfg(feature = "swc_v1")]
pub mod v1;
#[cfg(feature = "swc_v2")]
pub mod v2;
