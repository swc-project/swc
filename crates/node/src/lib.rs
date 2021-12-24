#![recursion_limit = "2048"]

#[macro_use]
extern crate napi_derive;
/// Explicit extern crate to use allocator.
extern crate swc_node_base;

use backtrace::Backtrace;
use std::{env, panic::set_hook, sync::Arc};
use swc::Compiler;
use swc_common::{self, sync::Lazy, FilePathMapping, SourceMap};
use tracing_subscriber::EnvFilter;

mod bundle;
mod minify;
mod parse;
mod print;
mod transform;
mod util;

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    Arc::new(Compiler::new(cm.clone()))
});

#[napi::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::new();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }

    let _ = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_env("SWC_LOG"))
        .try_init();
}

fn get_compiler() -> Arc<Compiler> {
    COMPILER.clone()
}

#[napi(js_name = "Compiler")]
pub struct JsCompiler {
    _compiler: Arc<Compiler>,
}

#[napi]
impl JsCompiler {
    #[napi(constructor)]
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
