use std::sync::Arc;

use anyhow::Error;
use common::{comments::SingleThreadedComments, errors::Handler, SourceFile};
use serde::Deserialize;
use swc_ecma_ast::Program;

use crate::{plugin::PluginConfig, Compiler};

impl Compiler {
    /// Run analysis using Wasm plugins.
    pub fn run_wasm_analysis(
        &self,
        fm: Arc<SourceFile>,
        program: Option<Program>,
        handler: &Handler,
        opts: &WasmAnalysisOptions,
        comments: SingleThreadedComments,
    ) -> Result<Vec<String>, Error> {
        Ok(())
    }
}

#[derive(Debug, Deserialize)]
pub struct WasmAnalysisOptions {
    pub plugins: Vec<PluginConfig>,
}
