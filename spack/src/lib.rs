#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(try_blocks)]
#![feature(vec_remove_item)]
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
pub mod load;
pub mod loaders;
mod normalize;
pub mod resolve;
mod util;
