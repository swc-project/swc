use crate::{
    complete_output, get_compiler,
    util::{CtxtExt, MapErr},
};
use fxhash::FxHashMap;
use napi::{CallContext, JsObject, Task};
use serde::Deserialize;
use std::sync::Arc;
use swc::{try_with_handler, TransformOutput};
use swc_common::{sync::Lrc, FileName, SourceFile, SourceMap};

struct MinifyTask {
    c: Arc<swc::Compiler>,
    code: MinifyTarget,
    opts: swc::config::JsMinifyOptions,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum MinifyTarget {
    /// Code to minify.
    Single(String),
    /// `{ filename: code }`
    Map(FxHashMap<String, String>),
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

impl Task for MinifyTask {
    type Output = TransformOutput;

    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        try_with_handler(self.c.cm.clone(), |handler| {
            let fm = self.code.to_file(self.c.cm.clone());

            self.c.minify(fm, &handler, &self.opts)
        })
        .convert_err()
    }

    fn resolve(self, env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        complete_output(&env, output)
    }
}

#[js_function(2)]
pub fn minify(cx: CallContext) -> napi::Result<JsObject> {
    let code = cx.get_deserialized(0)?;
    let opts = cx.get_deserialized(1)?;

    let c = get_compiler(&cx);

    let task = MinifyTask { c, code, opts };

    cx.env.spawn(task).map(|t| t.promise_object())
}

#[js_function(2)]
pub fn minify_sync(cx: CallContext) -> napi::Result<JsObject> {
    let code: MinifyTarget = cx.get_deserialized(0)?;
    let opts = cx.get_deserialized(1)?;

    let c = get_compiler(&cx);

    let fm = code.to_file(c.cm.clone());

    let output =
        try_with_handler(c.cm.clone(), |handler| c.minify(fm, &handler, &opts)).convert_err()?;

    complete_output(&cx.env, output)
}
