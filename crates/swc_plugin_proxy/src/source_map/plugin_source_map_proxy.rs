#[cfg(feature = "plugin-mode")]
use swc_common::{BytePos, Loc};

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
impl PluginSourceMapProxy {
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    pub fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __lookup_char_pos_source_map_proxy(pos.0, serialized_ptr)
        })
        .expect("Host should return Loc");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }
}
