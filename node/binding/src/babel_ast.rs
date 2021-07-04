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
    type Output = swc_babel_ast::File;

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

        Ok(program.babelify(&ctx))
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
