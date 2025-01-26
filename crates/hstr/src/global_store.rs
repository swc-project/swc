use std::{borrow::Cow, cell::RefCell};

use crate::{Atom, AtomStore};

fn atom(text: Cow<str>) -> Atom {
    thread_local! {
        static GLOBAL_DATA: RefCell<AtomStore> = Default::default();
    }

    GLOBAL_DATA.with(|global| {
        let mut store = global.borrow_mut();

        store.atom(text)
    })
}

macro_rules! direct_from_impl {
    ($T:ty) => {
        impl From<$T> for Atom {
            fn from(s: $T) -> Self {
                atom(s.into())
            }
        }
    };
}

direct_from_impl!(&'_ str);
direct_from_impl!(Cow<'_, str>);
direct_from_impl!(String);

impl From<Box<str>> for crate::Atom {
    fn from(s: Box<str>) -> Self {
        atom(Cow::Owned(String::from(s)))
    }
}
