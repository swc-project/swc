#![recursion_limit = "2048"]

#[macro_use]
extern crate napi_derive;
/// Explicit extern crate to use allocator.
extern crate swc_node_base;

use backtrace::Backtrace;
use napi::{CallContext, Env, JsFunction, JsObject, JsUndefined};
use std::{env, panic::set_hook, sync::Arc};
use swc::{Compiler, TransformOutput};
use swc_common::{self, sync::Lazy, FilePathMapping, SourceMap};

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

#[module_exports]
fn init(mut exports: JsObject) -> napi::Result<()> {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::new();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }

    exports.create_named_method("define", define_compiler_class)?;

    exports.create_named_method("minify", minify::minify)?;
    exports.create_named_method("minifySync", minify::minify_sync)?;

    exports.create_named_method("transform", transform::transform)?;
    exports.create_named_method("transformSync", transform::transform_sync)?;
    exports.create_named_method("transformFile", transform::transform_file)?;
    exports.create_named_method("transformFileSync", transform::transform_file_sync)?;

    exports.create_named_method("parse", parse::parse)?;
    exports.create_named_method("parseSync", parse::parse_sync)?;
    exports.create_named_method("parseFile", parse::parse_file)?;
    exports.create_named_method("parseFileSync", parse::parse_file_sync)?;

    exports.create_named_method("print", print::print)?;
    exports.create_named_method("printSync", print::print_sync)?;

    exports.create_named_method("bundle", bundle::bundle)?;

    Ok(())
}

fn get_compiler(_ctx: &CallContext) -> Arc<Compiler> {
    COMPILER.clone()
}

#[js_function]
fn define_compiler_class(ctx: CallContext) -> napi::Result<JsFunction> {
    ctx.env
        .define_class("Compiler", construct_compiler, &vec![])
}

#[js_function]
fn construct_compiler(ctx: CallContext) -> napi::Result<JsUndefined> {
    // TODO: Assign swc::Compiler
    ctx.env.get_undefined()
}

pub fn complete_output(env: &Env, output: TransformOutput) -> napi::Result<JsObject> {
    env.to_js_value(&output)?.coerce_to_object()
}

pub type ArcCompiler = Arc<Compiler>;
