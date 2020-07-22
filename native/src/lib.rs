#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![recursion_limit = "2048"]

extern crate neon;
extern crate neon_serde;
extern crate path_clean;
extern crate serde;
extern crate swc;

use anyhow::{Context as _, Error};
use backtrace::Backtrace;
use neon::prelude::*;
use std::{
    env,
    panic::set_hook,
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{
    common::{self, errors::Handler, FileName, FilePathMapping, SourceFile, SourceMap},
    config::{Options, ParseOptions, SourceMapsConfig},
    ecmascript::ast::Program,
    Compiler, TransformOutput,
};

mod bundle;
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

// ----- Parsing -----

struct ParseTask {
    c: Arc<Compiler>,
    fm: Arc<SourceFile>,
    options: ParseOptions,
}

struct ParseFileTask {
    c: Arc<Compiler>,
    path: PathBuf,
    options: ParseOptions,
}

fn complete_parse<'a>(
    mut cx: impl Context<'a>,
    result: Result<Program, Error>,
    c: &Compiler,
) -> JsResult<'a, JsValue> {
    c.run(|| match result {
        Ok(program) => Ok(cx
            .string(serde_json::to_string(&program).expect("failed to serialize Program"))
            .upcast()),
        Err(err) => cx.throw_error(format!("{:?}", err)),
    })
}

impl Task for ParseTask {
    type Output = Program;
    type Error = Error;
    type JsEvent = JsValue;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        self.c.run(|| {
            self.c.parse_js(
                self.fm.clone(),
                self.options.target,
                self.options.syntax,
                self.options.is_module,
                self.options.comments,
            )
        })
    }

    fn complete(
        self,
        cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        complete_parse(cx, result, &self.c)
    }
}

impl Task for ParseFileTask {
    type Output = Program;
    type Error = Error;
    type JsEvent = JsValue;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        self.c.run(|| {
            let fm = self
                .c
                .cm
                .load_file(&self.path)
                .context("failed to read module")?;

            self.c.parse_js(
                fm,
                self.options.target,
                self.options.syntax,
                self.options.is_module,
                self.options.comments,
            )
        })
    }

    fn complete(
        self,
        cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        complete_parse(cx, result, &self.c)
    }
}

fn parse(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let src = cx.argument::<JsString>(0)?;
    let options_arg = cx.argument::<JsValue>(1)?;
    let options: ParseOptions = neon_serde::from_value(&mut cx, options_arg)?;
    let callback = cx.argument::<JsFunction>(2)?;

    let this = cx.this();
    {
        let guard = cx.lock();
        let c = this.borrow(&guard);

        let fm = c.cm.new_source_file(FileName::Anon, src.value());

        ParseTask {
            c: c.clone(),
            fm,
            options,
        }
        .schedule(callback);
    };

    Ok(cx.undefined().upcast())
}

fn parse_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    c.run(|| {
        let src = cx.argument::<JsString>(0)?;
        let options_arg = cx.argument::<JsValue>(1)?;
        let options: ParseOptions = neon_serde::from_value(&mut cx, options_arg)?;

        let program = {
            let fm = c.cm.new_source_file(FileName::Anon, src.value());
            c.parse_js(
                fm,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        };

        complete_parse(cx, program, &c)
    })
}

fn parse_file_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    c.run(|| {
        let path = cx.argument::<JsString>(0)?;
        let options_arg = cx.argument::<JsValue>(1)?;
        let options: ParseOptions = neon_serde::from_value(&mut cx, options_arg)?;

        let program = {
            let fm =
                c.cm.load_file(Path::new(&path.value()))
                    .expect("failed to read program file");

            c.parse_js(
                fm,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        };

        complete_parse(cx, program, &c)
    })
}

fn parse_file(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let path = cx.argument::<JsString>(0)?;
    let options_arg = cx.argument::<JsValue>(1)?;
    let options: ParseOptions = neon_serde::from_value(&mut cx, options_arg)?;
    let callback = cx.argument::<JsFunction>(2)?;

    let this = cx.this();
    {
        let guard = cx.lock();
        let c = this.borrow(&guard);

        ParseFileTask {
            c: c.clone(),
            path: path.value().into(),
            options,
        }
        .schedule(callback);
    };

    Ok(cx.undefined().upcast())
}

// ----- Printing -----

struct PrintTask {
    c: Arc<Compiler>,
    program: Program,
    options: Options,
}

impl Task for PrintTask {
    type Output = TransformOutput;
    type Error = Error;
    type JsEvent = JsValue;
    fn perform(&self) -> Result<Self::Output, Self::Error> {
        self.c.run(|| {
            self.c.print(
                &self.program,
                self.options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                None,
                self.options
                    .config
                    .clone()
                    .unwrap_or_default()
                    .minify
                    .unwrap_or(false),
            )
        })
    }

    fn complete(
        self,
        cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        complete_output(cx, result)
    }
}

fn print(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let program = cx.argument::<JsString>(0)?;
    let program: Program =
        serde_json::from_str(&program.value()).expect("failed to deserialize Program");

    let options = cx.argument::<JsValue>(1)?;
    let options: Options = neon_serde::from_value(&mut cx, options)?;

    let callback = cx.argument::<JsFunction>(2)?;

    let this = cx.this();
    {
        let guard = cx.lock();
        let c = this.borrow(&guard);

        PrintTask {
            c: c.clone(),
            program,
            options,
        }
        .schedule(callback)
    }

    Ok(cx.undefined().upcast())
}

fn print_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    c.run(|| {
        let program = cx.argument::<JsString>(0)?;
        let program: Program =
            serde_json::from_str(&program.value()).expect("failed to deserialize Program");

        let options = cx.argument::<JsValue>(1)?;
        let options: Options = neon_serde::from_value(&mut cx, options)?;

        let result = {
            c.print(
                &program,
                options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                None,
                options.config.unwrap_or_default().minify.unwrap_or(false),
            )
        };
        complete_output(cx, result)
    })
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
            parse(cx)
        }

        method parseSync(cx) {
            parse_sync(cx)
        }

        method parseFile(cx) {
            parse_file(cx)
        }

        method parseFileSync(cx) {
            parse_file_sync(cx)
        }

        method print(cx) {
            print(cx)
        }

        method printSync(cx) {
            print_sync(cx)
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
