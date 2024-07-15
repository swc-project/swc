//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

#![allow(clippy::needless_doctest_main)]
#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(missing_docs)]
#![allow(clippy::derivable_impls)]

pub use crate::alloc::Allocator;

mod alloc;
pub mod boxed;
pub mod vec;

/// Fast allocator, effectively working as a cache.
///
/// This type implements [Default] and [Copy]. This type is intended to stored
/// in a variable or a field in a struct before allocating code, and used as the
/// seocnd argument in [crate::boxed::Box::new_in] and
/// [crate::vec::Vec::new_in].
///
/// [crate::boxed::Box::new] and [crate::vec::Vec::new] are slower than using
/// this field because they use [FastAlloc::default] internally, which is slower
/// than store [FastAlloc] in a variable.
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
    #[cfg(feature = "scoped")]
    alloc: Option<&'static Allocator>,
}
