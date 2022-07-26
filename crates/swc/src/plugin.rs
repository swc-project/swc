//! This module always exists because cfg attributes are not stabilized in
//! expressions at the moment.

#![cfg_attr(any(not(feature = "plugin"), target_arch = "wasm32"), allow(unused))]

use serde::{Deserialize, Serialize};
#[cfg(feature = "plugin")]
use swc_ecma_ast::*;
use swc_ecma_loader::resolvers::{lru::CachingResolver, node::NodeModulesResolver};
#[cfg(not(feature = "plugin"))]
use swc_ecma_transforms::pass::noop;
use swc_ecma_visit::{noop_fold_type, Fold};

/// A tuple represents a plugin.
/// First element is a resolvable name to the plugin, second is a JSON object
/// that represents configuration option for those plugin.
/// Type of plugin's configuration is up to each plugin - swc/core does not have
/// strong type and it'll be serialized into plain string when it's passed to
/// plugin's entrypoint function.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct PluginConfig(String, serde_json::Value);

/// Struct represents arbitrary `context` or `state` to be passed to plugin's
/// entrypoint.
/// While internally this is strongly typed, it is not exposed as public
/// interface to plugin's entrypoint but instead will be passed as JSON string.
/// First, not all of plugins will need to deserialize this - plugin may opt in
/// to access when it's needed. Secondly, we do not have way to avoid breaking
/// changes when adding a new property. We may change this to typed
/// deserialization in the future if we have add-only schema support with
/// serialization / deserialization.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct PluginContext {
    /// The path of the file being processed. This includes all of the path as
    /// much as possible.
    pub filename: Option<String>,
    /// The current environment resolved as process.env.SWC_ENV ||
    /// process.env.NODE_ENV || "development"
    pub env_name: String,
}

#[cfg(feature = "plugin")]
pub fn plugins(
    resolver: Option<CachingResolver<NodeModulesResolver>>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    config: crate::config::JscExperimental,
    plugin_context: PluginContext,
    unresolved_mark: swc_common::Mark,
) -> impl Fold {
    {
        RustPlugins {
            resolver,
            comments,
            source_map,
            plugins: config.plugins,
            plugin_context,
            unresolved_mark,
        }
    }
}

#[cfg(not(feature = "plugin"))]
pub fn plugins() -> impl Fold {
    noop()
}

struct RustPlugins {
    resolver: Option<CachingResolver<NodeModulesResolver>>,
    comments: Option<swc_common::comments::SingleThreadedComments>,
    plugins: Option<Vec<PluginConfig>>,
    source_map: std::sync::Arc<swc_common::SourceMap>,
    plugin_context: PluginContext,
    unresolved_mark: swc_common::Mark,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;

