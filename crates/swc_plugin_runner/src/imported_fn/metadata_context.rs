use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{LazyInit, Memory};

#[derive(wasmer::WasmerEnv, Clone)]
pub struct MetadataContextHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    //pub transform_result: Arc<Mutex<Vec<u8>>>,
}

impl MetadataContextHostEnvironment {
    pub fn new() -> Self {
        MetadataContextHostEnvironment {
            memory: LazyInit::default(),
        }
    }
    /*
    pub fn new(transform_result: &Arc<Mutex<Vec<u8>>>) -> TransformResultHostEnvironment {
        TransformResultHostEnvironment {
            memory: LazyInit::default(),
            transform_result: transform_result.clone(),
        }
    } */
}

pub fn get_raw_experiemtal_transform_context(env: &MetadataContextHostEnvironment) -> u32 {
    0
}
