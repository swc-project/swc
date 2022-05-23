//! Internal module of `swc_ecma_minifier`.
//!
//! This logics are splitted as a separate crate, because a crate is the unit of
//! `cargo build`.
//!
//! This crate **will** make breaking changes without proper version bump.
//! You should not use this crate directly.

mod pure;
