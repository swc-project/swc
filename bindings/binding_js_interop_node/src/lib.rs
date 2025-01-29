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

mod transform;
mod util;

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm))
});

#[napi::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::new();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }
}

fn get_compiler() -> Arc<Compiler> {
    COMPILER.clone()
}

/// Hack for `Type Generation`
#[napi(object)]
pub struct TransformOutput {
    pub code: String,
    pub map: Option<String>,
}
