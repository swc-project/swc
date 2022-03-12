#[cfg(not(feature = "perf"))]
pub use self::ahash::*;
#[cfg(feature = "perf")]
pub use self::fxhash::*;

#[cfg(feature = "perf")]
mod fxhash {
    use std::{
        collections::{HashMap, HashSet},
        hash::BuildHasherDefault,
    };

    use rustc_hash::FxHasher;

    pub type AHashMap<K, V> = HashMap<K, V, BuildHasherDefault<FxHasher>>;

    pub type AHashSet<V> = HashSet<V, BuildHasherDefault<FxHasher>>;
}

#[cfg(not(feature = "perf"))]
mod ahash {
    use std::collections::{HashMap, HashSet};

    pub type AHashMap<K, V> = HashMap<K, V, ahash::RandomState>;

    pub type AHashSet<V> = HashSet<V, ahash::RandomState>;
}
