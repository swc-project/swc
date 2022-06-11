//! [JsWord] is an interned string.
//!
//! This type should be used instead of [String] for values, because lots of
//! values are duplicated. For example, if an identifier is named `myVariable`,
//! there will be lots of identifier usages with the value `myVariable`.
//!
//! This type
//!  - makes equality comparison faster.
//!  - reduces memory usage.

#![allow(clippy::unreadable_literal)]

include!(concat!(env!("OUT_DIR"), "/js_word.rs"));

/// An interned string.
#[derive(Debug)]
pub struct Atom(Arc<str>);
