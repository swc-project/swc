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

pub fn plugins(names: Option<Vec<PluginConfig>>) -> impl Fold {
    #[cfg(feature = "plugin")]
    {
        RustPlugins { plugins: names }
    }

    #[cfg(not(feature = "plugin"))]
    {
        noop()
    }
}

struct RustPlugins {
    plugins: Option<Vec<PluginConfig>>,
}

impl RustPlugins {
    #[cfg(feature = "plugin")]
    fn apply(&self, mut n: Program) -> Result<Program, anyhow::Error> {
        use anyhow::Context;

        if let Some(plugins) = &self.plugins {
            for p in plugins {
                let config_json = serde_json::to_string(&p.1)
                    .context("failed to serialize plugin config as json")?;

                let path = swc_plugin_runner::resolve::resolve(&p.0)?;

                n = swc_plugin_runner::apply_js_plugin(&p.0, &path, &config_json, n)?;
            }
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
