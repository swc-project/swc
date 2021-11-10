use std::collections::{HashMap, HashSet};

pub type AHashMap<K, V> = HashMap<K, V, ahash::RandomState>;

pub type AHashSet<V> = HashSet<V, ahash::RandomState>;
