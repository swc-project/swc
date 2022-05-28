use std::ops::{Deref, DerefMut};

use type_map::concurrent::TypeMap;

/// TypeMap
///
///
/// Metadata can be collected from [crate::Plugin].
#[derive(Debug, Default)]
pub struct Metadata {
    map: TypeMap,
}

/// TODO: Implement these directly
impl Deref for Metadata {
    type Target = TypeMap;

    fn deref(&self) -> &Self::Target {
        &self.map
    }
}

impl DerefMut for Metadata {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.map
    }
}
