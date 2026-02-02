//! This module always exists because cfg attributes are not stabilized in
//! expressions at the moment.

#![cfg_attr(
    any(not(any(feature = "plugin")), target_arch = "wasm32"),
    allow(unused)
)]

use std::{path::PathBuf, sync::Arc};

use anyhow::{Context, Result};
use atoms::Atom;
use common::FileName;
#[cfg(all(feature = "plugin", not(feature = "manual-tokio-runtime")))]
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_common::errors::{DiagnosticId, HANDLER};
use swc_ecma_ast::Pass;
#[cfg(feature = "plugin")]
use swc_ecma_ast::*;
use swc_ecma_loader::{
    resolve::Resolve,
    resolvers::{lru::CachingResolver, node::NodeModulesResolver},
};
use swc_ecma_visit::{fold_pass, noop_fold_type, Fold};
#[cfg(feature = "plugin")]
use swc_plugin_runner::runtime::Runtime as PluginRuntime;

/// Shared tokio runtime for plugin execution.
/// This avoids the expensive overhead of creating a new runtime for each plugin
/// call.
#[cfg(all(feature = "plugin", not(feature = "manual-tokio-runtime")))]
static SHARED_RUNTIME: Lazy<tokio::runtime::Runtime> = Lazy::new(|| {
    tokio::runtime::Runtime::new()
        .expect("Failed to create shared tokio runtime for plugin execution")
});

/// A tuple represents a plugin.
///
/// First element is a resolvable name to the plugin, second is a JSON object
/// that represents configuration option for those plugin.
/// Type of plugin's configuration is up to each plugin - swc/core does not have
/// strong type and it'll be serialized into plain string when it's passed to
/// plugin's entrypoint function.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct PluginConfig(pub String, pub serde_json::Value);

#[cfg(feature = "plugin")]
pub(crate) fn plugins(
    configured_plugins: Option<Vec<PluginConfig>>,
    plugin_env_vars: Option<Vec<Atom>>,
    metadata_context: std::sync::Arc<swc_common::plugin::metadata::TransformPluginMetadataContext>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    unresolved_mark: swc_common::Mark,
    plugin_runtime: Arc<dyn PluginRuntime>,
) -> impl Pass {
    fold_pass(RustPlugins {
        plugins: configured_plugins,
        plugin_env_vars: plugin_env_vars.map(std::sync::Arc::new),
        metadata_context,
        comments,
        source_map,
        unresolved_mark,
        plugin_runtime,
    })
}

#[cfg(feature = "plugin")]
struct RustPlugins {
    plugins: Option<Vec<PluginConfig>>,
    plugin_env_vars: Option<std::sync::Arc<Vec<Atom>>>,
    metadata_context: std::sync::Arc<swc_common::plugin::metadata::TransformPluginMetadataContext>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    unresolved_mark: swc_common::Mark,
    plugin_runtime: Arc<dyn PluginRuntime>,
}

