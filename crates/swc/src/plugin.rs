//! This module always exists because cfg attributes are not stabilized in
//! expressions at the moment.

#![cfg_attr(not(feature = "plugin"), allow(unused))]

use serde::{Deserialize, Serialize};
#[cfg(feature = "plugin")]
use swc_ecma_ast::*;
#[cfg(not(feature = "plugin"))]
use swc_ecma_transforms::pass::noop;
use swc_ecma_visit::{noop_fold_type, Fold};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct PluginConfig(String, serde_json::Value);

pub fn plugins(config: crate::config::JscExperimental) -> impl Fold {
    #[cfg(feature = "plugin")]
    {
        let cache_root =
            swc_plugin_runner::resolve::resolve_plugin_cache_root(config.cache_root).ok();

        RustPlugins {
            plugins: config.plugins,
            plugin_cache: cache_root,
        }
    }

    #[cfg(not(feature = "plugin"))]
    {
        noop()
    }
}

struct RustPlugins {
    plugins: Option<Vec<PluginConfig>>,
    /// TODO: it is unclear how we'll support plugin itself in wasm target of
    /// swc, as well as cache.
    #[cfg(feature = "plugin")]
    plugin_cache: Option<swc_plugin_runner::resolve::PluginCache>,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;
        use rkyv::Deserialize;
        use swc_common::plugin::{serialize_for_plugin, SerializedProgram};

        let mut serialized = SerializedProgram(serialize_for_plugin(&n)?);

        // Run plugin transformation against current program.
        // We do not serialize / deserialize across each plugin execution but
        // copies raw transformed bytes directly into plugin's memory space.
        if let Some(plugins) = &self.plugins {
            for p in plugins {
                let config_json = serde_json::to_string(&p.1)
                    .context("failed to serialize plugin config as json")?;

                let path = swc_plugin_runner::resolve::resolve(&p.0)?;

                serialized = swc_plugin_runner::apply_js_plugin(
                    &p.0,
                    &path,
                    &mut self.plugin_cache,
                    &config_json,
                    serialized,
                )?;
            }
        }

        // Plugin transformation is complete, now we do deserialize transformed bytes
        // into Program
        let archived = unsafe { rkyv::archived_root::<Program>(&serialized.0[..]) };
        let transformed_program: Program = archived.deserialize(&mut rkyv::Infallible).unwrap();

        Ok(transformed_program)
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
