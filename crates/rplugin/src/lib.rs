//! AST processing plugin system.
//!
//! Designed as a general crate, to support using it from other libraries too.
//! This depends on the [abi_stable] crate.
//!
//! # Why new crate?
//!
//! I (kdy1) wants to pass the AST data to plugin without having to change the
//! type of AST nodes.
//!
//! e.g. Using [RBox](abi_stable::std_types::RBox) instead of
//! [Box](std::boxed::Box) is not an acceptable option, as many users already
//! use swc as a crate.
//!
//! Instead, we just use proc-macro to convert ast into something that can be
//! passed directly to the plugin, using [StableAbi][abi_stable::StableAbi]. In
//! plugin, we convert it back to normal AST before processing, so the plugin
//! authors can use exactly same code as core transforms. Of course, this is
//! slow, but it's only slow if it's compared to the changing type. It's much
//! faster than serializing/deserializing.
//!
//! In short, we do
//!
//! `Normal AST -> Plugin AST -> Normal AST -> plugin -> Normal AST -> Plugin
//! AST -> Normal AST`
//!
//! # Note for potential users
//!
//! Currently this crate depends on `swc_common`, but if there's a request, I
//! can change it to not depend on `swc_common`.

use abi_stable::{
    std_types::{RBox, ROption, RString, RVec},
    StableAbi,
};
pub use rplugin_macros::ast_for_plugin;

/// Implemented by AST nodes that has stable ABI, and passable to plugin.
pub trait StableAst: StableAbi {
    type Unstable: Sized;

    fn from_unstable(n: Self::Unstable) -> Self;

    fn into_unstable(self) -> Self::Unstable;
}

impl<T> StableAst for RBox<T>
where
    T: StableAst,
{
    type Unstable = Box<T::Unstable>;

    fn from_unstable(n: Self::Unstable) -> Self {
        RBox::new(T::from_unstable(*n))
    }

    fn into_unstable(self) -> Self::Unstable {
        Box::new(T::into_unstable(RBox::into_inner(self)))
    }
}

impl<T> StableAst for ROption<T>
where
    T: StableAst,
{
    type Unstable = Option<T::Unstable>;

    fn from_unstable(n: Self::Unstable) -> Self {
        match n {
            Some(v) => ROption::RSome(T::from_unstable(v)),
            None => ROption::RNone,
        }
    }

    fn into_unstable(self) -> Self::Unstable {
        match self {
            ROption::RSome(v) => Some(v.into_unstable()),
            ROption::RNone => None,
        }
    }
}

impl<T> StableAst for RVec<T>
where
    T: StableAst,
{
    type Unstable = Vec<T::Unstable>;

    fn from_unstable(n: Self::Unstable) -> Self {
        n.into_iter().map(T::from_unstable).collect()
    }

    fn into_unstable(self) -> Self::Unstable {
        self.into_iter().map(T::into_unstable).collect()
    }
}

macro_rules! as_is {
    ($T:ty) => {
        /// This is as-is
        impl StableAst for $T {
            type Unstable = $T;
            #[inline(always)]
            fn from_unstable(n: Self::Unstable) -> Self {
                n
            }

            #[inline(always)]
            fn into_unstable(self) -> Self::Unstable {
                self
            }
        }
    };


    (
        $T:ty,
        $($tt:tt),*
    ) => {
        as_is!($T);
        as_is!($($tt),*);
    };
}

as_is!(bool);
as_is!(usize, u8, u16, u32, u64);
as_is!(isize, i8, i16, i32, i64);
as_is!(f32, f64);

macro_rules! convert {
    (
        $U:ty as $T:ty
    ) => {
        impl StableAst for $T {
            type Unstable = $U;

            #[inline(always)]
            fn from_unstable(n: Self::Unstable) -> Self {
                n.into()
            }

            #[inline(always)]
            fn into_unstable(self) -> Self::Unstable {
                self.into()
            }
        }
    };
}

convert!(String as RString);

as_is!(swc_common::Span);
