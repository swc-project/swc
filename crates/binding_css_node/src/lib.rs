#![feature(backtrace)]

#[macro_use]
extern crate napi_derive;

mod util;

use std::{backtrace::Backtrace, env, panic::set_hook};

use anyhow::{bail, Context};
use binding_commons::{deserialize_json, get_deserialized, MapErr};
use napi::{bindgen_prelude::*, Task};
use serde::{Deserialize, Serialize};
use swc_common::FileName;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType, LineFeed},
    CodeGenerator, CodegenConfig, Emit,
};

use crate::util::try_with;

#[napi::module_init]
fn init() {
    if cfg!(debug_assertions) || env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        set_hook(Box::new(|panic_info| {
            let backtrace = Backtrace::force_capture();
            println!("Panic: {:?}\nBacktrace: {:?}", panic_info, backtrace);
        }));
    }
}

#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

struct MinifyTask {
    code: String,
    options: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MinifyOptions {
    #[serde(default)]
    filename: Option<String>,

    #[serde(default)]
    source_map: bool,
}

#[napi]
impl Task for MinifyTask {
    type JsValue = TransformOutput;
    type Output = TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let opts = deserialize_json(&self.options)
            .context("failed to deserialize minifier options")
            .convert_err()?;

        minify_inner(&self.code, opts).convert_err()
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

fn minify_inner(code: &str, opts: MinifyOptions) -> anyhow::Result<TransformOutput> {
    try_with(|cm, handler| {
        let filename = match opts.filename {
            Some(v) => FileName::Real(v.into()),
            None => FileName::Anon,
        };

        let fm = cm.new_source_file(filename, code.into());

        let mut errors = vec![];
        let ss = swc_css_parser::parse_file::<swc_css_ast::Stylesheet>(
            &fm,
            swc_css_parser::parser::ParserConfig {
                allow_wrong_line_comments: false,
            },
            &mut errors,
        );

        let mut ss = match ss {
            Ok(v) => v,
            Err(err) => {
                err.to_diagnostics(handler).emit();

                for err in errors {
                    err.to_diagnostics(handler).emit();
                }

                bail!("failed to parse input as stylesheet")
            }
        };

        if !errors.is_empty() {
            for err in errors {
                err.to_diagnostics(handler).emit();
            }
            bail!("failed to parse input as stylesheet (recovered)")
        }

        swc_css_minifier::minify(&mut ss);

        let mut src_map = vec![];
        let code = {
            let mut buf = String::new();
            {
                let mut wr = BasicCssWriter::new(
                    &mut buf,
                    if opts.source_map {
                        Some(&mut src_map)
                    } else {
                        None
                    },
                    BasicCssWriterConfig {
                        indent_type: IndentType::Space,
                        indent_width: 0,
                        linefeed: LineFeed::LF,
                    },
                );
                let mut gen = CodeGenerator::new(&mut wr, CodegenConfig { minify: true });

                gen.emit(&ss).context("failed to emit")?;
            }

            buf
        };

        let map = if opts.source_map {
            let map = cm.build_source_map(&mut src_map);
            let mut buf = vec![];
            map.to_writer(&mut buf)
                .context("failed to geneate sourcemap")?;
            Some(String::from_utf8(buf).context("the generated source map is not utf8")?)
        } else {
            None
        };

        Ok(TransformOutput { code, map })
    })
}

#[allow(unused)]
#[napi]
fn minify(code: Buffer, opts: Buffer, signal: Option<AbortSignal>) -> AsyncTask<MinifyTask> {
    binding_commons::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let options = String::from_utf8_lossy(opts.as_ref()).to_string();

    let task = MinifyTask { code, options };

    AsyncTask::with_optional_signal(task, signal)
}

#[allow(unused)]
#[napi]
pub fn minify_sync(code: Buffer, opts: Buffer) -> napi::Result<TransformOutput> {
    binding_commons::init_default_trace_subscriber();
    let code = String::from_utf8_lossy(code.as_ref()).to_string();
    let opts = get_deserialized(opts)?;

    minify_inner(&code, opts).convert_err()
}
