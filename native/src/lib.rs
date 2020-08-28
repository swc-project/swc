#![recursion_limit = "2048"]

#[macro_use]
extern crate napi;
#[macro_use]
extern crate napi_derive;

use backtrace::Backtrace;
use napi::{CallContext, Env, JsFunction, JsObject, JsUndefined, Module};
use napi_serde::serialize;
use std::{env, panic::set_hook, sync::Arc};
use swc::{Compiler, TransformOutput};
use swc_common::{
    self,
    errors::{ColorConfig, Handler},
    sync::Lazy,
    FilePathMapping, SourceMap,
};

mod bundle;
mod napi_serde;
mod parse;
mod print;
mod transform;
mod util;

// #[cfg(all(unix, not(target_env = "musl")))]
// #[global_allocator]
// static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));

    Arc::new(Compiler::new(cm.clone(), handler))
});

register_module!(swc, init);

fn init(m: &mut Module) -> napi::Result<()> {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_else(|_| String::new()) == "1" {
        set_hook(Box::new(|_panic_info| {
            let backtrace = Backtrace::new();
            println!("Backtrace: {:?}", backtrace);
        }));
    }

    m.create_named_method("define", define_compiler_class)?;

    m.create_named_method("transform", transform::transform)?;
    m.create_named_method("transformSync", transform::transform_sync)?;
    m.create_named_method("transformFile", transform::transform_file)?;
    m.create_named_method("transformFileSync", transform::transform_file_sync)?;

    m.create_named_method("parse", parse::parse)?;
    m.create_named_method("parseSync", parse::parse_sync)?;
    m.create_named_method("parseFile", parse::parse_file)?;
    m.create_named_method("parseFileSync", parse::parse_file_sync)?;

    m.create_named_method("print", print::print)?;
    m.create_named_method("printSync", print::print_sync)?;

    m.create_named_method("bundle", bundle::bundle)?;

    Ok(())
}

fn get_compiler(_ctx: &CallContext) -> Arc<Compiler> {
    COMPILER.clone()
}

#[js_function]
fn define_compiler_class(ctx: CallContext) -> napi::Result<JsFunction> {
    ctx.env.define_class("Compiler", construct_compiler, vec![])
}

#[js_function]
fn construct_compiler(ctx: CallContext<JsObject>) -> napi::Result<JsUndefined> {
    // TODO: Assign swc::Compiler
    ctx.env.get_undefined()
}

pub fn complete_output(env: &Env, output: TransformOutput) -> napi::Result<JsObject> {
    serialize(&env, &output)?.coerce_to_object()
}

pub type ArcCompiler = Arc<Compiler>;
