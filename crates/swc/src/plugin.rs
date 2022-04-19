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
) -> impl Fold {
    {
        RustPlugins {
            resolver,
            comments,
            source_map,
            plugins: config.plugins,
            plugin_context,
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
}

impl RustPlugins {
    #[tracing::instrument(level = "info", skip_all, name = "apply_plugins")]
    #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use std::{path::PathBuf, sync::Arc};

        use anyhow::Context;
        use swc_common::{plugin::Serialized, FileName};
        use swc_ecma_loader::resolve::Resolve;

        // swc_plugin_macro will not inject proxy to the comments if comments is empty
        let should_enable_comments_proxy = self.comments.is_some();

        // Set comments once per whole plugin transform execution.
        swc_plugin_proxy::COMMENTS.set(
            &swc_plugin_proxy::HostCommentsStorage {
                inner: self.comments.clone(),
            },
            || {
                let mut serialized = Serialized::serialize(&n)?;

                // Run plugin transformation against current program.
                // We do not serialize / deserialize between each plugin execution but
                // copies raw transformed bytes directly into plugin's memory space.
                // Note: This doesn't mean plugin won't perform any se/deserialization: it
                // still have to construct from raw bytes internally to perform actual
                // transform.
                if let Some(plugins) = &self.plugins {
                    for p in plugins {
                        let span = tracing::span!(
                            tracing::Level::INFO,
                            "serialize_context",
                            plugin_module = p.0.as_str()
                        );
                        let context_span_guard = span.enter();

                        let config_json = serde_json::to_string(&p.1)
                            .context("Failed to serialize plugin config as json")
                            .and_then(|value| Serialized::serialize(&value))?;

                        let context_json = serde_json::to_string(&self.plugin_context)
                            .context("Failed to serialize plugin context as json")
                            .and_then(|value| Serialized::serialize(&value))?;

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
                        drop(context_span_guard);

                        let span = tracing::span!(
                            tracing::Level::INFO,
                            "execute_plugin_runner",
                            plugin_module = p.0.as_str()
                        );
                        let transform_span_guard = span.enter();
                        serialized = swc_plugin_runner::apply_transform_plugin(
                            &p.0,
                            &path,
                            &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                            serialized,
                            config_json,
                            context_json,
                            should_enable_comments_proxy,
                            &self.source_map,
                        )?;
                        drop(transform_span_guard);
                    }
                }

                // Plugin transformation is done. Deserialize transformed bytes back
                // into Program
                Serialized::deserialize(&serialized)
            },
        )
    }

    #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use std::{path::PathBuf, sync::Arc};

        use anyhow::Context;
        use swc_common::{plugin::Serialized, FileName};
        use swc_ecma_loader::resolve::Resolve;

        let should_enable_comments_proxy = self.comments.is_some();

        swc_plugin_proxy::COMMENTS.set(
            &swc_plugin_proxy::HostCommentsStorage {
                inner: self.comments.clone(),
            },
            || {
                let mut serialized = Serialized::serialize(&n)?;

                if let Some(plugins) = &self.plugins {
                    for p in plugins {
                        let config_json = serde_json::to_string(&p.1)
                            .context("Failed to serialize plugin config as json")
                            .and_then(|value| Serialized::serialize(&value))?;

                        let context_json = serde_json::to_string(&self.plugin_context)
                            .context("Failed to serialize plugin context as json")
                            .and_then(|value| Serialized::serialize(&value))?;

                        serialized = swc_plugin_runner::apply_transform_plugin(
                            &p.0,
                            &PathBuf::from(&p.0),
                            &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                            serialized,
                            config_json,
                            context_json,
                            should_enable_comments_proxy,
                            &self.source_map,
                        )?;
                    }
                }

                Serialized::deserialize(&serialized)
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
