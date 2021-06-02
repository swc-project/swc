pub use self::{
    bundler::{Bundle, BundleKind, Bundler, Config, ModuleType},
    hook::{Hook, ModuleRecord},
    load::{Load, ModuleData},
    resolve::Resolve,
};
pub use swc_bundler_analysis::id::ModuleId;

mod bundler;
mod debug;
mod dep_graph;
mod hash;
mod hook;
mod inline;
mod load;
mod modules;
mod resolve;
mod util;