        self.apply_inner(n).with_context(|| {
            format!(
                "failed to invoke plugin on '{:?}'",
                self.plugin_context.filename
            )
        })
    }

    #[tracing::instrument(level = "info", skip_all, name = "apply_plugins")]
    #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
    fn apply_inner(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use std::{path::PathBuf, sync::Arc};

        use anyhow::Context;
        use swc_common::{
            collections::AHashMap,
            plugin::{PluginSerializedBytes, VersionedSerializable},
            FileName,
        };
        use swc_ecma_loader::resolve::Resolve;

        // swc_plugin_macro will not inject proxy to the comments if comments is empty
        let should_enable_comments_proxy = self.comments.is_some();

        // Set comments once per whole plugin transform execution.
        swc_plugin_proxy::COMMENTS.set(
            &swc_plugin_proxy::HostCommentsStorage {
                inner: self.comments.clone(),
            },
            || {
                let span = tracing::span!(tracing::Level::INFO, "serialize_program").entered();
                let program = VersionedSerializable::new(n);
                let mut serialized_program = PluginSerializedBytes::try_serialize(&program)?;
                drop(span);

                // Run plugin transformation against current program.
                // We do not serialize / deserialize between each plugin execution but
                // copies raw transformed bytes directly into plugin's memory space.
                // Note: This doesn't mean plugin won't perform any se/deserialization: it
                // still have to construct from raw bytes internally to perform actual
                // transform.
                if let Some(plugins) = &self.plugins {
                    for p in plugins {
                        let resolved_path = self
                            .resolver
                            .as_ref()
                            .expect("filesystem_cache should provide resolver")
                            .resolve(&FileName::Real(PathBuf::from(&p.0)), &p.0)?;

                        let path = if let FileName::Real(value) = resolved_path {
                            Arc::new(value)
                        } else {
                            anyhow::bail!("Failed to resolve plugin path: {:?}", resolved_path);
                        };

                        let mut transform_plugin_executor =
                            swc_plugin_runner::create_plugin_transform_executor(
                                &path,
                                &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                                &self.source_map,
                            )?;

                        if !transform_plugin_executor.is_transform_schema_compatible()? {
                            anyhow::bail!("Cannot execute incompatible plugin {}", &p.0);
                        }

                        let span = tracing::span!(
                            tracing::Level::INFO,
                            "serialize_context",
                            plugin_module = p.0.as_str()
                        );
                        let context_span_guard = span.enter();

                        let serialized_config_json = serde_json::to_string(&p.1)
                            .context("Failed to serialize plugin config as json")
                            .and_then(|value| {
                                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                                    value,
                                ))
                            })?;

                        let serialized_context_json = serde_json::to_string(&self.plugin_context)
                            .context("Failed to serialize plugin context as json")
                            .and_then(|value| {
                                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                                    value,
                                ))
                            })?;
                        drop(context_span_guard);

                        let span = tracing::span!(
                            tracing::Level::INFO,
                            "execute_plugin_runner",
                            plugin_module = p.0.as_str()
                        )
                        .entered();

                        // Forward host side experimental metadata into plugin.
                        // This is currently not being used, reserved to enable proper serialization
                        // transform.
                        let experimental_metadata: AHashMap<String, String> = AHashMap::default();
                        let experimental_metadata_reserved = PluginSerializedBytes::try_serialize(
                            &VersionedSerializable::new(experimental_metadata),
                        )?;

                        serialized_program = transform_plugin_executor
                            .transform(
                                &serialized_program,
                                &serialized_config_json,
                                &serialized_context_json,
                                &experimental_metadata_reserved,
                                self.unresolved_mark,
                                should_enable_comments_proxy,
                            )
                            .with_context(|| {
                                format!(
                                    "failed to invoke `{}` as js transform plugin at {}",
                                    &p.0,
                                    path.display()
                                )
                            })?;
                        drop(span);
                    }
                }

                // Plugin transformation is done. Deserialize transformed bytes back
                // into Program
                serialized_program.deserialize().map(|v| v.into_inner())
            },
        )
    }

    #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
    fn apply_inner(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use std::{path::PathBuf, sync::Arc};

        use anyhow::Context;
        use swc_common::{
            collections::AHashMap,
            plugin::{PluginSerializedBytes, VersionedSerializable},
            FileName,
        };
        use swc_ecma_loader::resolve::Resolve;

        let should_enable_comments_proxy = self.comments.is_some();

        swc_plugin_proxy::COMMENTS.set(
            &swc_plugin_proxy::HostCommentsStorage {
                inner: self.comments.clone(),
            },
            || {
                let program = VersionedSerializable::new(n);
                let mut serialized_program = PluginSerializedBytes::try_serialize(&program)?;

                if let Some(plugins) = &self.plugins {
                    for p in plugins {
                        let serialized_config_json = serde_json::to_string(&p.1)
                            .context("Failed to serialize plugin config as json")
                            .and_then(|value| {
                                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                                    value,
                                ))
                            })?;

                        let serialized_context_json = serde_json::to_string(&self.plugin_context)
                            .context("Failed to serialize plugin context as json")
                            .and_then(|value| {
                                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(
                                    value,
                                ))
                            })?;

                        let mut transform_plugin_executor =
                            swc_plugin_runner::create_plugin_transform_executor(
                                &PathBuf::from(&p.0),
                                &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                                &self.source_map,
                            )?;

                        // Forward host side experimental metadata into plugin.
                        // This is currently not being used, reserved to enable proper serialization
                        // transform.
                        let experimental_metadata: AHashMap<String, String> = AHashMap::default();
                        let experimental_metadata_reserved = PluginSerializedBytes::try_serialize(
                            &VersionedSerializable::new(experimental_metadata),
                        )?;

                        serialized_program = transform_plugin_executor
                            .transform(
                                &serialized_program,
                                &serialized_config_json,
                                &serialized_context_json,
                                &experimental_metadata_reserved,
                                self.unresolved_mark,
                                should_enable_comments_proxy,
                            )
                            .with_context(|| {
                                format!("failed to invoke `{}` as js transform plugin", &p.0)
                            })?;
                    }
                }

                serialized_program.deserialize().map(|v| v.into_inner())
            },
        )
    }
}

impl Fold for RustPlugins {
    noop_fold_type!();

    #[cfg(feature = "plugin")]
    fn fold_module(&mut self, n: Module) -> Module {
        self.apply(Program::Module(n))
            .expect("failed to invoke plugin")
            .expect_module()
    }

    #[cfg(feature = "plugin")]
    fn fold_script(&mut self, n: Script) -> Script {
        self.apply(Program::Script(n))
            .expect("failed to invoke plugin")
            .expect_script()
    }
}
