use std::{
    ops::Deref,
    sync::{atomic::AtomicU32, Arc},
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ResourceId(u32);

#[derive(Debug, Clone)]
pub struct ResourceIdGenerator {
    id: Arc<AtomicU32>,
}

impl ResourceIdGenerator {
    pub fn gen(&self) -> ResourceId {
        ResourceId(self.id.fetch_add(1, std::sync::atomic::Ordering::SeqCst))
    }
}

impl Default for ResourceIdGenerator {
    fn default() -> Self {
        Self {
            id: Arc::new(AtomicU32::from(1)),
        }
    }
}

/// The type for change propagation.
#[derive(Debug)]
pub struct Res<T> {
    id: ResourceId,

    /// The actual data. It's stored in [Arc]
    data: Arc<T>,
}

impl<T> Res<T> {
    pub fn id(&self) -> ResourceId {
        self.id
    }

    pub fn new(generator: &ResourceIdGenerator, data: T) -> Self {
        Self {
            id: generator.gen(),
            data: Arc::new(data),
        }
    }

    pub fn ptr_eq(&self, other: &Self) -> bool {
        Arc::ptr_eq(&self.data, &other.data)
    }
}

impl<T> Clone for Res<T> {
    fn clone(&self) -> Self {
        Self {
            id: self.id,
            data: self.data.clone(),
        }
    }
}

impl<T> Deref for Res<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.data
    }
}
