#![cfg_attr(test, feature(test))]

#[cfg(test)]
extern crate test;

/// Explicit extern crate to use allocator.
extern crate swc_node_base;

pub mod config;
pub mod loaders;
