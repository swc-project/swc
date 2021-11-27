use crate::{
    get_compiler,
    util::{deserialize_json, try_with, CtxtExt, MapErr},
};
use anyhow::Context as _;
use napi::{CallContext, Either, Env, JsObject, JsString, JsUndefined, Task};
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{config::ParseOptions, Compiler};
use swc_common::FileName;
use swc_ecma_ast::Program;

// ----- Parsing -----

pub struct ParseTask {
    pub c: Arc<Compiler>,
    pub filename: FileName,
    pub src: String,
    pub options: String,
}

pub struct ParseFileTask {
    pub c: Arc<Compiler>,
    pub path: PathBuf,
    pub options: String,
}

pub fn complete_parse<'a>(env: &Env, program: Program, _c: &Compiler) -> napi::Result<JsString> {
    let s = serde_json::to_string(&program)
        .context("failed to serialize Program")
        .convert_err()?;
    env.create_string_from_std(s)
}

impl Task for ParseTask {
    type Output = Program;
    type JsValue = JsString;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let options: ParseOptions = deserialize_json(&self.options).convert_err()?;
        let fm = self
            .c
            .cm
            .new_source_file(self.filename.clone(), self.src.clone());

        let program = try_with(self.c.cm.clone(), false, |handler| {
            self.c.parse_js(
                fm,
                &handler,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        })
        .convert_err()?;

        Ok(program)
    }

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(&env, result, &self.c)
    }
}

impl Task for ParseFileTask {
    type Output = Program;
    type JsValue = JsString;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        try_with(self.c.cm.clone(), false, |handler| {
            self.c.run(|| {
                let options: ParseOptions = deserialize_json(&self.options).convert_err()?;

                let fm = self
                    .c
                    .cm
                    .load_file(&self.path)
                    .context("failed to read module")?;

                self.c.parse_js(
                    fm,
                    handler,
                    options.target,
                    options.syntax,
                    options.is_module,
                    options.comments,
                )
            })
        })
        .convert_err()
    }

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(&env, result, &self.c)
    }
}

#[js_function(3)]
pub fn parse(ctx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&ctx);
    let src = ctx.get::<JsString>(0)?.into_utf8()?.as_str()?.to_string();
    let options = ctx.get_buffer_as_string(1)?;
    let filename = ctx.get::<Either<JsString, JsUndefined>>(2)?;
    let filename = if let Either::A(value) = filename {
        FileName::Real(value.into_utf8()?.as_str()?.to_owned().into())
    } else {
        FileName::Anon
    };

    ctx.env
        .spawn(ParseTask {
            c: c.clone(),
            filename,
            src,
            options,
        })
        .map(|t| t.promise_object())
}

#[js_function(3)]
pub fn parse_sync(cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);

    let src = cx.get::<JsString>(0)?.into_utf8()?.as_str()?.to_owned();
    let options: ParseOptions = cx.get_deserialized(1)?;
    let filename = cx.get::<Either<JsString, JsUndefined>>(2)?;
    let filename = if let Either::A(value) = filename {
        FileName::Real(value.into_utf8()?.as_str()?.to_owned().into())
    } else {
        FileName::Anon
    };

    let program = try_with(c.cm.clone(), false, |handler| {
        c.run(|| {
            let fm = c.cm.new_source_file(filename, src);
            c.parse_js(
                fm,
                handler,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        })
    })
    .convert_err()?;

    complete_parse(&cx.env, program, &c)
}

#[js_function(2)]
pub fn parse_file_sync(cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);
    let path = cx.get::<JsString>(0)?.into_utf8()?;
    let options: ParseOptions = cx.get_deserialized(1)?;

    let program = {
        try_with(c.cm.clone(), false, |handler| {
            let fm =
                c.cm.load_file(Path::new(path.as_str()?))
                    .expect("failed to read program file");

            c.parse_js(
                fm,
                handler,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        })
    }
    .convert_err()?;

    complete_parse(cx.env, program, &c)
}

#[js_function(2)]
pub fn parse_file(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let path = PathBuf::from(cx.get::<JsString>(0)?.into_utf8()?.as_str()?);
    let options = cx.get_buffer_as_string(1)?;

    cx.env
        .spawn(ParseFileTask { c, path, options })
        .map(|t| t.promise_object())
}
