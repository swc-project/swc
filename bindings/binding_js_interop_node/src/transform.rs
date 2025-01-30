use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context as _;
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask},
    Env, JsBuffer, JsBufferValue, JsFunction, Ref, Task,
};
use path_clean::clean;
use swc_core::{
    base::{config::Options, Compiler, TransformOutput},
    common::FileName,
    ecma::ast::Program,
    node::{deserialize_json, MapErr},
};
use swc_interop_babel::transform::JsTrasnform;
use tracing::instrument;

use crate::{get_compiler, util::try_with};

/// Input to transform
#[derive(Debug)]
pub enum Input {
    /// Raw source code.
    Source { src: String },
    /// File
    File(PathBuf),
}

pub struct TransformTask {
    pub c: Arc<Compiler>,
    pub input: Input,
    pub options: Ref<JsBufferValue>,
    pub babel_transform: Option<JsTrasnform>,
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

        let error_format = options.experimental.error_format.unwrap_or_default();

        try_with(
            self.c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| {
                self.c.run(|| match &self.input {
                    Input::File(ref path) => {
                        let fm = self.c.cm.load_file(path).context("failed to load file")?;
                        self.c.process_js_file(fm, handler, &options)
                    }

                    Input::Source { src } => {
                        let fm = self.c.cm.new_source_file(
                            if options.filename.is_empty() {
                                FileName::Anon.into()
                            } else {
                                FileName::Real(options.filename.clone().into()).into()
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
    env: Env,
    src: String,
    _is_module: bool,
    options: JsBuffer,
    babel_transform: Option<JsFunction>,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();

    let input = Input::Source { src };

    let task = TransformTask {
        c,
        input,
        options: options.into_ref()?,
        babel_transform: match babel_transform {
            Some(f) => Some(JsTrasnform::new(&env, &f)?),
            None => None,
        },
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_file(
    env: Env,
    src: String,
    _is_module: bool,
    options: JsBuffer,
    babel_transform: Option<JsFunction>,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();

    let path = clean(&src);
    let task = TransformTask {
        c,
        input: Input::File(path),
        options: options.into_ref()?,
        babel_transform: match babel_transform {
            Some(f) => Some(JsTrasnform::new(&env, &f)?),
            None => None,
        },
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}
