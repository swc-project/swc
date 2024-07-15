//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

#![allow(clippy::needless_doctest_main)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub use crate::alloc::Allocator;

mod alloc;
pub mod boxed;
pub mod vec;

#[derive(Clone, Copy)]
pub struct FastAlloc {
    alloc: Option<&'static Allocator>,
}
