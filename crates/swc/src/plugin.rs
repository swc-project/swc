//! This module always exists because cfg attributes are not stabilized in
//! expressions at the moment.

#![cfg_attr(
    any(not(any(feature = "plugin")), target_arch = "wasm32"),
    allow(unused)
)]

use serde::{Deserialize, Serialize};
use swc_common::errors::HANDLER;
use swc_ecma_ast::Pass;
#[cfg(feature = "plugin")]
use swc_ecma_ast::*;
use swc_ecma_visit::{fold_pass, noop_fold_type, Fold};

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

pub fn plugins(
    configured_plugins: Option<Vec<PluginConfig>>,
    metadata_context: std::sync::Arc<swc_common::plugin::metadata::TransformPluginMetadataContext>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    unresolved_mark: swc_common::Mark,
) -> impl Pass {
    fold_pass(RustPlugins {
        plugins: configured_plugins,
        metadata_context,
        comments,
        source_map,
        unresolved_mark,
    })
}

struct RustPlugins {
    plugins: Option<Vec<PluginConfig>>,
    metadata_context: std::sync::Arc<swc_common::plugin::metadata::TransformPluginMetadataContext>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    unresolved_mark: swc_common::Mark,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;
        if self.plugins.is_none() || self.plugins.as_ref().unwrap().is_empty() {
            return Ok(n);
        }

        let filename = self.metadata_context.filename.clone();

        if cfg!(feature = "manual-tokio-runtmie") {
            self.apply_inner(n)
        } else {
            let fut = async move { self.apply_inner(n) };
            if let Ok(handle) = tokio::runtime::Handle::try_current() {
                handle.block_on(fut)
            } else {
                tokio::runtime::Runtime::new().unwrap().block_on(fut)
            }
        }
        .with_context(|| format!("failed to invoke plugin on '{filename:?}'"))
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
                            .get(&p.0)
                            .expect("plugin module should be loaded");

                        let plugin_name = plugin_module_bytes.get_module_name().to_string();
                        let runtime = swc_plugin_runner::wasix_runtime::build_wasi_runtime(
                            crate::config::PLUGIN_MODULE_CACHE
                                .inner
                                .get()
                                .unwrap()
                                .lock()
                                .get_fs_cache_root()
                                .map(|v| std::path::PathBuf::from(v)),
                        );
                        let mut transform_plugin_executor =
                            swc_plugin_runner::create_plugin_transform_executor(
                                &self.source_map,
                                &self.unresolved_mark,
                                &self.metadata_context,
                                plugin_module_bytes,
                                Some(p.1),
                                runtime,
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

impl Fold for RustPlugins {
    noop_fold_type!();

    #[cfg(feature = "plugin")]
    fn fold_module(&mut self, n: Module) -> Module {
        match self.apply(Program::Module(n)) {
            Ok(program) => program.expect_module(),
            Err(err) => {
                HANDLER.with(|handler| {
                    handler.err(&err.to_string());
                });
                Module::default()
            }
        }
    }

    #[cfg(feature = "plugin")]
    fn fold_script(&mut self, n: Script) -> Script {
        match self.apply(Program::Script(n)) {
            Ok(program) => program.expect_script(),
            Err(err) => {
                HANDLER.with(|handler| {
                    handler.err(&err.to_string());
                });
                Script::default()
            }
        }
    }
}
