use std::sync::Arc;

use anyhow::Error;
use common::{comments::SingleThreadedComments, errors::Handler, SourceFile};
use serde::Deserialize;
use swc_config::IsModule;
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::Syntax;

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
            let program = self.parse_js(
                fm,
                handler,
                EsVersion::latest(),
                opts.parser,
                opts.module,
                Some(&comments),
            )?;

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
