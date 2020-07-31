use crate::JsCompiler;
use anyhow::{Context as _, Error};
use neon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{config::ParseOptions, Compiler};
use swc_common::{FileName, SourceFile};
use swc_ecma_ast::Program;

// ----- Parsing -----

pub struct ParseTask {
    pub c: Arc<Compiler>,
    pub fm: Arc<SourceFile>,
    pub options: ParseOptions,
}

pub struct ParseFileTask {
    pub c: Arc<Compiler>,
    pub path: PathBuf,
    pub options: ParseOptions,
}

pub fn complete_parse<'a>(
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

pub fn parse(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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

pub fn parse_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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

pub fn parse_file_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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

pub fn parse_file(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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
