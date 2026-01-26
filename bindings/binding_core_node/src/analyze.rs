use std::sync::Arc;

use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, Task,
};
use swc_core::{
    base::{wasm_analysis::WasmAnalysisOptions, Compiler},
    common::{comments::SingleThreadedComments, FileName},
    node::MapErr,
};
use tracing::instrument;

use crate::{get_fresh_compiler, util::try_with};

pub struct AnalyzeTask {
    pub c: Arc<Compiler>,
    pub input: Option<String>,
    pub options: Buffer,
}

#[napi]
impl Task for AnalyzeTask {
    type JsValue = String;
    type Output = String;

    #[instrument(level = "trace", skip_all)]
    fn compute(&mut self) -> napi::Result<Self::Output> {
        let options: WasmAnalysisOptions = serde_json::from_slice(self.options.as_ref())?;

        try_with(self.c.cm.clone(), false, options.error_format, |handler| {
            let comments = SingleThreadedComments::default();

            let fm = self.c.cm.new_source_file(
                if let Some(filename) = options.filename.as_deref() {
                    FileName::Real(filename.into()).into()
                } else {
                    FileName::Anon.into()
                },
                self.input.take().unwrap(),
            );

            self.c.run_wasm_analysis(fm, handler, &options, &comments)
        })
        .convert_err()
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }
}

#[napi]
pub fn analyze(
    src: String,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<AnalyzeTask>> {
    crate::util::init_default_trace_subscriber();

    let task = AnalyzeTask {
        c: get_fresh_compiler(),
        input: Some(src),
        options,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}
