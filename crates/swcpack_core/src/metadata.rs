use std::ops::{Deref, DerefMut};

use tokio::sync::Mutex;
use type_map::concurrent::TypeMap;

/// Base context for each files.
pub struct FileContext<'a> {
    pub file_metadata: &'a mut Metadata,
    pub driver_metadata: &'a Mutex<Metadata>,
}

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
