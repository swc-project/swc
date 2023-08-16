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

    pub type ARandomState = BuildHasherDefault<FxHasher>;

    pub type AHashMap<K, V> = HashMap<K, V, ARandomState>;

    pub type AHashSet<V> = HashSet<V, ARandomState>;
}

#[cfg(not(feature = "perf"))]
mod ahash {
    use std::collections::{HashMap, HashSet};

    pub type ARandomState = ahash::RandomState;

    pub type AHashMap<K, V> = HashMap<K, V, ARandomState>;

    pub type AHashSet<V> = HashSet<V, ARandomState>;
}
