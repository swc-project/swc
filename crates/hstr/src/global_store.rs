use std::borrow::Cow;

use crate::{dynamic::global_atom, Atom};

macro_rules! direct_from_impl {
    ($T:ty) => {
        impl From<$T> for Atom {
            fn from(s: $T) -> Self {
                global_atom(s.into())
            }
        }
    };
}

direct_from_impl!(&'_ str);
direct_from_impl!(Cow<'_, str>);
direct_from_impl!(String);

impl From<Box<str>> for crate::Atom {
    fn from(s: Box<str>) -> Self {
        global_atom(Cow::Owned(String::from(s)))
    }
}
