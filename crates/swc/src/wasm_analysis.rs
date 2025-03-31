#![cfg(feature = "plugin")]

use std::sync::Arc;

use anyhow::{Context, Result};
use common::{
    comments::Comments,
    errors::Handler,
    plugin::{metadata::TransformPluginMetadataContext, serialized::PluginSerializedBytes},
    Mark, SourceFile, GLOBALS,
};
use par_iter::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::Deserialize;
use swc_config::IsModule;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::resolver;

use crate::{config::ErrorFormat, plugin::PluginConfig, Compiler};

impl Compiler {
    /// Run analysis using Wasm plugins.
    pub fn run_wasm_analysis(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &WasmAnalysisOptions,
        comments: &dyn Comments,
    ) -> Result<String> {
        crate::config::init_plugin_module_cache_once(true, &opts.cache_root);

        self.run(|| {
            GLOBALS.with(|globals| {
                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();

                let mut program = self.parse_js(
                    fm.clone(),
                    handler,
                    EsVersion::latest(),
                    opts.parser,
                    opts.module,
                    Some(&comments),
                )?;

                program.mutate(resolver(
                    unresolved_mark,
                    top_level_mark,
                    opts.parser.typescript(),
                ));

                let serialized = {
                    let _span = tracing::span!(tracing::Level::INFO, "serialize_program").entered();
                    let program =
                        swc_common::plugin::serialized::VersionedSerializable::new(program);
                    PluginSerializedBytes::try_serialize(&program)?
                };

                let transform_metadata_context = Arc::new(TransformPluginMetadataContext::new(
                    Some(fm.name.to_string()),
                    crate::config::default_env_name(),
                    None,
                ));

                let result = opts
                    .plugins
                    .par_iter()
                    .map(|p| {
                        GLOBALS.set(globals, || {
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
                                    .map(std::path::PathBuf::from),
                            );
                            let mut transform_plugin_executor =
                                swc_plugin_runner::create_plugin_transform_executor(
                                    &self.cm,
                                    &unresolved_mark,
                                    &transform_metadata_context,
                                    plugin_module_bytes,
                                    Some(p.1.clone()),
                                    runtime,
                                );

                            let span = tracing::span!(
                                tracing::Level::INFO,
                                "execute_plugin_runner",
                                plugin_module = p.0.as_str()
                            )
                            .entered();

                            let (result, output) = swc_transform_common::output::capture(|| {
                                transform_plugin_executor
                                    .transform(&serialized, Some(true))
                                    .with_context(|| {
                                        format!(
                                            "failed to invoke `{}` as js analysis plugin at {}",
                                            &p.0, plugin_name
                                        )
                                    })
                            });
                            result?;
                            drop(span);

                            Ok(output)
                        })
                    })
                    .collect::<Result<Vec<_>>>()?;

                serde_json::to_string(&result)
                    .map_err(|e| anyhow::anyhow!("Failed to serialize output: {e}"))
            })
        })
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WasmAnalysisOptions {
    #[serde(default)]
    pub parser: Syntax,
    #[serde(default)]
    pub module: IsModule,

    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default)]
    pub error_format: ErrorFormat,

    pub plugins: Vec<PluginConfig>,

    #[serde(default)]
    pub cache_root: Option<String>,
}
