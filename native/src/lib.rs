#![feature(box_patterns)]
#![recursion_limit = "2048"]

extern crate neon;
extern crate neon_serde;
extern crate path_clean;
extern crate serde;
extern crate swc;

use anyhow::Error;
use backtrace::Backtrace;
use neon::prelude::*;
use std::{env, panic::set_hook, sync::Arc};
use swc::{
    common::{self, errors::Handler, FilePathMapping, SourceMap},
    Compiler, TransformOutput,
};

mod bundle;
mod parse;
mod print;
mod transform;

fn init(_cx: MethodContext<JsUndefined>) -> NeonResult<ArcCompiler> {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_else(|_| String::new()) == "1" {
        set_hook(Box::new(|_panic_info| {
            let backtrace = Backtrace::new();
            println!("Backtrace: {:?}", backtrace);
        }));
    }

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Arc::new(Handler::with_tty_emitter(
        common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));

    let c = Compiler::new(cm.clone(), handler);

    Ok(Arc::new(c))
}

pub fn complete_output<'a>(
    mut cx: impl Context<'a>,
    result: Result<TransformOutput, Error>,
) -> JsResult<'a, JsValue> {
    match result {
        Ok(output) => Ok(neon_serde::to_value(&mut cx, &output)?),
        Err(err) => cx.throw_error(format!("{:?}", err)),
    }
}

pub type ArcCompiler = Arc<Compiler>;

declare_types! {
    pub class JsCompiler for ArcCompiler {
        init(cx) {
            init(cx)
        }

        method transform(cx) {
            transform::transform(cx)
        }

        method transformSync(cx) {
            transform::transform_sync(cx)
        }

        method transformFile(cx) {
            transform::transform_file(cx)
        }

        method transformFileSync(cx) {
            transform::transform_file_sync(cx)
        }

        method parse(cx) {
            parse::parse(cx)
        }

        method parseSync(cx) {
            parse::parse_sync(cx)
        }

        method parseFile(cx) {
            parse::parse_file(cx)
        }

        method parseFileSync(cx) {
            parse::parse_file_sync(cx)
        }

        method print(cx) {
            print::print(cx)
        }

        method printSync(cx) {
            print::print_sync(cx)
        }

        method bundle(cx) {
            bundle::bundle(cx)
        }
    }
}

register_module!(mut cx, {
    cx.export_class::<JsCompiler>("Compiler")?;
    Ok(())
});
