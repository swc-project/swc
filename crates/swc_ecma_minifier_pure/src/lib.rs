//! You are **NOT** allowed to use this crate directly. It's violation of
//! license. This is internal module of `swc_ecma_minifier`, and you are allowed
//! to use this crate only as a dependency of `swc_ecma_minifier`.
//!
//! # License
//!
//! This crate is `APACHE-2.0` **iff** you are using this crate via
//! `swc_ecma_minifier`. Otherwise, you are **NOT** allowed to use this crate.
//!
//! ## The reason
//!
//! Internal logics of minifier changes quite frequently, and maintaining
//! version of this crate correctly is way too much maintenance burden.
//!
//! # Why new crate?
//!
//! `cargo build` for the minifier takes too much time, and it makes development
//! harder. As a crate is the unit of build in `cargo` world, we need a new
//! crate.
//!    
//! # The cargo license
//!
//! Note: This crate specifies the cargo license as `APACHE-2.0`, because this
//! crate is an internal module of `swc_ecma_minifier`, which is `APACHE-2.0`.
//! It will also avoid needless headaches due to licensing issue for correct
//! (indirect) users.
