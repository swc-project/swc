//! Various collections.

use crate::FastAlloc;

/// See [std::collections::HashMap].
pub type HashMap<K, V, S> = hashbrown::HashMap<K, V, S, FastAlloc>;
/// See [std::collections::HashSet].
pub type HashSet<T, S> = hashbrown::HashSet<T, S, FastAlloc>;
