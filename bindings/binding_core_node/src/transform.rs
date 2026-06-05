use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context as _, Error};
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, Task,
};
use path_clean::clean;
use swc_core::{
    base::{config::Options, Compiler, TransformOutput},
    common::{comments::SingleThreadedComments, errors::Handler, FileName},
    ecma::ast::noop_pass,
    node::{get_deserialized, MapErr},
};
use tracing::instrument;

use crate::{
    ast_context::{deserialize_program_input, prepare_program_with_context, ProgramInput},
    get_compiler, get_fresh_compiler,
    util::try_with,
};

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
    pub options: Buffer,
}

fn compiler_for_program_input(
    program_input: &ProgramInput,
    fallback: Arc<Compiler>,
) -> Arc<Compiler> {
    match program_input {
        ProgramInput::WithContext { .. } => get_fresh_compiler(),
        ProgramInput::Raw(_) => fallback,
    }
}

fn process_program_input(
    c: &Compiler,
    handler: &Handler,
    program_input: ProgramInput,
    options: &Options,
) -> Result<TransformOutput, Error> {
    match program_input {
        ProgramInput::WithContext {
            program,
            source_context,
        } => {
            let (fm, program) = prepare_program_with_context(c, program, source_context)?;

            c.process_js_with_custom_pass(
                fm,
                Some(program),
                handler,
                options,
                SingleThreadedComments::default(),
                |_| noop_pass(),
                |_| noop_pass(),
            )
        }
        ProgramInput::Raw(program) => c.process_js(handler, program, options),
    }
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

        match &self.input {
            Input::Program(s) => {
                let program_input = deserialize_program_input(s)?;
                let c = compiler_for_program_input(&program_input, self.c.clone());

                try_with(
                    c.cm.clone(),
                    !options.config.error.filename.into_bool(),
                    error_format,
                    |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
                )
                .convert_err()
            }

            _ => try_with(
                self.c.cm.clone(),
                !options.config.error.filename.into_bool(),
                error_format,
                |handler| {
                    self.c.run(|| match &self.input {
                        Input::Program(_) => unreachable!("Program input is handled above"),

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
                                src.clone(),
                            );

                            self.c.process_js_file(fm, handler, &options)
                        }
                    })
                },
            )
            .convert_err(),
        }
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform(
    src: String,
    is_module: bool,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    crate::util::init_default_trace_subscriber();

    let (input, c) = if is_module {
        (Input::Program(src), get_compiler())
    } else {
        (Input::Source { src }, get_fresh_compiler())
    };

    let task = TransformTask { c, input, options };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_sync(s: String, is_module: bool, opts: Buffer) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();

    let mut options: Options = get_deserialized(&opts)?;

    if !options.filename.is_empty() {
        options.config.adjust(Path::new(&options.filename));
    }

    let error_format = options.experimental.error_format.unwrap_or_default();

    if is_module {
        let program_input = deserialize_program_input(s.as_str())?;
        let c = compiler_for_program_input(&program_input, get_compiler());

        try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
        )
        .convert_err()
    } else {
        let c = get_fresh_compiler();

        try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| {
                c.run(|| {
                    let fm = c.cm.new_source_file(
                        if options.filename.is_empty() {
                            FileName::Anon.into()
                        } else {
                            FileName::Real(options.filename.clone().into()).into()
                        },
                        s,
                    );
                    c.process_js_file(fm, handler, &options)
                })
            },
        )
        .convert_err()
    }
}

#[napi]
#[instrument(level = "trace", skip_all)]
pub fn transform_file(
    src: String,
    _is_module: bool,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<TransformTask>> {
    crate::util::init_default_trace_subscriber();

    let c = get_fresh_compiler();

    let path = clean(&src);
    let task = TransformTask {
        c,
        input: Input::File(path),
        options,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
pub fn transform_file_sync(
    s: String,
    is_module: bool,
    opts: Buffer,
) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();

    let mut options: Options = get_deserialized(&opts)?;

    if !options.filename.is_empty() {
        options.config.adjust(Path::new(&options.filename));
    }

    let error_format = options.experimental.error_format.unwrap_or_default();

    if is_module {
        let program_input = deserialize_program_input(s.as_str())?;
        let c = compiler_for_program_input(&program_input, get_compiler());

        try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
        )
        .convert_err()
    } else {
        let c = get_fresh_compiler();

        try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| {
                c.run(|| {
                    let fm = c.cm.load_file(Path::new(&s)).expect("failed to load file");
                    c.process_js_file(fm, handler, &options)
                })
            },
        )
        .convert_err()
    }
}
