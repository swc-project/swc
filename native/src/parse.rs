use crate::{
    get_compiler,
    util::{CtxtExt, MapErr},
};
use anyhow::Context as _;
use napi::{CallContext, Env, JsObject, JsString, Task};
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

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(&env, result, &self.c)
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

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_parse(&env, result, &self.c)
    }
}

#[js_function(2)]
pub fn parse(ctx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&ctx);
    let src = ctx.get::<JsString>(0)?.into_utf8()?;
    let options: ParseOptions = ctx.get_deserialized(1)?;

    let fm =
        c.cm.new_source_file(FileName::Anon, src.as_str()?.to_string());

    ctx.env
        .spawn(ParseTask {
            c: c.clone(),
            fm,
            options,
        })
        .map(|t| t.promise_object())
}

#[js_function(2)]
pub fn parse_sync(cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);

    c.run(|| {
        let src = cx.get::<JsString>(0)?.into_utf8()?.as_str()?.to_owned();
        let options: ParseOptions = cx.get_deserialized(1)?;

        let program = {
            let fm = c.cm.new_source_file(FileName::Anon, src);
            c.parse_js(
                fm,
                options.target,
                options.syntax,
                options.is_module,
                options.comments,
            )
        }
        .convert_err()?;

        complete_parse(&cx.env, program, &c)
    })
}

#[js_function(2)]
pub fn parse_file_sync(cx: CallContext) -> napi::Result<JsString> {
    let c = get_compiler(&cx);
    let path = cx.get::<JsString>(0)?.into_utf8()?;
    let options: ParseOptions = cx.get_deserialized(1)?;

    let program = {
        let fm =
            c.cm.load_file(Path::new(path.as_str()?))
                .expect("failed to read program file");

        c.parse_js(
            fm,
            options.target,
            options.syntax,
            options.is_module,
            options.comments,
        )
    }
    .convert_err()?;

    complete_parse(cx.env, program, &c)
}

#[js_function(2)]
pub fn parse_file(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let path = PathBuf::from(cx.get::<JsString>(0)?.into_utf8()?.as_str()?);
    let options: ParseOptions = cx.get_deserialized(1)?;

    cx.env
        .spawn(ParseFileTask { c, path, options })
        .map(|t| t.promise_object())
}
