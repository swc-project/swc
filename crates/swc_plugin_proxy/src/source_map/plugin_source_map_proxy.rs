#![allow(unused_variables)]
#[cfg(feature = "plugin-mode")]
use swc_common::{source_map::FileLinesResult, BytePos, FileName, Loc, SourceMapper, Span};

#[cfg(feature = "plugin-mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use crate::memory_interop::read_returned_result_from_host_fallible;

#[cfg(target_arch = "wasm32")]
extern "C" {
    fn __lookup_char_pos_source_map_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
}

#[cfg(feature = "plugin-mode")]
#[derive(Debug, Copy, Clone)]
pub struct PluginSourceMapProxy;

/// Subset of SourceMap interface supported in plugin.
/// Unlike `Comments`, this does not fully implement `SourceMap`.
#[cfg(feature = "plugin-mode")]
impl SourceMapper for PluginSourceMapProxy {
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __lookup_char_pos_source_map_proxy(pos.0, serialized_ptr)
        })
        .expect("Host should return Loc");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn span_to_lines(&self, sp: Span) -> FileLinesResult {
        unimplemented!("Not implemented yet");
    }

    fn span_to_string(&self, sp: Span) -> String {
        unimplemented!("Not implemented yet");
    }

    fn span_to_filename(&self, sp: Span) -> FileName {
        unimplemented!("Not implemented yet");
    }

    fn merge_spans(&self, sp_lhs: Span, sp_rhs: Span) -> Option<Span> {
        unimplemented!("Not implemented yet");
    }

    fn call_span_if_macro(&self, sp: Span) -> Span {
        unimplemented!("Not implemented yet");
    }

    fn doctest_offset_line(&self, line: usize) -> usize {
        unimplemented!("Not implemented yet");
    }
}
