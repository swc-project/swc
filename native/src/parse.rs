use crate::{get_compiler, napi_serde::deserialize, util::MapErr};
use anyhow::{Context as _, Error};
use napi::{CallContext, Env, JsExternal, JsFunction, JsObject, JsString, Task};
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

pub fn complete_parse<'a>(env: &Env, program: Program, c: &Compiler) -> napi::Result<JsString> {
    let s = serde_json::to_string(&program)
        .context("failed to serialize Program")
        .convert_err()?;
    env.create_string_from_std(s)
}

impl Task for ParseTask {
    type Output = Program;
    type JsValue = JsString;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let program = self
            .c
            .parse_js(
                self.fm.clone(),
                self.options.target,
                self.options.syntax,
                self.options.is_module,
                self.options.comments,
            )
            .convert_err()?;

        Ok(program)
    }

    fn resolve(&self, env: &mut Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(env, result, &self.c)
    }
}

impl Task for ParseFileTask {
    type Output = Program;
    type JsValue = JsString;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        self.c.run(|| {
            let fm = self
                .c
                .cm
                .load_file(&self.path)
                .context("failed to read module")
                .convert_err()?;

            self.c
                .parse_js(
                    fm,
                    self.options.target,
                    self.options.syntax,
                    self.options.is_module,
                    self.options.comments,
                )
                .convert_err()
        })
    }

    fn resolve(&self, env: &mut Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(env, result, &self.c)
    }
}

#[js_function(2)]
pub fn parse(ctx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&ctx);
    let src = ctx.get::<JsString>(0)?;
    let options_arg = ctx.get::<JsObject>(1)?;
    let options: ParseOptions = deserialize(ctx.env, &options_arg)?;

    let fm = c.cm.new_source_file(FileName::Anon, src);

    ctx.env.spawn(ParseTask {
        c: c.clone(),
        fm,
        options,
    })
}

#[js_function(2)]
pub fn parse_sync(mut cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);

    c.run(|| {
        let src = cx.get::<JsString>(0)?;
        let options_arg = cx.get::<JsObject>(1)?;
        let options: ParseOptions = deserialize(cx.env, &options_arg)?;

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

        complete_parse(&cx.env, program, &c)
    })
}

#[js_function(2)]
pub fn parse_file_sync(mut cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);
    let path = cx.get::<JsString>(0)?;
    let options_arg = cx.get::<JsObject>(1)?;
    let options: ParseOptions = deserialize(cx.env, &options_arg)?;

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
}

#[js_function(2)]
pub fn parse_file(mut cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let path = cx.get::<JsString>(0)?;
    let options_arg = cx.get::<JsObject>(1)?;
    let options: ParseOptions = deserialize(&mut cx, options_arg)?;

    cx.env.spawn(ParseFileTask {
        c,
        path: path.value().into(),
        options,
    })
}
