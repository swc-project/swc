use std::{env, sync::Arc};

use anyhow::{anyhow, Context, Error};
use parking_lot::Mutex;
#[cfg(feature = "encoding-impl")]
use swc_common::plugin::serialized::{PluginError, PluginSerializedBytes};
#[cfg(any(
    feature = "plugin_transform_schema_v1",
    feature = "plugin_transform_schema_vtest"
))]
use swc_common::plugin::PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;
use swc_common::{
    plugin::{diagnostics::PluginCorePkgDiagnostics, metadata::TransformPluginMetadataContext},
    SourceMap,
};

#[cfg(feature = "encoding-impl")]
use crate::{
    host_environment::BaseHostEnvironment,
    imported_fn::{
        build_import_object, comments::CommentHostEnvironment,
        diagnostics::DiagnosticContextHostEnvironment,
        metadata_context::MetadataContextHostEnvironment,
        set_transform_result::TransformResultHostEnvironment, source_map::SourceMapHostEnvironment,
    },
    memory_interop::write_into_memory_view,
};
use crate::{plugin_module_bytes::PluginModuleBytes, runtime};

/// An internal state to the plugin transform.
struct PluginTransformState {
    instance: Box<dyn runtime::Instance>,
    transform_result: Arc<Mutex<Vec<u8>>>,
    #[allow(unused)]
    plugin_core_diag: PluginCorePkgDiagnostics,
}

#[cfg(feature = "encoding-impl")]
impl PluginTransformState {
    fn run(
        mut self,
        program: &PluginSerializedBytes,
        unresolved_mark: swc_common::Mark,
        should_enable_comments_proxy: Option<bool>,
    ) -> Result<PluginSerializedBytes, Error> {
        let should_enable_comments_proxy =
            u32::from(should_enable_comments_proxy.unwrap_or_default());

        // Copy host's serialized bytes into guest (plugin)'s allocated memory.
        let guest_program_ptr = write_into_memory_view(
            &mut *self.instance.caller()?,
            program,
            |caller, serialized_len| {
                let serialized_len = serialized_len
                    .try_into()
                    .expect("Should able to convert size");
                caller.alloc(serialized_len).unwrap_or_else(|_| {
                    panic!("Should able to allocate memory for the size of {serialized_len}")
                })
            },
        );

        let returned_ptr_result = self.instance.transform(
            guest_program_ptr.0,
            guest_program_ptr.1,
            unresolved_mark.as_u32(),
            should_enable_comments_proxy,
        )?;

        self.instance
            .caller()?
            .free(guest_program_ptr.0, guest_program_ptr.1)?;
        self.instance.cleanup()?;

        // Construct serialized struct from raw bytes.
        // Since we have finished transformation, it's safe to fetch the data from
        // Arc<Mutex<T>>
        drop(self.instance);
        let transformed_result = Arc::try_unwrap(self.transform_result)
            .map_err(|_| {
                anyhow!("Failed to unwrap Arc: other references to transform_result exist")
            })?
            .into_inner();
        let ret = PluginSerializedBytes::from_bytes(transformed_result);

        let ret = if returned_ptr_result == 0 {
            Ok(ret)
        } else {
            let err: PluginError = ret.deserialize()?.into_inner();
            match err {
                PluginError::SizeInteropFailure(msg) => Err(anyhow!(
                    "Failed to convert pointer size to calculate: {msg}"
                )),
                PluginError::Deserialize(msg) | PluginError::Serialize(msg) => {
                    Err(anyhow!("{msg}"))
                }
                _ => Err(anyhow!(
                    "Unexpected error occurred while running plugin transform"
                )),
            }
        };

        ret
    }

    /**
     * Check compile-time version of AST schema between the plugin and
     * the host. Returns true if it's compatible, false otherwise.
     *
     * Host should appropriately handle if plugin is not compatible to the
     * current runtime.
     */
    #[allow(unreachable_code)]
    pub fn is_transform_schema_compatible(&mut self) -> Result<(), Error> {
        #[cfg(any(
            feature = "plugin_transform_schema_v1",
            feature = "plugin_transform_schema_vtest"
        ))]
        return {
            let host_schema_version = PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;

            // TODO: this is incomplete
            if host_schema_version >= self.plugin_core_diag.ast_schema_version {
                Ok(())
            } else {
                anyhow::bail!(
                    "Plugin's AST schema version is not compatible with host's. Host: {}, Plugin: \
                     {}",
                    host_schema_version,
                    self.plugin_core_diag.ast_schema_version
                )
            }
        };

        #[cfg(not(all(
            feature = "plugin_transform_schema_v1",
            feature = "plugin_transform_schema_vtest"
        )))]
        anyhow::bail!(
            "Plugin runner cannot detect plugin's schema version. Ensure host is compiled with \
             proper versions"
        )
    }
}

/// A struct encapsule executing a plugin's transform.
pub struct TransformExecutor {
    source_map: Arc<SourceMap>,
    unresolved_mark: swc_common::Mark,
    metadata_context: Arc<TransformPluginMetadataContext>,
    plugin_env_vars: Option<Arc<Vec<swc_atoms::Atom>>>,
    plugin_config: Option<serde_json::Value>,
    module_bytes: Box<dyn PluginModuleBytes>,
    runtime: Arc<dyn runtime::Runtime>,
}

