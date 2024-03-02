#![deny(clippy::all)]
#![allow(unstable_name_collisions)]
#![allow(clippy::mutable_key_type)]

pub use self::{
    bundler::{Bundle, BundleKind, Bundler, Config, ModuleType},
    hook::{Hook, ModuleRecord},
    id::ModuleId,
    load::{Load, ModuleData},
    resolve::Resolve,
};

mod bundler;
mod debug;
mod dep_graph;
mod hash;
mod hook;
mod id;
mod inline;
mod load;
mod modules;
mod resolve;
mod util;
