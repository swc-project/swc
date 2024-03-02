use std::sync::Arc;

use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, Task,
};
use swc_core::{
    base::{
        config::{Options, SourceMapsConfig},
        Compiler, PrintArgs, TransformOutput,
    },
    common::GLOBALS,
    ecma::ast::{EsVersion, Program},
    node::{deserialize_json, get_deserialized, MapErr},
};

use crate::get_compiler;

// ----- Printing -----

pub struct PrintTask {
    pub c: Arc<Compiler>,
    pub program_json: String,
    pub options: String,
}

#[napi]
impl Task for PrintTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let program: Program = deserialize_json(&self.program_json)?;
        let options: Options = deserialize_json(&self.options)?;

        GLOBALS.set(&Default::default(), || {
            self.c
                .print(
                    &program,
                    PrintArgs {
                        output_path: options.output_path.clone(),
                        inline_sources_content: true,
                        source_map: options
                            .source_maps
                            .clone()
                            .unwrap_or(SourceMapsConfig::Bool(false)),
                        emit_source_map_columns: options.config.emit_source_map_columns.into_bool(),
                        codegen_config: swc_core::ecma::codegen::Config::default()
                            .with_target(options.config.jsc.target.unwrap_or(EsVersion::Es2020))
                            .with_minify(options.config.minify.into_bool()),
                        ..Default::default()
                    },
                )
                .convert_err()
        })
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }
}

#[napi]
pub fn print(
    program_json: String,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> napi::Result<AsyncTask<PrintTask>> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();
    let options = String::from_utf8_lossy(&options).to_string();

    Ok(AsyncTask::with_optional_signal(
        PrintTask {
            c,
            program_json,
            options,
        },
        signal,
    ))
}

#[napi]
pub fn print_sync(program: String, options: Buffer) -> napi::Result<TransformOutput> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();

    let program: Program = deserialize_json(program.as_str())?;

    let options: Options = get_deserialized(&options)?;

    // Defaults to es3
    let codegen_target = options.codegen_target().unwrap_or_default();

    GLOBALS.set(&Default::default(), || {
        c.print(
            &program,
            PrintArgs {
                output_path: options.output_path,
                inline_sources_content: true,
                source_map: options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                emit_source_map_columns: options.config.emit_source_map_columns.into_bool(),
                codegen_config: swc_core::ecma::codegen::Config::default()
                    .with_target(codegen_target)
                    .with_minify(options.config.minify.into_bool()),
                ..Default::default()
            },
        )
        .convert_err()
    })
}
