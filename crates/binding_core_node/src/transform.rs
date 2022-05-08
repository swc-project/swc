use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context as _;
use binding_commons::{deserialize_json, get_deserialized, MapErr};
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, JsBuffer, JsBufferValue, Ref, Task,
};
use path_clean::clean;
use swc::{config::Options, Compiler, TransformOutput};
use swc_common::FileName;
use swc_ecma_ast::Program;
use tracing::instrument;

use crate::{get_compiler, util::try_with};

/// Input to transform
#[derive(Debug)]
pub enum Input {
    /// json string
    Program(String),
    /// Raw source code.
    Source { src: String },
    /// File
    File(PathBuf),
}

pub struct TransformTask {
    pub c: Arc<Compiler>,
    pub input: Input,
    pub options: Ref<JsBufferValue>,
}

#[napi]
impl Task for TransformTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    #[instrument(level = "trace", skip_all)]
    fn compute(&mut self) -> napi::Result<Self::Output> {
        let mut options: Options = serde_json::from_slice(self.options.as_ref())?;
        if !options.filename.is_empty() {
            options.config.adjust(Path::new(&options.filename));
        }

        try_with(
            self.c.cm.clone(),
            !options.config.error.filename.into_bool(),
            |handler| {
                self.c.run(|| match &self.input {
                    Input::Program(ref s) => {
                        let program: Program =
                            deserialize_json(s).expect("failed to deserialize Program");
                        // TODO: Source map
                        self.c.process_js(handler, program, &options)
                    }

                    Input::File(ref path) => {
                        let fm = self.c.cm.load_file(path).context("failed to load file")?;
                        self.c.process_js_file(fm, handler, &options)
                    }

                    Input::Source { src } => {
                        let fm = self.c.cm.new_source_file(
                            if options.filename.is_empty() {
                                FileName::Anon
                            } else {
                                FileName::Real(options.filename.clone().into())
                            },
                            src.to_string(),
                        );

                        self.c.process_js_file(fm, handler, &options)
                    }
                })
            },
        )
        .convert_err()
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }

    fn finally(&mut self, env: Env) -> napi::Result<()> {
        self.options.unref(env)?;
        Ok(())
    }
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform(
    src: String,
    is_module: bool,
    options: JsBuffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    binding_commons::init_default_trace_subscriber();

    let c = get_compiler();

    let input = if is_module {
        Input::Program(src)
    } else {
        Input::Source { src }
    };

    let task = TransformTask {
        c,
        input,
        options: options.into_ref()?,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_sync(s: String, is_module: bool, opts: Buffer) -> napi::Result<TransformOutput> {
    binding_commons::init_default_trace_subscriber();

    let c = get_compiler();

    let mut options: Options = get_deserialized(&opts)?;

    if !options.filename.is_empty() {
        options.config.adjust(Path::new(&options.filename));
    }

    try_with(
        c.cm.clone(),
        !options.config.error.filename.into_bool(),
        |handler| {
            c.run(|| {
                if is_module {
                    let program: Program =
                        deserialize_json(s.as_str()).context("failed to deserialize Program")?;
                    c.process_js(handler, program, &options)
                } else {
                    let fm = c.cm.new_source_file(
                        if options.filename.is_empty() {
                            FileName::Anon
                        } else {
                            FileName::Real(options.filename.clone().into())
                        },
                        s,
                    );
                    c.process_js_file(fm, handler, &options)
                }
            })
        },
    )
    .convert_err()
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_file(
    src: String,
    _is_module: bool,
    options: JsBuffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    binding_commons::init_default_trace_subscriber();

    let c = get_compiler();

    let path = clean(&src);
    let task = TransformTask {
        c,
        input: Input::File(path.into()),
        options: options.into_ref()?,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
pub fn transform_file_sync(
    s: String,
    is_module: bool,
    opts: Buffer,
) -> napi::Result<TransformOutput> {
    binding_commons::init_default_trace_subscriber();

    let c = get_compiler();

    let mut options: Options = get_deserialized(&opts)?;

    if !options.filename.is_empty() {
        options.config.adjust(Path::new(&options.filename));
    }

    try_with(
        c.cm.clone(),
        !options.config.error.filename.into_bool(),
        |handler| {
            c.run(|| {
                if is_module {
                    let program: Program =
                        deserialize_json(s.as_str()).context("failed to deserialize Program")?;
                    c.process_js(handler, program, &options)
                } else {
                    let fm = c.cm.load_file(Path::new(&s)).expect("failed to load file");
                    c.process_js_file(fm, handler, &options)
                }
            })
        },
    )
    .convert_err()
}
