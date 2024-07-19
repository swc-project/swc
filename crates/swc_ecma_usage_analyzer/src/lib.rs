//! This crate is an internal crate that is extracted just to reduce compile
//! time. Do not use this crate directly, and this package does not follow
//! semver.

#![allow(clippy::mutable_key_type)]

pub mod alias;
pub mod analyzer;
pub mod marks;
pub mod util;
