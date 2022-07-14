#![deny(clippy::all)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub use swc_ecma_ast as ast;
#[cfg(any(docsrs, feature = "codegen"))]
#[cfg_attr(docsrs, doc(cfg(feature = "codegen")))]
pub use swc_ecma_codegen as codegen;
#[cfg(any(docsrs, feature = "dep_graph"))]
#[cfg_attr(docsrs, doc(cfg(feature = "dep_graph")))]
pub use swc_ecma_dep_graph as dep_graph;
#[cfg(any(docsrs, feature = "minifier"))]
#[cfg_attr(docsrs, doc(cfg(feature = "minifier")))]
pub use swc_ecma_minifier as minifier;
#[cfg(any(docsrs, feature = "parser"))]
#[cfg_attr(docsrs, doc(cfg(feature = "parser")))]
pub use swc_ecma_parser as parser;
#[cfg(any(docsrs, feature = "preset_env"))]
#[cfg_attr(docsrs, doc(cfg(feature = "preset_env")))]
pub use swc_ecma_preset_env as preset_env;
#[cfg(any(docsrs, feature = "swc_ecma_quote"))]
#[cfg_attr(docsrs, doc(cfg(feature = "parser")))]
pub use swc_ecma_quote as quote;
#[cfg(any(docsrs, feature = "transforms"))]
#[cfg_attr(docsrs, doc(cfg(feature = "transforms")))]
pub use swc_ecma_transforms as transforms;
#[cfg(any(docsrs, feature = "utils"))]
#[cfg_attr(docsrs, doc(cfg(feature = "utils")))]
pub use swc_ecma_utils as utils;
#[cfg(any(docsrs, feature = "visit"))]
#[cfg_attr(docsrs, doc(cfg(feature = "visit")))]
pub use swc_ecma_visit as visit;
