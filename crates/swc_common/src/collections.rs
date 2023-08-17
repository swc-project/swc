#[cfg(feature = "ahash")]
pub use self::ahash::*;
#[cfg(not(feature = "ahash"))]
pub use self::rustchash::*;

#[cfg(not(feature = "ahash"))]
mod rustchash {
    use std::{
        collections::{HashMap, HashSet},
        hash::BuildHasherDefault,
    };

    use rustc_hash::FxHasher;

    pub type ARandomState = BuildHasherDefault<FxHasher>;

    pub type AHashMap<K, V> = HashMap<K, V, ARandomState>;

    pub type AHashSet<V> = HashSet<V, ARandomState>;
}

#[cfg(feature = "ahash")]
mod ahash {
    use std::collections::{HashMap, HashSet};

    pub type ARandomState = ahash::RandomState;

    pub type AHashMap<K, V> = HashMap<K, V, ARandomState>;

    pub type AHashSet<V> = HashSet<V, ARandomState>;
}
