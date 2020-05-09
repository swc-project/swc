#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(try_blocks)]
#![cfg_attr(test, feature(test))]

#[cfg(test)]
extern crate test;

pub use self::{
    bundler::Bundler,
    id::{Id, ModuleId, QualifiedId},
};

mod bundler;
mod chunk;
pub mod config;
mod debug;
mod id;
pub mod load;
pub mod loaders;
mod normalize;
pub mod resolve;
mod util;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Config {
    pub tree_shake: bool,
}
