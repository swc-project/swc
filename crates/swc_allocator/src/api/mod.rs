//! Various flavors of allocator.

/// Re-export for convenience.
#[cfg(feature = "hashbrown")]
pub extern crate hashbrown;

macro_rules! impl_api {
    ($alloc:ident) => {
        #[cfg(feature = "hashbrown")]
        use rustc_hash::FxBuildHasher;

        /// See [`hashbrown::HashMap`].
        #[cfg(feature = "hashbrown")]
        pub type HashMap<K, V, S = FxBuildHasher, A = $alloc> = hashbrown::HashMap<K, V, S, A>;

        /// See [`hashbrown::HashSet`].
        #[cfg(feature = "hashbrown")]
        pub type HashSet<T, S = FxBuildHasher, A = $alloc> = hashbrown::HashSet<T, S, A>;

        /// See [`crate::Box`].
        pub type Box<T, A = $alloc> = crate::Box<T, A>;

        /// See [`std::vec::Vec`].
        pub type Vec<T, A = $alloc> = crate::Vec<T, A>;
    };
}

pub mod arena {
    #![allow(deprecated)]

    use crate::allocators::Arena;
    impl_api!(Arena);
}

pub mod scoped {
    #![allow(deprecated)]

    use crate::allocators::Scoped;
    impl_api!(Scoped);
}

pub mod global {
    #![allow(deprecated)]
    use crate::allocators::Global;

    impl_api!(Global);
}
