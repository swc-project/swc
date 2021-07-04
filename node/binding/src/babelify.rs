use anyhow::Context;
use napi::{CallContext, JsObject, JsString, Task};
use std::{
    mem::{replace, take},
    path::PathBuf,
    sync::Arc,
};
use swc::{config::ParseOptions, Compiler};
use swc_babel_compat::babelify::{self, Babelify};
use swc_common::FileName;

use crate::{
    get_compiler,
    util::{CtxtExt, MapErr},
};

struct BabelifyTask {
    c: Arc<Compiler>,
    filename: FileName,
    input: String,
    parse_options: ParseOptions,
}

impl Task for BabelifyTask {
    type Output = String;

    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let filename = replace(&mut self.filename, FileName::Anon);
        let input = take(&mut self.input);

        let fm = self.c.cm.new_source_file(filename, input);
        let program = self
            .c
            .parse_js(
                fm.clone(),
                self.parse_options.target,
                self.parse_options.syntax,
                self.parse_options.is_module,
                self.parse_options.comments,
            )
            .context("failed to parse module")
            .convert_err()?;

        let ctx = babelify::Context {
            fm,
            cm: self.c.cm.clone(),
            comments: self.c.comments(),
        };

        let ast = program.babelify(&ctx);

        let s = serde_json::to_string(&ast)
            .context("failed to serialize")
            .convert_err()?;

        Ok(s)
    }

    fn resolve(self, env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        env.to_js_value(&output)?.coerce_to_object()
    }
}

#[js_function(3)]
pub fn babelify(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let filename = cx.get::<JsString>(0)?;
    let input = cx.get::<JsString>(1)?.into_utf8()?.into_owned()?;
    let parse_options = cx.get_deserialized(2)?;

    let filename = FileName::Real(PathBuf::from(filename.into_utf8()?.into_owned()?));

    let task = BabelifyTask {
        c,
        filename,
        input,
        parse_options,
    };

    cx.env.spawn(task).map(|t| t.promise_object())
}

#[js_function(3)]
pub fn babelify_sync(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let filename = cx.get::<JsString>(0)?;
    let input = cx.get::<JsString>(1)?.into_utf8()?.into_owned()?;
    let parse_options = cx.get_deserialized::<ParseOptions>(2)?;

    let filename = FileName::Real(PathBuf::from(filename.into_utf8()?.into_owned()?));

    let fm = c.cm.new_source_file(filename, input);
    let program = c
        .parse_js(
            fm.clone(),
            parse_options.target,
            parse_options.syntax,
            parse_options.is_module,
            parse_options.comments,
        )
        .context("failed to parse module")
        .convert_err()?;

    let ctx = babelify::Context {
        fm,
        cm: c.cm.clone(),
        comments: c.comments(),
    };

    let ast = program.babelify(&ctx);

    let s = serde_json::to_string(&ast)
        .context("failed to serialize")
        .convert_err()?;
    cx.env.to_js_value(&s)?.coerce_to_object()
}
