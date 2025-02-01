//! Various collections.

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

/// Re-export for convenience.
pub use hashbrown::hash_map;
