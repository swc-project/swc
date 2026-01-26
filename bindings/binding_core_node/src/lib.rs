#![recursion_limit = "2048"]
#![allow(dead_code)]

#[macro_use]
extern crate napi_derive;

extern crate swc_malloc;

use std::{env, panic::set_hook, sync::Arc};

use backtrace::Backtrace;
use swc_core::{
    base::Compiler,
    common::{sync::Lazy, FilePathMapping, SourceMap},
};

#[cfg(feature = "plugin")]
mod analyze;
mod bundle;
mod minify;
mod parse;
mod print;
mod transform;
mod util;

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm))
});

#[napi_derive::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::new();
            println!("Panic: {panic_info:?}\nBacktrace: {backtrace:?}");
        }));
    }
}

fn get_compiler() -> Arc<Compiler> {
    COMPILER.clone()
}

fn get_fresh_compiler() -> Arc<Compiler> {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm))
}

#[napi(js_name = "Compiler")]
pub struct JsCompiler {
    _compiler: Arc<Compiler>,
}

#[napi]
impl JsCompiler {
    #[napi(constructor)]
    #[allow(clippy::new_without_default)]
    #[tracing::instrument(level = "info", skip_all)]
    pub fn new() -> Self {
        Self {
            _compiler: COMPILER.clone(),
        }
    }
}

pub type ArcCompiler = Arc<Compiler>;

/// Hack for `Type Generation`
#[napi(object)]
pub struct TransformOutput {
    pub code: String,
    pub map: Option<String>,
}
