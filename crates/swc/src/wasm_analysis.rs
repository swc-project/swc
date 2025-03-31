#![cfg(feature = "plugin")]

use std::sync::Arc;

use anyhow::{Context, Result};
use common::{
    comments::Comments,
    errors::Handler,
    plugin::{metadata::TransformPluginMetadataContext, serialized::PluginSerializedBytes},
    Mark, SourceFile, GLOBALS,
};
use par_iter::iter::{IndexedParallelIterator, IntoParallelRefIterator, ParallelIterator};
use rustc_hash::FxHashMap;
use serde::Deserialize;
use swc_config::IsModule;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::resolver;

use crate::{
    config::ErrorFormat,
    plugin::{compile_wasm_plugins, PluginConfig},
    Compiler,
};

impl Compiler {
    /// Run analysis using Wasm plugins.
    pub fn run_wasm_analysis(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &WasmAnalysisOptions,
        comments: &dyn Comments,
    ) -> Result<String> {
        if cfg!(feature = "manual-tokio-runtime") {
            self.run_wasm_analysis_inner(fm.clone(), handler, opts, comments)
        } else {
            let fm = fm.clone();

            let fut = async move { self.run_wasm_analysis_inner(fm, handler, opts, comments) };
            if let Ok(handle) = tokio::runtime::Handle::try_current() {
                handle.block_on(fut)
            } else {
                tokio::runtime::Runtime::new().unwrap().block_on(fut)
            }
        }
        .with_context(|| format!("failed to analyze '{:?}'", fm.name))
    }

    fn run_wasm_analysis_inner(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &WasmAnalysisOptions,
        comments: &dyn Comments,
    ) -> Result<String> {
        compile_wasm_plugins(opts.cache_root.as_deref(), &opts.plugins)?;

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
                    .with_min_len(1)
                    .map(|p| {
                        GLOBALS.set(globals, || {
                            self.inovke_wasm_analysis_plugin(
                                &serialized,
                                unresolved_mark,
                                &transform_metadata_context,
                                p,
                            )
                        })
                    })
                    .collect::<Result<Vec<_>>>()?;

                serde_json::to_string(&result)
                    .map_err(|e| anyhow::anyhow!("Failed to serialize output: {e}"))
            })
        })
    }

    fn inovke_wasm_analysis_plugin(
        &self,
        serialized: &PluginSerializedBytes,
        unresolved_mark: Mark,
        transform_metadata_context: &Arc<TransformPluginMetadataContext>,
        p: &PluginConfig,
    ) -> Result<FxHashMap<String, String>> {
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
        let mut transform_plugin_executor = swc_plugin_runner::create_plugin_transform_executor(
            &self.cm,
            &unresolved_mark,
            transform_metadata_context,
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
                .transform(serialized, Some(true))
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
