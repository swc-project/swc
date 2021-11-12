use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicU32, Ordering::SeqCst};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct ModuleId(u32);

#[derive(Debug, Default)]
pub struct ModuleIdGenerator {
    gen: AtomicU32,
}

impl ModuleIdGenerator {
    pub fn next(&self) -> ModuleId {
        ModuleId(self.gen.fetch_add(1, SeqCst))
    }
}
