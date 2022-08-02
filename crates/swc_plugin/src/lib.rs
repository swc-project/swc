#![cfg_attr(docsrs, feature(doc_cfg))]
#[cfg(target_arch = "wasm32")]
pub mod allocation;
pub mod pseudo_scoped_key;
