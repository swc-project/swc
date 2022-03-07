//! Utilities to unblock main thread.
//!
//! # Cargo Features
//!
//! ## `enable`
//!
//! This enables fast-mode of this crate.

#![deny(clippy::all)]
#![deny(unused)]

pub use self::fast_drop::*;

mod fast_drop;
