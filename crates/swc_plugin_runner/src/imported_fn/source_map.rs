#![allow(dead_code)]

use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::{
    plugin::serialized::{PluginSerializedBytes, VersionedSerializable},
    source_map::{PartialFileLines, PartialLoc},
    BytePos, SourceMap, SourceMapper, Span,
};
use wasmer::{AsStoreMut, FunctionEnvMut, Memory, TypedFunction};

use crate::memory_interop::{allocate_return_values_into_guest, write_into_memory_view};

/// External environment state for imported (declared in host, injected into
/// guest) fn for source map proxy.
#[derive(Clone)]
pub struct SourceMapHostEnvironment {
    pub memory: Option<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    pub alloc_guest_memory: Option<TypedFunction<u32, u32>>,
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
            memory: None,
            alloc_guest_memory: None,
            source_map: source_map.clone(),
            mutable_source_map_buffer: mutable_source_map_buffer.clone(),
        }
    }
}

/// Returns `Loc` form given bytepos to the guest.
/// Returned `Loc` is partial, which excludes `SourceFile` from original struct
/// to avoid unnecessary data copying.
#[tracing::instrument(level = "info", skip_all)]
pub fn lookup_char_pos_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    byte_pos: u32,
    should_include_source_file: i32,
    allocated_ret_ptr: u32,
) -> u32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let original_loc = (env.data().source_map.lock()).lookup_char_pos(BytePos(byte_pos));
    let ret = VersionedSerializable::new(PartialLoc {
        source_file: if should_include_source_file == 0 {
            None
        } else {
            Some(original_loc.file)
        },
        line: original_loc.line,
        col: original_loc.col.0,
        col_display: original_loc.col_display,
    });

    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&ret).expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn doctest_offset_line_proxy(env: FunctionEnvMut<SourceMapHostEnvironment>, orig: u32) -> u32 {
    (env.data().source_map.lock()).doctest_offset_line(orig as usize) as u32
}

#[allow(clippy::too_many_arguments)]
#[tracing::instrument(level = "info", skip_all)]
pub fn merge_spans_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    lhs_lo: u32,
    lhs_hi: u32,
    rhs_lo: u32,
    rhs_hi: u32,
    allocated_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let sp_lhs = Span {
        lo: BytePos(lhs_lo),
        hi: BytePos(lhs_hi),
    };

    let sp_rhs = Span {
        lo: BytePos(rhs_lo),
        hi: BytePos(rhs_hi),
    };

    let ret = (env.data().source_map.lock()).merge_spans(sp_lhs, sp_rhs);
    if let Some(span) = ret {
        let span = VersionedSerializable::new(span);
        let serialized_bytes =
            PluginSerializedBytes::try_serialize(&span).expect("Should be serializable");
        write_into_memory_view(
            memory,
            &mut env.as_store_mut(),
            &serialized_bytes,
            |_, _| allocated_ptr,
        );
        1
    } else {
        0
    }
}

#[tracing::instrument(level = "info", skip_all)]
pub fn span_to_lines_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    span_lo: u32,
    span_hi: u32,
    should_request_source_file: i32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let span = Span {
        lo: BytePos(span_lo),
        hi: BytePos(span_hi),
    };

    let ret = (env.data().source_map.lock())
        .span_to_lines(span)
        .map(|lines| PartialFileLines {
            file: if should_request_source_file == 0 {
                None
            } else {
                Some(lines.file)
            },
            lines: lines.lines,
        });

    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&VersionedSerializable::new(ret))
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn lookup_byte_offset_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    byte_pos: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let byte_pos = BytePos(byte_pos);
    let ret = (env.data().source_map.lock()).lookup_byte_offset(byte_pos);

    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&VersionedSerializable::new(ret))
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn span_to_string_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    span_lo: u32,
    span_hi: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let span = Span {
        lo: BytePos(span_lo),
        hi: BytePos(span_hi),
    };
    let ret = (env.data().source_map.lock()).span_to_string(span);
    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&VersionedSerializable::new(ret))
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn span_to_filename_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    span_lo: u32,
    span_hi: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let span = Span {
        lo: BytePos(span_lo),
        hi: BytePos(span_hi),
    };
    let ret = (env.data().source_map.lock()).span_to_filename(span);
    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&VersionedSerializable::new(ret))
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn span_to_source_proxy(
    mut env: FunctionEnvMut<SourceMapHostEnvironment>,
    span_lo: u32,
    span_hi: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let span = Span {
        lo: BytePos(span_lo),
        hi: BytePos(span_hi),
    };
    let ret = (*env.data().source_map.lock()).span_to_snippet(span);
    let serialized_loc_bytes =
        PluginSerializedBytes::try_serialize(&VersionedSerializable::new(ret))
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_loc_bytes,
    );
    1
}
