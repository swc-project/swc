#![deny(clippy::all)]
#![allow(clippy::needless_lifetimes)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

use serde::{Deserialize, Serialize};
use swc_common::{Span, SyntaxContext};
use util::Config;

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
#[serde(rename_all = "camelCase")]
pub struct EsModuleConfig {
    #[serde(flatten, default)]
    pub config: Config,
}

type SpanCtx = (Span, SyntaxContext);
