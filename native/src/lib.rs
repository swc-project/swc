#![recursion_limit = "2048"]

#[macro_use]
extern crate napi;
#[macro_use]
extern crate napi_derive;

use anyhow::Error;
use backtrace::Backtrace;
use napi::{CallContext, Env, JsFunction, JsObject, JsUndefined, Module, Property};
use napi_serde::serialize;
use std::{env, panic::set_hook, sync::Arc};
use swc::{Compiler, TransformOutput};
use swc_common::{self, errors::Handler, FilePathMapping, SourceMap};

mod bundle;
mod napi_serde;
mod parse;
mod print;
mod transform;
mod util;

// #[cfg(all(unix, not(target_env = "musl")))]
// #[global_allocator]
// static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

register_module!(swc, init);

fn init(m: &mut Module) -> napi::Result<()> {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_else(|_| String::new()) == "1" {
        set_hook(Box::new(|_panic_info| {
            let backtrace = Backtrace::new();
            println!("Backtrace: {:?}", backtrace);
        }));
    }

    m.create_named_method("define", define_compiler_class)?;

    Ok(())
}

#[js_function]
fn define_compiler_class(ctx: CallContext) -> napi::Result<JsFunction> {
    let properties = vec![
        Property::new("transformSync").with_method(transform::transform_sync),
        Property::new("transform").with_method(transform::transform),
        Property::new("transformFileSync").with_method(transform::transform_file_sync),
        Property::new("transformFile").with_method(transform::transform_file),
        Property::new("parse").with_method(parse::parse),
        Property::new("parseSync").with_method(parse::parse_sync),
        Property::new("parseFile").with_method(parse::parse_file),
        Property::new("parseFileSync").with_method(parse::parse_file_sync),
        Property::new("print").with_method(print::print),
        Property::new("printSync").with_method(print::print_sync),
        Property::new("bundle").with_method(bundle::bundle),
    ];

    ctx.env
        .define_class("Compiler", construct_compiler, properties)
}

#[js_function]
fn construct_compiler(ctx: CallContext<JsObject>) -> napi::Result<JsUndefined> {
    // TODO: Assign swc::Compiler
    ctx.env.get_undefined()
}

pub fn complete_output(env: &mut Env, output: TransformOutput) -> napi::Result<JsObject> {
    serialize(&mut env, &output)
}

pub type ArcCompiler = Arc<Compiler>;
