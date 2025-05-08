//! Configuration for swc
#![cfg_attr(docsrs, feature(doc_cfg))]

#[doc(cfg(feature = "is_module"))]
#[cfg(any(feature = "is_module", docsrs))]
pub mod is_module;
pub mod merge;
#[doc(cfg(feature = "regex"))]
#[cfg(any(feature = "regex", docsrs))]
pub mod regex;
#[cfg_attr(docsrs, doc(cfg(feature = "sourcemap")))]
#[cfg(any(feature = "sourcemap", docsrs))]
pub mod source_map;
pub mod types;
