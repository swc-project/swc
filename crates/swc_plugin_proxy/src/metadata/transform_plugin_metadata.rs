#[cfg(feature = "__plugin_mode")]
use swc_common::Mark;
#[cfg(feature = "__plugin_mode")]
use swc_trace_macro::swc_trace;

#[cfg(all(feature = "__rkyv", feature = "__plugin_mode", target_arch = "wasm32"))]
use crate::memory_interop::read_returned_result_from_host;
#[cfg(feature = "__plugin_mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use crate::{PluginCommentsProxy, PluginSourceMapProxy};

//#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
//use crate::memory_interop::read_returned_result_from_host;

/// An arbitary metadata for given Program to run transform in plugin.
/// These are not directly attached to Program's AST structures
/// but required for certain transforms.
#[cfg(feature = "__plugin_mode")]
#[derive(Debug)]
pub struct TransformPluginProgramMetadata {
    /// Proxy to the comments for the Program passed into plugin.
    /// This is a proxy to the actual data lives in the host. Only when plugin
    /// attempts to read these it'll ask to the host to get values.
    pub comments: Option<PluginCommentsProxy>,
    /// Proxy to the sourceMap for the Program passed into plugin.
    /// This is a proxy to the actual data lives in the host. Only when plugin
    /// attempts to read these it'll ask to the host to get values.
    pub source_map: PluginSourceMapProxy,
    pub unresolved_mark: Mark,
}

#[cfg(target_arch = "wasm32")] // Allow testing
extern "C" {
    fn __copy_context_key_to_host_env(bytes_ptr: u32, bytes_ptr_len: u32);
    fn __get_transform_plugin_config(allocated_ret_ptr: u32) -> u32;
    fn __get_transform_context(key: u32, allocated_ret_ptr: u32) -> u32;
    fn __get_experimental_transform_context(allocated_ret_ptr: u32) -> u32;
    fn __get_raw_experiemtal_transform_context(allocated_ret_ptr: u32) -> u32;
}

#[cfg(feature = "__plugin_mode")]
#[swc_trace]
impl TransformPluginProgramMetadata {
    /// Returns current plugin's configuration as a JSON string.
    /// Plugin may need to deserialize this string manually.
    pub fn get_transform_plugin_config(&self) -> Option<String> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_transform_plugin_config(serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    /// Returns metadata value for given key.
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    pub fn get_context(
        &self,
        key: &swc_common::plugin::metadata::TransformPluginMetadataContextKind,
    ) -> Option<String> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_transform_context(*key as u32, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    /// Returns an experimental metadata value if exists. Returned value is
    /// always a String, but depends on the nature of the metadata it may
    /// require additional postprocessing.
    ///
    /// Each time this is called, it'll require a call between host-plugin which
    /// involves serialization / deserialization.
    ///
    /// Note these metadata values can be changed anytime. There is no gaurantee
    /// values will be available across different @swc/core versions.
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    pub fn get_experimental_context(&self, key: &str) -> Option<String> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            let serialized = swc_common::plugin::serialized::PluginSerializedBytes::try_serialize(
                &key.to_string(),
            )
            .expect("Should be serializable");
            let (key_ptr, key_ptr_len) = serialized.as_ptr();
            __copy_context_key_to_host_env(key_ptr as u32, key_ptr_len as u32);

            __get_experimental_transform_context(serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    /// Returns experimental metadata context, but returns whole value as a
    /// HashMap.
    ///
    /// Each time this is called, it'll require a call between host-plugin which
    /// involves serialization / deserialization.
    #[allow(unreachable_code)]
    pub fn get_raw_experimental_context(
        &self,
    ) -> swc_common::collections::AHashMap<String, String> {
        // TODO: There is no clear usecase yet - enable when we have a correct usecase.
        unimplemented!("Not supported yet");

        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_raw_experiemtal_transform_context(serialized_ptr)
        })
        .expect("Raw experimental metadata should exists, even if it's empty map");

        #[cfg(not(target_arch = "wasm32"))]
        swc_common::collections::AHashMap::default()
    }
}
