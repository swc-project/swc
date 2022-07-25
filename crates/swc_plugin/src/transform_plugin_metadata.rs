use swc_plugin_proxy::{PluginCommentsProxy, PluginSourceMapProxy};

/// An arbitary metadata for given Program to run transform in plugin.
/// These are not directly attached to Program's AST structures
/// but required for certain transforms.
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
    pub unresolved_mark: crate::syntax_pos::Mark,
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
    fn __get_raw_experiemtal_transform_context();
}

impl TransformPluginProgramMetadata {
    pub fn get_context() {
        unimplemented!()
    }

    pub fn get_raw_context() {
        unimplemented!()
    }

    /// Returns non typed, extensible metadata properties without breaking
    /// plugin compability between host.
    ///
    /// `@swc/core` internally keeps a placeholder storage for adding new
    /// metadata without making a breaking changes, plugin can ask to return
    /// these values.
    ///
    /// There is no typed deserialization support for this unfortunately. Plugin
    /// need to deserialize stringified values manually.
    ///
    /// Note these metadata values can be changed anytime. There is no gaurantee
    /// values will be available across different @swc/core versions.
    pub fn get_experimental_context(key: &str) -> String {
        unimplemented!()
    }

    /// Returns experimental metadata context, but returns whole value as a
    /// HashMap.
    pub fn get_raw_experimental_context() -> swc_common::collections::AHashMap<String, String> {
        unimplemented!()
    }
}
