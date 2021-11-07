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

use abi_stable::{
    reexports::True,
    std_types::{RBox, RVec},
    StableAbi,
};

/// Implemented for normal AST nodes.
///
/// Note that `swc` uses cargo feature named `plugin` to avoid making
/// compilation slower for users if they don't need plugin support.
pub trait UnstableAst {
    type Stable: StableAbi;

    fn from_stable(n: Self::Stable) -> Self;

    fn into_stable(self) -> Self::Stable;
}

impl<T> UnstableAst for Box<T>
where
    T: UnstableAst,
{
    type Stable = RBox<T::Stable>;

    #[inline]
    fn from_stable(n: Self::Stable) -> Self {
        Box::new(T::from_stable(RBox::into_inner(n)))
    }

    #[inline]
    fn into_stable(self) -> Self::Stable {
        RBox::new((*self).into_stable())
    }
}

impl<T> UnstableAst for Option<T>
where
    T: UnstableAst,
    T::Stable: StableAbi<IsNonZeroType = True>,
{
    type Stable = Option<T::Stable>;

    #[inline]
    fn from_stable(n: Self::Stable) -> Self {
        n.map(T::from_stable)
    }

    #[inline]
    fn into_stable(self) -> Self::Stable {
        self.map(T::into_stable)
    }
}

impl<T> UnstableAst for Vec<T>
where
    T: UnstableAst,
{
    type Stable = RVec<T::Stable>;

    #[inline]
    fn from_stable(n: Self::Stable) -> Self {
        n.into_iter().map(|v| T::from_stable(v)).collect()
    }

    #[inline]
    fn into_stable(self) -> Self::Stable {
        self.into_iter().map(|v| v.into_stable()).collect()
    }
}

macro_rules! as_is {
    ($T:ty) => {
        /// This is as-is
        impl UnstableAst for $T {
            type Stable = $T;
            #[inline(always)]
            fn from_stable(n: Self::Stable) -> Self {
                n
            }

            #[inline(always)]
            fn into_stable(self) -> Self::Stable {
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
