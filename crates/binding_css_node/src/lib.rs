#![feature(backtrace)]

#[macro_use]
extern crate napi_derive;

/// Explicit extern crate to use allocator.
extern crate swc_node_base;

mod util;

use std::{backtrace::Backtrace, env, panic::set_hook};

use napi::{bindgen_prelude::*, Task};
use serde::Serialize;

use crate::util::try_with;

#[napi::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::force_capture();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }
}

#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

struct MinifyTask {
    code: String,
    options: String,
}

#[napi]
impl Task for MinifyTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        try_with(|handler| {
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
    crate::util::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();

    let c = get_compiler();

    let task = MinifyTask { c, code, options };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn minify_sync(code: Buffer, opts: Buffer) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();
    let code: MinifyTarget = get_deserialized(code)?;
    let opts = get_deserialized(opts)?;

    let c = get_compiler();

    let fm = code.to_file(c.cm.clone());

    try_with(c.cm.clone(), false, |handler| c.minify(fm, handler, &opts)).convert_err()
}
