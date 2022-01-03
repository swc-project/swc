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

struct PluginBinary(String, Vec<u8>, String);

pub fn plugins(config: crate::config::JscExperimental) -> impl Fold {
    #[cfg(feature = "plugin")]
    {
        use anyhow::Context;

        let mut plugin_binaries = vec![];
        let mut plugin_errors = vec![];

        if let Some(plugins) = &config.plugins {
            for p in plugins {
                let config_json = serde_json::to_string(&p.1)
                    .context("failed to serialize plugin config as json");

                if config_json.is_err() {
                    plugin_errors.push(config_json.err().unwrap());
                    continue;
                }

                let path = swc_plugin_runner::resolve::resolve(&p.0);

                if path.is_err() {
                    plugin_errors.push(path.err().unwrap());
                    continue;
                }

                let module_bytes = std::fs::read(&path.unwrap().as_ref());

                if module_bytes.is_err() {
                    plugin_errors.push(
                        module_bytes
                            .context("Failed to read plugin binary")
                            .err()
                            .unwrap(),
                    );
                    continue;
                }

                plugin_binaries.push(PluginBinary(
                    p.0.clone(),
                    module_bytes.ok().unwrap(),
                    config_json.ok().unwrap(),
                ));
            }
        };

        let cache_root =
            swc_plugin_runner::resolve::resolve_plugin_cache_root(config.cache_root).ok();

        RustPlugins {
            plugins: plugin_binaries,
            plugin_errors,
            plugin_cache: cache_root,
        }
    }

    #[cfg(not(feature = "plugin"))]
    {
        noop()
    }
}

struct RustPlugins {
    plugins: Vec<PluginBinary>,
    plugin_errors: Vec<anyhow::Error>,
    /// TODO: it is unclear how we'll support plugin itself in wasm target of
    /// swc, as well as cache.
    #[cfg(feature = "plugin")]
    plugin_cache: Option<swc_plugin_runner::resolve::PluginCache>,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&mut self, mut n: Program) -> Result<Program, anyhow::Error> {
        for e in self.plugin_errors.drain(..) {
            return Err(e);
        }

        for p in &self.plugins {
            n = swc_plugin_runner::apply_js_plugin(&p.0, &p.1, &mut self.plugin_cache, &p.2, n)?;
        }

        Ok(n)
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
