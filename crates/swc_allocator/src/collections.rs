//! Various collections.

use std::hash::BuildHasherDefault;

use rustc_hash::FxHasher;

#[cfg(feature = "nightly")]
use crate::FastAlloc;

/// See [std::collections::HashMap].
#[cfg(feature = "nightly")]
pub type HashMap<K, V, S> = hashbrown::HashMap<K, V, S, FastAlloc>;

/// See [std::collections::HashSet].
#[cfg(feature = "nightly")]
pub type HashSet<T, S> = hashbrown::HashSet<T, S, FastAlloc>;

/// See [std::collections::HashMap].
#[cfg(not(feature = "nightly"))]
pub type HashMap<K, V, S> = hashbrown::HashMap<K, V, S>;

#[cfg(not(feature = "nightly"))]
/// See [std::collections::HashSet].
pub type HashSet<T, S> = hashbrown::HashSet<T, S>;

/// Used for `FxHashMap` and `FxHashSet`.
pub type FxBuildHasher = BuildHasherDefault<FxHasher>;

/// Faster `HashMap` which uses `FxHasher`.
pub type FxHashMap<K, V> = HashMap<K, V, FxBuildHasher>;

/// Faster `HashSet` which uses `FxHasher`.
pub type FxHashSet<T> = HashSet<T, FxBuildHasher>;

/// Re-export for convenience.
pub use hashbrown::hash_map;
