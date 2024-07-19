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
#![cfg_attr(
    feature = "nightly",
    feature(allocator_api, fundamental, with_negative_coherence, box_into_inner)
)]
#![deny(missing_docs)]
#![allow(clippy::derivable_impls)]

pub use crate::alloc::Allocator;

mod alloc;
#[cfg(feature = "nightly")]
pub mod boxed;
pub mod collections;
#[cfg(feature = "nightly")]
pub mod vec;

/// Box<T> and Vec<T> depeding on the feature.
pub mod maybe {
    #[cfg(not(feature = "nightly"))]
    pub use std::{boxed, vec};

    #[cfg(feature = "nightly")]
    pub use crate::{boxed, vec};
}

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
/// It implements [`std::alloc::Allocator`]. So it can be used as the
/// second argument for [`std::boxed::Box`] and
/// [`std::vec::Vec`]. But you should prefer using
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
}

/// This expands to the given tokens if the `nightly` feature is enabled.
#[cfg(feature = "nightly")]
#[macro_export]
macro_rules! nightly_only {
    (
        $($item:item)*
    ) => {
        $(
            #[cfg_attr(docsrs, doc(cfg(feature = "nightly")))]
            $item
        )*
    };
}

/// This expands to the given tokens if the `nightly` feature is enabled.
#[cfg(not(feature = "nightly"))]
#[macro_export]
macro_rules! nightly_only {
    (
        $($item:item)*
    ) => {};
}

/// Usage: `swc_allocator::Type!(Vec<T>)` or `swc_allocator::Type!(Box<T>)`.
#[macro_export]
macro_rules! Type {
    (Box<$($tt:tt)*>) => {
        #[cfg(feature = "nightly")]
        $crate::boxed::Box<$crate::Type!($($tt)*)>

        #[cfg(not(feature = "nightly"))]
        std::boxed::Box<$crate::Type!($($tt)*)>
    };

    (Vec<$($tt:tt)*>) => {
        #[cfg(feature = "nightly")]
        $crate::vec::Vec<$crate::Type!($($tt)*)>

        #[cfg(not(feature = "nightly"))]
        std::vec::Vec<$crate::Type!($($tt)*)>
    };

    ($t:ty) => {
        $t
    };
}
