//! This module always exists because cfg attributes are not stabilized in
//! expressions at the moment.

#![cfg_attr(not(feature = "plugin"), allow(unused))]

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

/// Struct represents arbitary `context` or `state` to be passed to plugin's
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
}

pub fn plugins(
    resolver: CachingResolver<NodeModulesResolver>,
    config: crate::config::JscExperimental,
    plugin_context: PluginContext,
) -> impl Fold {
    #[cfg(feature = "plugin")]
    {
        RustPlugins {
            resolver,
            plugins: config.plugins,
            plugin_context,
        }
    }

    #[cfg(not(feature = "plugin"))]
    {
        noop()
    }
}

struct RustPlugins {
    resolver: CachingResolver<NodeModulesResolver>,
    plugins: Option<Vec<PluginConfig>>,
    plugin_context: PluginContext,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use std::{path::PathBuf, sync::Arc};

        use anyhow::Context;
        use swc_common::{plugin::Serialized, FileName};
        use swc_ecma_loader::resolve::Resolve;

        let mut serialized = Serialized::serialize(&n)?;

        // Run plugin transformation against current program.
        // We do not serialize / deserialize between each plugin execution but
        // copies raw transformed bytes directly into plugin's memory space.
        // Note: This doesn't mean plugin won't perform any se/deserialization: it
        // still have to construct from raw bytes internally to perform actual
        // transform.
        if let Some(plugins) = &self.plugins {
            for p in plugins {
                let config_json = serde_json::to_string(&p.1)
                    .context("Failed to serialize plugin config as json")
                    .and_then(|value| Serialized::serialize(&value))?;

                let context_json = serde_json::to_string(&self.plugin_context)
                    .context("Failed to serialize plugin context as json")
                    .and_then(|value| Serialized::serialize(&value))?;

                let resolved_path = self
                    .resolver
                    .resolve(&FileName::Real(PathBuf::from(&p.0)), &p.0)?;

                let path = if let FileName::Real(value) = resolved_path {
                    Arc::new(value)
                } else {
                    anyhow::bail!("Failed to resolve plugin path: {:?}", resolved_path);
                };

                serialized = swc_plugin_runner::apply_js_plugin(
                    &p.0,
                    &path,
                    &swc_plugin_runner::cache::PLUGIN_MODULE_CACHE,
                    serialized,
                    config_json,
                    context_json,
                )?;
            }
        }

        // Plugin transformation is done. Deserialize transformed bytes back
        // into Program
        Serialized::deserialize(&serialized)
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
