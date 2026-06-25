use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context as _, Error};
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer, ToNapiValue},
    Env, Status, Task,
};
use path_clean::clean;
use swc_core::{
    base::{
        config::Options, Compiler, ReactCompilerDiagnostic, ReactCompilerDiagnosticError,
        TransformOutput,
    },
    common::{comments::SingleThreadedComments, errors::Handler, FileName},
    ecma::ast::noop_pass,
    node::get_deserialized,
};

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

fn react_compiler_diagnostics_from_error(err: &Error) -> Option<Vec<ReactCompilerDiagnostic>> {
    err.downcast_ref::<ReactCompilerDiagnosticError>()
        .map(|err| err.diagnostics().to_vec())
}

fn convert_transform_result(
    result: Result<TransformOutput, Error>,
    diagnostics: &mut Option<Vec<ReactCompilerDiagnostic>>,
) -> napi::Result<TransformOutput> {
    result.map_err(|err| {
        *diagnostics = react_compiler_diagnostics_from_error(&err);
        napi::Error::new(Status::GenericFailure, format!("{err:?}"))
    })
}

fn convert_transform_result_with_env(
    env: Env,
    result: Result<TransformOutput, Error>,
) -> napi::Result<TransformOutput> {
    match result {
        Ok(output) => Ok(output),
        Err(err) => {
            if let Some(diagnostics) = react_compiler_diagnostics_from_error(&err) {
                return throw_react_compiler_diagnostic_error(
                    env,
                    napi::Error::new(Status::GenericFailure, format!("{err:?}")),
                    diagnostics,
                );
            }

            Err(napi::Error::new(Status::GenericFailure, format!("{err:?}")))
        }
    }
}

fn throw_react_compiler_diagnostic_error(
    env: Env,
    err: napi::Error,
    diagnostics: Vec<ReactCompilerDiagnostic>,
) -> napi::Result<TransformOutput> {
    let mut js_error = env.create_error(err)?;
    js_error.set("reactCompilerDiagnostics", diagnostics)?;
    let raw_error = unsafe { ToNapiValue::to_napi_value(env.raw(), js_error)? };
    unsafe {
        napi::sys::napi_throw(env.raw(), raw_error);
    }

    Err(napi::Error::from_status(Status::PendingException))
}

pub struct TransformTask {
    pub c: Arc<Compiler>,
    pub input: Input,
    pub options: Buffer,
    pub react_compiler_diagnostics: Option<Vec<ReactCompilerDiagnostic>>,
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

    #[cfg_attr(debug_assertions, tracing::instrument(level = "trace", skip_all))]
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

                let result = try_with(
                    c.cm.clone(),
                    !options.config.error.filename.into_bool(),
                    error_format,
                    |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
                );
                convert_transform_result(result, &mut self.react_compiler_diagnostics)
            }

            _ => {
                let result = try_with(
                    self.c.cm.clone(),
                    !options.config.error.filename.into_bool(),
                    error_format,
                    |handler| {
                        self.c.run(|| match &self.input {
                            Input::Program(_) => unreachable!("Program input is handled above"),

                            Input::File(ref path) => {
                                let fm =
                                    self.c.cm.load_file(path).context("failed to load file")?;
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
                );
                convert_transform_result(result, &mut self.react_compiler_diagnostics)
            }
        }
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }

    fn reject(&mut self, env: Env, err: napi::Error) -> napi::Result<Self::JsValue> {
        if let Some(diagnostics) = self.react_compiler_diagnostics.take() {
            return throw_react_compiler_diagnostic_error(env, err, diagnostics);
        }

        Err(err)
    }
}

#[napi]
#[cfg_attr(debug_assertions, tracing::instrument(level = "trace", skip_all))]
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

    let task = TransformTask {
        c,
        input,
        options,
        react_compiler_diagnostics: None,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
#[cfg_attr(debug_assertions, tracing::instrument(level = "trace", skip_all))]
pub fn transform_sync(
    env: Env,
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

        let result = try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
        );
        convert_transform_result_with_env(env, result)
    } else {
        let c = get_fresh_compiler();
        let result = try_with(
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
        );
        convert_transform_result_with_env(env, result)
    }
}

#[napi]
#[cfg_attr(debug_assertions, tracing::instrument(level = "trace", skip_all))]
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
        react_compiler_diagnostics: None,
    };
    Ok(AsyncTask::with_optional_signal(task, signal))
}

#[napi]
pub fn transform_file_sync(
    env: Env,
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

        let result = try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| c.run(|| process_program_input(&c, handler, program_input, &options)),
        );
        convert_transform_result_with_env(env, result)
    } else {
        let c = get_fresh_compiler();
        let result = try_with(
            c.cm.clone(),
            !options.config.error.filename.into_bool(),
            error_format,
            |handler| {
                c.run(|| {
                    let fm = c.cm.load_file(Path::new(&s)).expect("failed to load file");
                    c.process_js_file(fm, handler, &options)
                })
            },
        );
        convert_transform_result_with_env(env, result)
    }
}
