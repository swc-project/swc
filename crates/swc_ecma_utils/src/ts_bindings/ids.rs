//! Arena handles reserve zero for the absence of a relationship. Optional
//! handles therefore occupy one word throughout declaration and member facts.

use std::{fmt, num::NonZeroUsize};

macro_rules! arena_id {
    ($(#[$meta:meta])* $name:ident) => {
        $(#[$meta])*
        #[repr(transparent)]
        #[derive(Clone, Copy, PartialEq, Eq, Hash)]
        pub struct $name(NonZeroUsize);

        impl $name {
            pub(super) fn from_index(index: usize) -> Self {
                // Vec arenas cannot contain usize::MAX entries. Keep this
                // structural invariant checked without exposing raw handles.
                let value = NonZeroUsize::new(index.wrapping_add(1))
                    .expect("binding arena indices must be smaller than usize::MAX");
                Self(value)
            }

            pub(super) fn index(self) -> usize {
                self.0.get() - 1
            }
        }

        impl fmt::Debug for $name {
            fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
                formatter.debug_tuple(stringify!($name)).field(&self.index()).finish()
            }
        }
    };
}

arena_id! {
    /// A same-file namespace or enum owner, including merged declarations.
    TsContainerId
}

arena_id! {
    /// An exported declaration or enum member under one resolved owner.
    TsMemberId
}

arena_id! {
    /// One namespace declaration body's private lexical environment.
    TsNamespaceBodyId
}

arena_id! {
    /// A declaration ID interned once for this analysis phase.
    TsDeclarationId
}

arena_id! {
    /// An import-equals declaration, kept separate from its terminal target.
    TsAliasId
}
