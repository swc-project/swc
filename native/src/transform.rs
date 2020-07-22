use crate::{complete_output, JsCompiler};
use anyhow::{Context as _, Error};
use neon::prelude::*;
use path_clean::clean;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::{
    common::{FileName, SourceFile},
    config::Options,
    ecmascript::ast::Program,
    Compiler, TransformOutput,
};
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
    type Error = Error;
    type JsEvent = JsValue;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        self.c.run(|| match self.input {
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
    }

    fn complete(
        self,
        cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        complete_output(cx, result)
    }
}

/// returns `compiler, (src / path), options, plugin, callback`
pub fn schedule_transform<F>(mut cx: MethodContext<JsCompiler>, op: F) -> JsResult<JsValue>
where
    F: FnOnce(&Arc<Compiler>, String, bool, Options) -> TransformTask,
{
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        c = this.borrow(&guard).clone();
    };

    let s = cx.argument::<JsString>(0)?.value();
    let is_module = cx.argument::<JsBoolean>(1)?;
    let options_arg = cx.argument::<JsValue>(2)?;

    let options: Options = neon_serde::from_value(&mut cx, options_arg)?;
    let callback = cx.argument::<JsFunction>(3)?;

    let task = op(&c, s, is_module.value(), options);
    task.schedule(callback);

    Ok(cx.undefined().upcast())
}

pub fn exec_transform<F>(mut cx: MethodContext<JsCompiler>, op: F) -> JsResult<JsValue>
where
    F: FnOnce(&Compiler, String, &Options) -> Result<Arc<SourceFile>, Error>,
{
    let s = cx.argument::<JsString>(0)?;
    let is_module = cx.argument::<JsBoolean>(1)?;
    let options: Options = match cx.argument_opt(2) {
        Some(v) => neon_serde::from_value(&mut cx, v)?,
        None => {
            let obj = cx.empty_object().upcast();
            neon_serde::from_value(&mut cx, obj)?
        }
    };

    let this = cx.this();
    let output = {
        let guard = cx.lock();
        let c = this.borrow(&guard);
        c.run(|| {
            if is_module.value() {
                let program: Program =
                    serde_json::from_str(&s.value()).expect("failed to deserialize Program");
                c.process_js(program, &options)
            } else {
                let fm = op(&c, s.value(), &options).expect("failed to create fm");
                c.process_js_file(fm, &options)
            }
        })
    };

    complete_output(cx, output)
}

pub fn transform(cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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

pub fn transform_sync(cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
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

pub fn transform_file(cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    schedule_transform(cx, |c, path, _, options| {
        let path = clean(&path);

        TransformTask {
            c: c.clone(),
            input: Input::File(path.into()),
            options,
        }
    })
}

pub fn transform_file_sync(cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    exec_transform(cx, |c, path, _| {
        Ok(c.cm
            .load_file(Path::new(&path))
            .expect("failed to load file"))
    })
}
