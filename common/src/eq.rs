use crate::BytePos;
use crate::Span;
use crate::SyntaxContext;
use num_bigint::BigInt;
use std::cell::RefCell;
use std::cmp::PartialEq;
use std::rc::Rc;
use std::sync::Arc;
use string_cache::Atom;

/// Derive with `#[derive(EqIgnoreSpan)]`.
pub trait EqIgnoreSpan {
    fn eq_ignore_span(&self, other: &Self) -> bool;
}

impl EqIgnoreSpan for Span {
    /// Always returns true
    #[inline]
    fn eq_ignore_span(&self, _: &Self) -> bool {
        true
    }
}

impl<T> EqIgnoreSpan for Option<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        match (self, other) {
            (Some(l), Some(r)) => l.eq_ignore_span(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> EqIgnoreSpan for Vec<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.len() == other.len()
            && self
                .iter()
                .zip(other.iter())
                .all(|(a, b)| a.eq_ignore_span(b))
    }
}

/// Derive with `#[derive(TypeEq)]`.
pub trait TypeEq {
    /// **Note**: This method should return `true` for non-type values.
    fn type_eq(&self, other: &Self) -> bool;
}

impl TypeEq for Span {
    /// Always returns true
    #[inline]
    fn type_eq(&self, _: &Self) -> bool {
        true
    }
}

impl<T> TypeEq for Option<T>
where
    T: TypeEq,
{
    fn type_eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Some(l), Some(r)) => l.type_eq(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> TypeEq for Vec<T>
where
    T: TypeEq,
{
    fn type_eq(&self, other: &Self) -> bool {
        self.len() == other.len() && self.iter().zip(other.iter()).all(|(a, b)| a.type_eq(b))
    }
}

/// Implement traits using PartialEq
macro_rules! eq {
    ($T:ty) => {
        impl EqIgnoreSpan for $T {
            #[inline]
            fn eq_ignore_span(&self, other: &Self) -> bool {
                self == other
            }
        }

        impl TypeEq for $T {
            #[inline]
            fn type_eq(&self, other: &Self) -> bool {
                self == other
            }
        }
    };

    (
        $(
            $T:ty
        ),*
    ) => {
        $(
            eq!($T);
        )*
    };
}

eq!(SyntaxContext, BytePos);
eq!(bool);
eq!(usize, u8, u16, u32, u64, u128);
eq!(isize, i8, i16, i32, i64, i128);
eq!(f32, f64);
eq!(char, str, String);

impl<S: PartialEq> EqIgnoreSpan for Atom<S> {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self == other
    }
}

impl<S: PartialEq> TypeEq for Atom<S> {
    #[inline]
    fn type_eq(&self, other: &Self) -> bool {
        self == other
    }
}

macro_rules! deref {
    ($T:ident) => {
        impl<N> EqIgnoreSpan for $T<N>
        where
            N: EqIgnoreSpan,
        {
            #[inline]
            fn eq_ignore_span(&self, other: &Self) -> bool {
                (**self).eq_ignore_span(&**other)
            }
        }

        impl<N> TypeEq for $T<N>
        where
            N: TypeEq,
        {
            #[inline]
            fn type_eq(&self, other: &Self) -> bool {
                (**self).type_eq(&**other)
            }
        }
    };


    (
        $(
            $T:ident
        ),*
    ) => {
        $(
            deref!($T);
        )*
    };
}

deref!(Box, Rc, Arc);

impl<'a, N> EqIgnoreSpan for &'a N
where
    N: EqIgnoreSpan,
{
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        (**self).eq_ignore_span(&**other)
    }
}

impl<'a, N> TypeEq for &'a N
where
    N: TypeEq,
{
    #[inline]
    fn type_eq(&self, other: &Self) -> bool {
        (**self).type_eq(&**other)
    }
}

impl<N> EqIgnoreSpan for RefCell<N>
where
    N: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.borrow().eq_ignore_span(&*other.borrow())
    }
}

impl<N> TypeEq for RefCell<N>
where
    N: TypeEq,
{
    fn type_eq(&self, other: &Self) -> bool {
        self.borrow().type_eq(&*other.borrow())
    }
}

impl EqIgnoreSpan for BigInt {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self == other
    }
}
impl TypeEq for BigInt {
    fn type_eq(&self, other: &Self) -> bool {
        self == other
    }
}
