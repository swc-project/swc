use std::sync::Arc;

use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Task,
};
use serde::Deserialize;
use swc::{
    config::{ErrorFormat, JsMinifyOptions},
    TransformOutput,
};
use swc_common::{collections::AHashMap, sync::Lrc, FileName, SourceFile, SourceMap};
use swc_nodejs_common::{deserialize_json, get_deserialized, MapErr};

use crate::{get_compiler, util::try_with};

struct MinifyTask {
    c: Arc<swc::Compiler>,
    code: String,
    options: String,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum MinifyTarget {
    /// Code to minify.
    Single(String),
    /// `{ filename: code }`
    Map(AHashMap<String, String>),
}

impl MinifyTarget {
    fn to_file(&self, cm: Lrc<SourceMap>) -> Lrc<SourceFile> {
        match self {
            MinifyTarget::Single(code) => cm.new_source_file(FileName::Anon, code.clone()),
            MinifyTarget::Map(codes) => {
                assert_eq!(
                    codes.len(),
                    1,
                    "swc.minify does not support concatting multiple files yet"
                );

                let (filename, code) = codes.iter().next().unwrap();

                cm.new_source_file(FileName::Real(filename.clone().into()), code.clone())
            }
        }
    }
}

#[napi]
impl Task for MinifyTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let input: MinifyTarget = deserialize_json(&self.code)?;
        let options: JsMinifyOptions = deserialize_json(&self.options)?;

        try_with(self.c.cm.clone(), false, |handler| {
            let fm = input.to_file(self.c.cm.clone());

            self.c.minify(fm, handler, &options)
        })
        .convert_err()
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

#[napi]
fn minify(code: Buffer, opts: Buffer, signal: Option<AbortSignal>) -> AsyncTask<MinifyTask> {
    swc_nodejs_common::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();

    let c = get_compiler();

    let task = MinifyTask { c, code, options };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn minify_sync(code: Buffer, opts: Buffer) -> napi::Result<TransformOutput> {
    swc_nodejs_common::init_default_trace_subscriber();
    let code: MinifyTarget = get_deserialized(code)?;
    let opts = get_deserialized(opts)?;

    let c = get_compiler();

    let fm = code.to_file(c.cm.clone());

    try_with(
        c.cm.clone(),
        false,
        // TODO(kdy1): Maybe make this configurable?
        ErrorFormat::Normal,
        |handler| c.minify(fm, handler, &opts),
    )
    .convert_err()
}
