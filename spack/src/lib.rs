#![cfg_attr(test, feature(test))]

#[cfg(test)]
extern crate test;

pub use self::{
    bundler::{Bundle, BundleKind, Bundler},
    id::{Id, ModuleId, QualifiedId},
};

mod bundler;
pub mod config;
mod debug;
mod id;
pub mod loaders;
mod normalize;
mod util;