#[cfg(feature = "encoding-impl")]
impl TransformExecutor {
    #[tracing::instrument(
        level = "info",
        skip(source_map, metadata_context, plugin_config, module_bytes, runtime)
    )]
    pub fn new(
        module_bytes: Box<dyn PluginModuleBytes>,
        source_map: &Arc<SourceMap>,
        unresolved_mark: &swc_common::Mark,
        metadata_context: &Arc<TransformPluginMetadataContext>,
        plugin_env_vars: Option<Arc<Vec<swc_atoms::Atom>>>,
        plugin_config: Option<serde_json::Value>,
        runtime: Arc<dyn runtime::Runtime>,
    ) -> Self {
        Self {
            source_map: source_map.clone(),
            unresolved_mark: *unresolved_mark,
            metadata_context: metadata_context.clone(),
            plugin_env_vars,
            plugin_config,
            module_bytes,
            runtime,
        }
    }

    // Import, export, and create memory for the plugin to communicate between host
    // and guest then acquire necessary exports from the plugin.
    fn setup_plugin_env_exports(&mut self) -> Result<PluginTransformState, Error> {
        // First, compile plugin module bytes into wasmer::Module and get the
        // corresponding store
        let module_name = self.module_bytes.get_module_name();
        let module = self.module_bytes.compile_module(&*self.runtime);

        let context_key_buffer = Arc::new(Mutex::new(Vec::new()));
        let metadata_env = Arc::new(MetadataContextHostEnvironment::new(
            &self.metadata_context,
            &self.plugin_config,
            &context_key_buffer,
        ));

        let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(Vec::new()));
        let transform_env = Arc::new(TransformResultHostEnvironment::new(&transform_result));

        let base_env = Arc::new(BaseHostEnvironment::new());

        let comment_buffer = Arc::new(Mutex::new(Vec::new()));
        let comments_env = Arc::new(CommentHostEnvironment::new(&comment_buffer));

        let source_map_buffer = Arc::new(Mutex::new(Vec::new()));
        let source_map = Arc::new(Mutex::new(self.source_map.clone()));
        let source_map_host_env = Arc::new(SourceMapHostEnvironment::new(
            &source_map,
            &source_map_buffer,
        ));

        let diagnostics_buffer: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(Vec::new()));
        let diagnostics_env = Arc::new(DiagnosticContextHostEnvironment::new(&diagnostics_buffer));

        let import_object = build_import_object(
            metadata_env,
            transform_env,
            base_env,
            comments_env,
            source_map_host_env,
            diagnostics_env,
        );
        let envs = self
            .plugin_env_vars
            .iter()
            .flat_map(|list| list.iter())
            .filter_map(|name| {
                std::env::var(name.as_str())
                    .ok()
                    .map(|value| (name.as_str().into(), value))
            })
            .collect::<Vec<_>>();
        let instance = self
            .runtime
            .init(module_name, import_object, envs, module)?;

        let diag_result: PluginCorePkgDiagnostics =
            PluginSerializedBytes::from_bytes(diagnostics_buffer.lock().clone())
                .deserialize()?
                .into_inner();

        Ok(PluginTransformState {
            instance,
            transform_result,
            plugin_core_diag: diag_result,
        })
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn transform(
        &mut self,
        program: &PluginSerializedBytes,
        should_enable_comments_proxy: Option<bool>,
    ) -> Result<PluginSerializedBytes, Error> {
        let mut transform_state = self.setup_plugin_env_exports()?;
        transform_state.is_transform_schema_compatible()?;
        transform_state
            .run(program, self.unresolved_mark, should_enable_comments_proxy)
            .with_context(|| {
                format!(
                    "failed to run Wasm plugin transform. Please ensure the version of `swc_core` \
                     used by the plugin is compatible with the host runtime. See the \
                     documentation for compatibility information. If you are an author of the \
                     plugin, please update `swc_core` to the compatible version.

                Note that if you want to use the os features like filesystem, you need to use \
                     `wasi`. Wasm itself does not have concept of filesystem.

                https://swc.rs/docs/plugin/selecting-swc-core

                See https://plugins.swc.rs/versions/from-plugin-runner/{PKG_VERSION} for the list of the compatible versions.

                Build info:
                    Date: {BUILD_DATE}
                    Timestamp: {BUILD_TIMESTAMP}

                Version info:
                    swc_plugin_runner: {PKG_VERSION}
                    Dependencies: {PKG_DEPS}
                "
                )
            })
    }
}

const BUILD_DATE: &str = env!("VERGEN_BUILD_DATE");
const BUILD_TIMESTAMP: &str = env!("VERGEN_BUILD_TIMESTAMP");
const PKG_VERSION: &str = env!("CARGO_PKG_VERSION");
const PKG_DEPS: &str = env!("VERGEN_CARGO_DEPENDENCIES");