#[cfg(feature = "plugin")]
impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;

        if self.plugins.is_none() || self.plugins.as_ref().unwrap().is_empty() {
            return Ok(n);
        }

        let filename = self.metadata_context.filename.clone();

        #[cfg(feature = "manual-tokio-runtime")]
        let ret = self
            .apply_inner(n)
            .with_context(|| format!("failed to invoke plugin on '{filename:?}'"));

        #[cfg(not(feature = "manual-tokio-runtime"))]
        let ret = {
            let fut = async move { self.apply_inner(n) };
            if let Ok(handle) = tokio::runtime::Handle::try_current() {
                handle.block_on(fut)
            } else {
                SHARED_RUNTIME.block_on(fut)
            }
            .with_context(|| format!("failed to invoke plugin on '{filename:?}'"))
        };

        ret
    }

    #[tracing::instrument(level = "info", skip_all, name = "apply_plugins")]
    #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
    fn apply_inner(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;
        use swc_common::plugin::serialized::PluginSerializedBytes;

        // swc_plugin_macro will not inject proxy to the comments if comments is empty
        let should_enable_comments_proxy = self.comments.is_some();

        // Set comments once per whole plugin transform execution.
        swc_plugin_proxy::COMMENTS.set(
            &swc_plugin_proxy::HostCommentsStorage {
                inner: self.comments.clone(),
            },
            || {
                let span = tracing::span!(tracing::Level::INFO, "serialize_program").entered();
                let program = swc_common::plugin::serialized::VersionedSerializable::new(n);
                let mut serialized = PluginSerializedBytes::try_serialize(&program)?;
                drop(span);

                // Run plugin transformation against current program.
                // We do not serialize / deserialize between each plugin execution but
                // copies raw transformed bytes directly into plugin's memory space.
                // Note: This doesn't mean plugin won't perform any se/deserialization: it
                // still have to construct from raw bytes internally to perform actual
                // transform.
                if let Some(plugins) = &mut self.plugins {
                    for p in plugins.drain(..) {
                        let plugin_module_bytes = crate::config::PLUGIN_MODULE_CACHE
                            .inner
                            .get()
                            .unwrap()
                            .lock()
                            .get(&*self.plugin_runtime, &p.0)
                            .expect("plugin module should be loaded");

                        let plugin_name = plugin_module_bytes.get_module_name().to_string();

                        let mut transform_plugin_executor =
                            swc_plugin_runner::create_plugin_transform_executor(
                                &self.source_map,
                                &self.unresolved_mark,
                                &self.metadata_context,
                                self.plugin_env_vars.clone(),
                                plugin_module_bytes,
                                Some(p.1),
                                self.plugin_runtime.clone(),
                            );

                        let span = tracing::span!(
                            tracing::Level::INFO,
                            "execute_plugin_runner",
                            plugin_module = p.0.as_str()
                        )
                        .entered();

                        serialized = transform_plugin_executor
                            .transform(&serialized, Some(should_enable_comments_proxy))
                            .with_context(|| {
                                format!(
                                    "failed to invoke `{}` as js transform plugin at {}",
                                    &p.0, plugin_name
                                )
                            })?;
                        drop(span);
                    }
                }

                // Plugin transformation is done. Deserialize transformed bytes back
                // into Program
                serialized.deserialize().map(|v| v.into_inner())
            },
        )
    }

    #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
    #[tracing::instrument(level = "info", skip_all)]
    fn apply_inner(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        // [TODO]: unimplemented
        n
    }
}

#[cfg(feature = "plugin")]
impl Fold for RustPlugins {
    noop_fold_type!();

    fn fold_module(&mut self, n: Module) -> Module {
        match self.apply(Program::Module(n)) {
            Ok(program) => program.expect_module(),
            Err(err) => {
                HANDLER.with(|handler| {
                    handler.err_with_code(&err.to_string(), DiagnosticId::Error("plugin".into()));
                });
                Module::default()
            }
        }
    }

    fn fold_script(&mut self, n: Script) -> Script {
        match self.apply(Program::Script(n)) {
            Ok(program) => program.expect_script(),
            Err(err) => {
                HANDLER.with(|handler| {
                    handler.err_with_code(&err.to_string(), DiagnosticId::Error("plugin".into()));
                });
                Script::default()
            }
        }
    }
}

#[cfg(feature = "plugin")]
pub(crate) fn compile_wasm_plugins(
    cache_root: Option<&str>,
    plugins: &[PluginConfig],
    #[cfg(feature = "plugin")] plugin_runtime: &dyn PluginRuntime,
) -> Result<()> {
    let plugin_resolver = CachingResolver::new(
        40,
        NodeModulesResolver::new(swc_ecma_loader::TargetEnv::Node, Default::default(), true),
    );

    // Currently swc enables filesystemcache by default on Embedded runtime plugin
    // target.
    crate::config::init_plugin_module_cache_once(true, cache_root);

    let mut inner_cache = crate::config::PLUGIN_MODULE_CACHE
        .inner
        .get()
        .expect("Cache should be available")
        .lock();

    // Populate cache to the plugin modules if not loaded
    for plugin_config in plugins.iter() {
        let plugin_name = &plugin_config.0;

        if !inner_cache.contains(plugin_runtime, plugin_name) {
            let resolved_path = plugin_resolver
                .resolve(&FileName::Real(PathBuf::from(plugin_name)), plugin_name)
                .with_context(|| format!("failed to resolve plugin path: {plugin_name}"))?;

            let path = if let FileName::Real(value) = resolved_path.filename {
                value
            } else {
                anyhow::bail!("Failed to resolve plugin path: {resolved_path:?}");
            };

            inner_cache.store_bytes_from_path(plugin_runtime, &path, plugin_name)?;
            tracing::debug!("Initialized WASM plugin {plugin_name}");
        }
    }

    Ok(())
}
