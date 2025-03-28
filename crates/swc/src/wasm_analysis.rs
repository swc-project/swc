use std::sync::Arc;

use anyhow::{Context, Error};
use common::{
    comments::SingleThreadedComments, errors::Handler, plugin::serialized::PluginSerializedBytes,
    Mark, SourceFile,
};
use par_iter::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::Deserialize;
use swc_config::IsModule;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::resolver;

use crate::{plugin::PluginConfig, Compiler};

impl Compiler {
    /// Run analysis using Wasm plugins.
    pub fn run_wasm_analysis(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &WasmAnalysisOptions,
        comments: SingleThreadedComments,
    ) -> Result<Vec<String>, Error> {
        self.run(|| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let mut program = self.parse_js(
                fm,
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
                let program = swc_common::plugin::serialized::VersionedSerializable::new(n);
                PluginSerializedBytes::try_serialize(&program)?
            };

            let mut result = vec![];

            opts.plugins.par_iter().map(|p| {
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
                        &self.cm,
                        &unresolved_mark,
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

                transform_plugin_executor
                    .transform(&serialized, Some(true))
                    .with_context(|| {
                        format!(
                            "failed to invoke `{}` as js analysis plugin at {}",
                            &p.0, plugin_name
                        )
                    })?;
                drop(span);

                Ok(())
            });

            Ok(vec![])
        })
    }
}

#[derive(Debug, Deserialize)]
pub struct WasmAnalysisOptions {
    #[serde(default)]
    pub parser: Syntax,
    #[serde(default)]
    pub module: IsModule,

    pub plugins: Vec<PluginConfig>,
}
