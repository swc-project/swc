use crate::{
    complete_output, get_compiler,
    util::{CtxtExt, MapErr},
};
use anyhow::{Context as _, Error};
use napi::{CallContext, Env, JsBoolean, JsObject, JsString, Task};
use path_clean::clean;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{config::Options, Compiler, TransformOutput};
use swc_common::{FileName, SourceFile};
use swc_ecma_ast::Program;

/// Input to transform
#[derive(Debug)]
pub enum Input {
    /// json string
    Program(String),
    /// Raw source code.
    Source(Arc<SourceFile>),
    /// File
    File(PathBuf),
}

pub struct TransformTask {
    pub c: Arc<Compiler>,
    pub input: Input,
    pub options: Options,
}

impl Task for TransformTask {
    type Output = TransformOutput;
    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        self.c
            .run(|| match self.input {
                Input::Program(ref s) => {
                    let program: Program =
                        serde_json::from_str(&s).expect("failed to deserialize Program");
                    // TODO: Source map
                    self.c.process_js(program, &self.options)
                }

                Input::File(ref path) => {
                    let fm = self.c.cm.load_file(path).context("failed to read module")?;
                    self.c.process_js_file(fm, &self.options)
                }

                Input::Source(ref s) => self.c.process_js_file(s.clone(), &self.options),
            })
            .convert_err()
    }

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_output(&env, result)
    }
}

/// returns `compiler, (src / path), options, plugin, callback`
pub fn schedule_transform<F>(cx: CallContext, op: F) -> napi::Result<JsObject>
where
    F: FnOnce(&Arc<Compiler>, String, bool, Options) -> TransformTask,
{
    let c = get_compiler(&cx);

    let s = cx.get::<JsString>(0)?.into_utf8()?.as_str()?.to_owned();
    let is_module = cx.get::<JsBoolean>(1)?;
    let options: Options = cx.get_deserialized(2)?;

    let task = op(&c, s, is_module.get_value()?, options);

    cx.env.spawn(task).map(|t| t.promise_object())
}

pub fn exec_transform<F>(cx: CallContext, op: F) -> napi::Result<JsObject>
where
    F: FnOnce(&Compiler, String, &Options) -> Result<Arc<SourceFile>, Error>,
{
    let c = get_compiler(&cx);

    let s = cx.get::<JsString>(0)?.into_utf8()?;
    let is_module = cx.get::<JsBoolean>(1)?;
    let options: Options = cx.get_deserialized(2)?;

    let output = c.run(|| -> napi::Result<_> {
        if is_module.get_value()? {
            let program: Program =
                serde_json::from_str(s.as_str()?).expect("failed to deserialize Program");
            c.process_js(program, &options).convert_err()
        } else {
            let fm = op(&c, s.as_str()?.to_string(), &options).expect("failed to create fm");
            c.process_js_file(fm, &options).convert_err()
        }
    })?;

    complete_output(cx.env, output)
}

#[js_function(4)]
pub fn transform(cx: CallContext) -> napi::Result<JsObject> {
    schedule_transform(cx, |c, src, is_module, options| {
        let input = if is_module {
            Input::Program(src)
        } else {
            Input::Source(c.cm.new_source_file(
                if options.filename.is_empty() {
                    FileName::Anon
                } else {
                    FileName::Real(options.filename.clone().into())
                },
                src,
            ))
        };

        TransformTask {
            c: c.clone(),
            input,
            options,
        }
    })
}

#[js_function(4)]
pub fn transform_sync(cx: CallContext) -> napi::Result<JsObject> {
    exec_transform(cx, |c, src, options| {
        Ok(c.cm.new_source_file(
            if options.filename.is_empty() {
                FileName::Anon
            } else {
                FileName::Real(options.filename.clone().into())
            },
            src,
        ))
    })
}

#[js_function(4)]
pub fn transform_file(cx: CallContext) -> napi::Result<JsObject> {
    schedule_transform(cx, |c, path, _, options| {
        let path = clean(&path);

        TransformTask {
            c: c.clone(),
            input: Input::File(path.into()),
            options,
        }
    })
}

#[js_function(4)]
pub fn transform_file_sync(cx: CallContext) -> napi::Result<JsObject> {
    exec_transform(cx, |c, path, _| {
        Ok(c.cm
            .load_file(Path::new(&path))
            .expect("failed to load file"))
    })
}
