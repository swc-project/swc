use std::sync::Arc;

use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer, External},
    Env, JsExternal, JsObject, JsUnknown, Task,
};
use serde::Deserialize;
use swc_core::{
    base::{
        config::{ErrorFormat, JsMinifyOptions},
        JsMinifyExtras, TransformOutput,
    },
    common::{collections::AHashMap, sync::Lrc, FileName, SourceFile, SourceMap},
    ecma::minifier::option::{MangleCache, SimpleMangleCache},
    node::{deserialize_json, get_deserialized, MapErr},
};

use crate::{get_compiler, util::try_with};

#[napi(object)]
pub struct NapiMinifyExtra {
    #[napi(ts_type = "object")]
    pub mangle_name_cache: Option<NameMangleCache>,
}

struct MinifyTask {
    c: Arc<swc_core::base::Compiler>,
    code: String,
    options: String,
    extras: JsMinifyExtras,
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
            MinifyTarget::Single(code) => cm.new_source_file(FileName::Anon.into(), code.clone()),
            MinifyTarget::Map(codes) => {
                assert_eq!(
                    codes.len(),
                    1,
                    "swc.minify does not support concatting multiple files yet"
                );

                let (filename, code) = codes.iter().next().unwrap();

                cm.new_source_file(FileName::Real(filename.clone().into()).into(), code.clone())
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

        try_with(self.c.cm.clone(), false, ErrorFormat::Normal, |handler| {
            let fm = input.to_file(self.c.cm.clone());

            self.c.minify(fm, handler, &options, self.extras.clone())
        })
        .convert_err()
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

type NameMangleCache = External<Arc<dyn MangleCache>>;

#[napi(ts_return_type = "object")]
fn new_mangle_name_cache() -> NameMangleCache {
    let cache = Arc::new(SimpleMangleCache::default());
    External::new(cache)
}

#[napi]
fn minify(
    code: Buffer,
    opts: Buffer,
    extras: NapiMinifyExtra,
    signal: Option<AbortSignal>,
) -> AsyncTask<MinifyTask> {
    crate::util::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.as_deref().cloned());

    let c = get_compiler();

    let task = MinifyTask {
        c,
        code,
        options,
        extras,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn minify_sync(
    code: Buffer,
    opts: Buffer,
    extras: NapiMinifyExtra,
) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();
    let code: MinifyTarget = get_deserialized(code)?;
    let opts = get_deserialized(opts)?;
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.as_deref().cloned());

    let c = get_compiler();

    let fm = code.to_file(c.cm.clone());

    try_with(
        c.cm.clone(),
        false,
        // TODO(kdy1): Maybe make this configurable?
        ErrorFormat::Normal,
        |handler| c.minify(fm, handler, &opts, extras),
    )
    .convert_err()
}
