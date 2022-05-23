#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::needless_lifetimes)]
#![allow(clippy::vec_box)]

pub use self::{amd::amd, common_js::common_js, system_js::system_js, umd::umd};

#[macro_use]
pub mod util;
pub mod amd;
pub mod common_js;
pub mod esbuild_cjs;
pub mod hoist;
pub mod import_analysis;
pub mod path;
pub mod rewriter;
pub mod system_js;
pub mod umd;
