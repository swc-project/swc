//! Allocator for swc.
//!
//! # Features
//!
//! - `scoped`: Enable `scoped` mode.
//!
//! # Modes
//!
//! ## Default mode
//!
//! In default mode, [crate::boxed::Box] and [crate::vec::Vec] are identical to
//! the original types in [std].
//!
//! ## Scoped mode
//!
//! - You need to enable `scoped` feature to use this mode.
//!
//! In `scoped` mode you can use [FastAlloc] to make [crate::boxed::Box] and
//! [crate::vec::Vec] very fast.
//!
//! In this mode, you need to be careful while using [crate::boxed::Box] and
//! [crate::vec::Vec]. You should ensure that [Allocator] outlives all
//! [crate::boxed::Box] and [crate::vec::Vec] created in the scope.
//!
//! Recommened way to use this mode is to wrap the whole operations in
//! a call to [Allocator::scope].

#![allow(clippy::needless_doctest_main)]
#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(missing_docs)]
#![allow(clippy::derivable_impls)]
#![feature(fundamental, fn_ptr_trait, with_negative_coherence)]

/// NOT A PUBLIC API.
#[doc(hidden)]
pub extern crate allocator_api2;
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

impl FastAlloc {
    /// [crate::boxed::Box] or [crate::vec::Vec] created with this instance is
    /// managed by the global allocator and it can outlive the
    /// [crate::Allocator] instance used for [Allocator::scope].
    pub const fn global() -> Self {
        Self {
            #[cfg(feature = "scoped")]
            alloc: None,
        }
    }
/// Creates a `Vec<T>` from a list of elements.
/// Creates a new instance of [crate::vec::Vec]
#[macro_export]
macro_rules! vec {
    () => (
        $crate::vec::Vec::new()
    );
    ($elem:expr; $n:expr) => (
        $crate::vec::from_elem_in($elem, $n, $crate::FastAlloc::default())
    );
    ($($x:expr),+ $(,)?) => (
        $crate::boxed::Box::<[_]>::into_vec(
            $crate::boxed::Box::slice(
                $crate::boxed::Box::new([$($x),+])
            ),
            $crate::FastAlloc::default()
        )
    );
}
