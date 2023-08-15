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

    pub type AHashMap<K, V> = HashMap<K, V, BuildHasherDefault<FxHasher>>;

    pub type AHashSet<V> = HashSet<V, BuildHasherDefault<FxHasher>>;
}

#[cfg(feature = "ahash")]
mod ahash {
    use std::collections::{HashMap, HashSet};

    pub type AHashMap<K, V> = HashMap<K, V, ahash::RandomState>;

    pub type AHashSet<V> = HashSet<V, ahash::RandomState>;
}
