#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::needless_lifetimes)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

use serde::{Deserialize, Serialize};

pub use self::{amd::amd, common_js::common_js, system_js::system_js, umd::umd};

#[macro_use]
pub mod util;
pub mod amd;
pub mod common_js;
pub mod import_analysis;
pub(crate) mod module_decl_strip;
pub(crate) mod module_ref_rewriter;
pub mod path;
pub mod rewriter;
pub mod system_js;
mod top_level_this;
pub mod umd;

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct EsModuleConfig {
    #[serde(default)]
    pub resolve_fully: bool,
}
