use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::{plugin::Serialized, BytePos, SourceMap};
use wasmer::{LazyInit, Memory, NativeFunc};

use crate::memory_interop::allocate_return_values_into_guest;

/// External environment state for imported (declared in host, injected into
/// guest) fn for source map proxy.
#[derive(wasmer::WasmerEnv, Clone)]
pub struct SourceMapHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    #[wasmer(export(name = "__alloc"))]
    pub alloc_guest_memory: LazyInit<NativeFunc<u32, i32>>,
    pub source_map: Arc<Mutex<Arc<SourceMap>>>,
    /// A buffer to non-determined size of return value from the host.
    pub mutable_source_map_buffer: Arc<Mutex<Vec<u8>>>,
}

impl SourceMapHostEnvironment {
    pub fn new(
        source_map: &Arc<Mutex<Arc<SourceMap>>>,
        mutable_source_map_buffer: &Arc<Mutex<Vec<u8>>>,
    ) -> SourceMapHostEnvironment {
        SourceMapHostEnvironment {
            memory: LazyInit::default(),
            alloc_guest_memory: LazyInit::default(),
            source_map: source_map.clone(),
            mutable_source_map_buffer: mutable_source_map_buffer.clone(),
        }
    }
}

pub fn lookup_char_pos_proxy(
    env: &SourceMapHostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    if let Some(memory) = env.memory_ref() {
        let ret = (env.source_map.lock()).lookup_char_pos(BytePos(byte_pos));
        let serialized_loc_bytes = Serialized::serialize(&ret).expect("Should be serializable");

        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            allocate_return_values_into_guest(
                memory,
                alloc_guest_memory,
                allocated_ret_ptr,
                &serialized_loc_bytes,
            );
            1
        } else {
            0
        }
    } else {
        0
    }
}
