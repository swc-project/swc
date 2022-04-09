use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::{plugin::Serialized, BytePos, SourceMap};
use wasmer::{LazyInit, Memory};

use crate::memory_interop::write_into_memory_view;

/// External environment state for imported (declared in host, injected into
/// guest) fn for source map proxy.
#[derive(wasmer::WasmerEnv, Clone)]
pub struct SourceMapHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    pub source_map: Arc<Mutex<Arc<SourceMap>>>,
}

impl SourceMapHostEnvironment {
    pub fn new(source_map: &Arc<Mutex<Arc<SourceMap>>>) -> SourceMapHostEnvironment {
        SourceMapHostEnvironment {
            memory: LazyInit::default(),
            source_map: source_map.clone(),
        }
    }
}

pub fn lookup_char_pos_proxy(env: &SourceMapHostEnvironment, byte_pos: u32, allocated_ptr: i32) {
    let ret = (env.source_map.lock()).lookup_char_pos(BytePos(byte_pos));

    if let Some(memory) = env.memory_ref() {
        let serialized_bytes = Serialized::serialize(&ret).expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}
