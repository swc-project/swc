use std::sync::Arc;

use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer, External},
    Task,
};
use rustc_hash::FxHashMap;
use swc_core::{
    base::{
        config::{ErrorFormat, JsMinifyOptions},
        JsMinifyExtras, TransformOutput,
    },
    common::{sync::Lrc, FileName, SourceFile, SourceMap},
    ecma::minifier::option::{MangleCache, SimpleMangleCache},
    node::{deserialize_json, get_deserialized, MapErr},
};

use crate::{get_fresh_compiler, util::try_with};

#[napi(object, object_to_js = false)]
pub struct NapiMinifyExtra {
    #[napi(ts_type = "object")]
    pub mangle_name_cache: Option<&'static NameMangleCache>,
}

struct MinifyTask {
    c: Arc<swc_core::base::Compiler>,
    input: Option<MinifyTarget>,
    options: String,
    extras: JsMinifyExtras,
}

enum MinifyTarget {
    /// Code to minify.
    Single(String),
    /// `FxHashMap<String, String>`
    Json(String),
}

impl MinifyTarget {
    fn to_file(&self, cm: Lrc<SourceMap>) -> Lrc<SourceFile> {
        match self {
            MinifyTarget::Single(code) => cm.new_source_file(FileName::Anon.into(), code.clone()),
            MinifyTarget::Json(json) => {
                let codes: FxHashMap<String, String> =
                    serde_json::from_str(json).expect("Invalid JSON");
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
        let input = self.input.take().unwrap();
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
    is_json: bool,
    extras: NapiMinifyExtra,
    signal: Option<AbortSignal>,
) -> AsyncTask<MinifyTask> {
    crate::util::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();
    let options = String::from_utf8_lossy(opts.as_ref()).into_owned();
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.map(|s| (*s).clone()));

    let c = get_fresh_compiler();

    let task = MinifyTask {
        c,
        input: Some(if is_json {
            MinifyTarget::Json(code)
        } else {
            MinifyTarget::Single(code)
        }),
        options,
        extras,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn minify_sync(
    code: Buffer,
    opts: Buffer,
    is_json: bool,
    extras: NapiMinifyExtra,
) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).into_owned();
    let input = if is_json {
        MinifyTarget::Json(code)
    } else {
        MinifyTarget::Single(code)
    };
    let opts = get_deserialized(opts)?;
    let extras = JsMinifyExtras::default()
        .with_mangle_name_cache(extras.mangle_name_cache.map(|s| (*s).clone()));

    let c = get_fresh_compiler();

    let fm = input.to_file(c.cm.clone());

    try_with(
        c.cm.clone(),
        false,
        // TODO(kdy1): Maybe make this configurable?
        ErrorFormat::Normal,
        |handler| c.minify(fm, handler, &opts, extras),
    )
    .convert_err()
}
