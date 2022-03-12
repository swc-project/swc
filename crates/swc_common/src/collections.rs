#[cfg(not(feature = "fasthash"))]
use self::ahash::*;
#[cfg(feature = "fasthash")]
pub use self::fxhash::*;

#[cfg(feature = "fasthash")]
mod fxhash {
    use std::{
        collections::{HashMap, HashSet},
        hash::BuildHasherDefault,
    };

    use rustc_hash::FxHasher;

    pub type AHashMap<K, V> = HashMap<K, V, BuildHasherDefault<FxHasher>>;

    pub type AHashSet<V> = HashSet<V, BuildHasherDefault<FxHasher>>;
}

#[cfg(not(feature = "fasthash"))]
mod ahash {
    use std::collections::{HashMap, HashSet};

    pub type AHashMap<K, V> = HashMap<K, V, ahash::RandomState>;

    pub type AHashSet<V> = HashSet<V, ahash::RandomState>;
}
