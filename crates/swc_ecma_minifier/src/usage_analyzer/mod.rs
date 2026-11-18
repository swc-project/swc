//! Internal usage analyzer implementation for `swc_ecma_minifier`.
//!
//! This module was moved from the former standalone usage analyzer crate and is
//! intentionally kept internal to the minifier crate.

#![allow(clippy::mutable_key_type)]
#![allow(dead_code)]

pub mod alias;
pub mod analyzer;
pub mod marks;
pub mod util;
