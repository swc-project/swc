//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

#![allow(clippy::needless_doctest_main)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub use crate::alloc::Allocator;

mod alloc;
pub mod boxed;
pub mod vec;

/// Fast allocator, effectively working as a cache.
///
///
///
/// # Misc
///
/// It implements [`allocator_api2::alloc::Allocator`]. So it can be used as the
/// second argument for [`allocator_api2::boxed::Box`] and
/// [`allocator_api2::vec::Vec`]. But you should prefer using
/// [`crate::boxed::Box`] and [`crate::vec::Vec`], which is a wrapper around the
/// original types.
#[derive(Clone, Copy)]
pub struct FastAlloc {
    alloc: Option<&'static Allocator>,
}
