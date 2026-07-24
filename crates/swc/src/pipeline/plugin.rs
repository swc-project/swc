#[cfg(feature = "plugin")]
use std::sync::Arc;

#[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
use anyhow::Context;
use anyhow::Error;
#[cfg(feature = "plugin")]
use swc_atoms::Atom;
#[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
use swc_common::FileName;
use swc_ecma_ast::{Pass, Program};

use super::{
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};
use crate::config::PluginConfig;

/// The single checkpoint at which a runtime plugin observes the program.
#[derive(Clone, Copy, PartialEq, Eq)]
pub(super) enum PluginPlacement {
    BeforeSyntax,
    AfterSyntax,
}

/// Runtime plugin configuration and its syntax-stage placement.
pub(super) struct PluginOptions {
    pub(super) placement: PluginPlacement,
    pub(super) plugins: Option<Vec<PluginConfig>>,
    #[cfg(feature = "plugin")]
    pub(super) plugin_env_vars: Option<Vec<Atom>>,
    #[cfg(feature = "plugin")]
    pub(super) cache_root: Option<String>,
    #[cfg(feature = "plugin")]
    pub(super) env_name: String,
    #[cfg(feature = "plugin")]
    pub(super) runtime: Option<Arc<dyn swc_plugin_runner::runtime::Runtime>>,
}

/// A runtime plugin scheduled at one syntax-stage checkpoint.
pub(super) struct RuntimePlugin {
    pass: Option<Box<dyn Pass>>,
    placement: PluginPlacement,
}

impl RuntimePlugin {
    fn process(&mut self, program: &mut Program) {
        if let Some(pass) = &mut self.pass {
            pass.process(program);
        }
    }

    /// Runs a plugin configured to observe the program before lint execution
    /// and lowering.
    pub(super) fn process_before_syntax(&mut self, program: &mut Program) {
        if self.placement == PluginPlacement::BeforeSyntax {
            self.process(program);
        }
    }

    /// Runs a plugin configured to observe the program after syntax lowering.
    pub(super) fn process_after_syntax(&mut self, program: &mut Program) {
        if self.placement == PluginPlacement::AfterSyntax {
            self.process(program);
        }
    }
}

impl Pipeline<'_> {
    pub(super) fn create_runtime_plugin(
        &self,
        _unit: &CompilationUnit,
        context: &PipelineContextData,
        options: PluginOptions,
    ) -> Result<RuntimePlugin, Error> {
        #[cfg(all(feature = "plugin", not(target_arch = "wasm32")))]
        {
            use swc_common::plugin::metadata::TransformPluginMetadataContext;

            let PluginOptions {
                placement,
                plugins,
                plugin_env_vars,
                cache_root,
                env_name,
                runtime,
            } = options;
            let transform_filename = match &*_unit.source_file.name {
                FileName::Real(path) => path.as_os_str().to_str().map(String::from),
                FileName::Custom(filename) => Some(filename.to_owned()),
                _ => None,
            };
            let transform_metadata_context = Arc::new(TransformPluginMetadataContext::new(
                transform_filename,
                env_name,
                None,
            ));
            let plugin_runtime = runtime.context("plugin runtime not configured")?;

            if let Some(plugins) = &plugins {
                crate::plugin::compile_wasm_plugins(
                    cache_root.as_deref(),
                    plugins,
                    &*plugin_runtime,
                )
                .context("Failed to compile wasm plugins")?;
            }

            let pass = crate::plugin::plugins(
                plugins,
                plugin_env_vars,
                transform_metadata_context,
                Some(_unit.comments.clone()),
                self.compiler.cm.clone(),
                context.unresolved_mark,
                plugin_runtime,
            );

            Ok(RuntimePlugin {
                pass: Some(Box::new(pass)),
                placement,
            })
        }

        #[cfg(all(feature = "plugin", target_arch = "wasm32"))]
        {
            let placement = options.placement;
            let _ = (context, options);
            self.handler.warn(
                "Currently @swc/wasm does not support plugins, plugin transform will be skipped. \
                 Refer https://github.com/swc-project/swc/issues/3934 for the details.",
            );

            return Ok(RuntimePlugin {
                pass: None,
                placement,
            });
        }

        #[cfg(not(feature = "plugin"))]
        {
            let _ = context;
            let placement = options.placement;
            if options.plugins.is_some() {
                self.handler.warn(
                    "Plugin is not supported with current @swc/core. Plugin transform will be \
                     skipped.",
                );
            }

            Ok(RuntimePlugin {
                pass: None,
                placement,
            })
        }
    }
}
