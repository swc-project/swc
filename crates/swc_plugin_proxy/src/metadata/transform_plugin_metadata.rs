#[cfg(feature = "plugin-mode")]
use swc_common::Mark;

#[cfg(feature = "plugin-mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use crate::{
    memory_interop::read_returned_result_from_host, PluginCommentsProxy, PluginSourceMapProxy,
};

//#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
//use crate::memory_interop::read_returned_result_from_host;

/// An arbitary metadata for given Program to run transform in plugin.
/// These are not directly attached to Program's AST structures
/// but required for certain transforms.
#[cfg(feature = "plugin-mode")]
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
    /// Stringified JSON value for given plugin's configuration.
    /// This is readonly. Changing value in plugin doesn't affect host's
    /// behavior.
    pub plugin_config: String,
    pub unresolved_mark: Mark,
    /// Stringified JSON value for relative context while running transform,
    /// like filenames.
    /// This is readonly. Changing value in plugin doesn't affect host's
    /// behavior.
    pub transform_context: String,
    /// Non typed, extensible properties without breaking plugin compability
    /// between host.
    ///
    /// Adding a new property to this metadata will be a breaking changes we
    /// can't do freely.
    /// Instead, we use this as a placeholder `@swc/core` may try new metadata.
    /// Once it's proven to be stable with enough usecases, it'll be
    /// promoted to actual property to TransformPluginProgramMetadata with
    /// proper type support.
    ///
    /// There is no typed deserialization support for this unfortunately. Plugin
    /// need to deserialize stringified values manually. In most cases this'll
    /// be JSON type, but depends on the nature of the metadata it may
    /// require different way to deserialize.
    pub experimental: swc_common::collections::AHashMap<String, String>,
}

#[cfg(target_arch = "wasm32")] // Allow testing
extern "C" {
    fn __copy_context_key_to_host_env(bytes_ptr: i32, bytes_ptr_len: i32);
    fn __get_transform_plugin_config(allocated_ret_ptr: i32) -> i32;
    fn __get_transform_context(key: u32, allocated_ret_ptr: i32) -> i32;
    fn __get_experimental_transform_context(allocated_ret_ptr: i32) -> i32;
    fn __get_raw_experiemtal_transform_context(allocated_ret_ptr: i32) -> i32;
}

#[cfg(feature = "plugin-mode")]
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
            let key = swc_common::plugin::serialized::VersionedSerializable::new(key.to_string());
            let serialized =
                swc_common::plugin::serialized::PluginSerializedBytes::try_serialize(&key)
                    .expect("Should be serializable");
            let (key_ptr, key_ptr_len) = serialized.as_ptr();
            __copy_context_key_to_host_env(key_ptr as i32, key_ptr_len as i32);

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
