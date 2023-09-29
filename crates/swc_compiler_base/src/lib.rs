use std::{env, path::PathBuf};

use anyhow::Error;
use serde::Serialize;
use swc_atoms::JsWord;
use swc_common::{
    collections::AHashMap, comments::Comments, errors::Handler, sync::Lrc, BytePos, SourceFile,
    SourceMap,
};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::Node;
use swc_ecma_parser::Syntax;
use swc_ecma_visit::VisitWith;

#[cfg(feature = "node")]
#[napi_derive::napi(object)]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

#[cfg(not(feature = "node"))]
#[derive(Debug, Serialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

/// This method parses a javascript / typescript file
///
/// This should be called in a scope of [swc_common::GLOBALS].
pub fn parse_js(
    cm: Lrc<SourceMap>,
    fm: Lrc<SourceFile>,
    handler: &Handler,
    target: EsVersion,
    syntax: Syntax,
    is_module: IsModule,
    comments: Option<&dyn Comments>,
) -> Result<Program, Error> {
    let mut res = (|| {
        let mut error = false;

        let mut errors = vec![];
        let program_result = match is_module {
            IsModule::Bool(true) => {
                parse_file_as_module(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Module)
            }
            IsModule::Bool(false) => {
                parse_file_as_script(&fm, syntax, target, comments, &mut errors)
                    .map(Program::Script)
            }
            IsModule::Unknown => parse_file_as_program(&fm, syntax, target, comments, &mut errors),
        };

        for e in errors {
            e.into_diagnostic(handler).emit();
            error = true;
        }

        let program = program_result.map_err(|e| {
            e.into_diagnostic(handler).emit();
            Error::msg("Syntax Error")
        })?;

        if error {
            return Err(anyhow::anyhow!("Syntax Error"));
        }

        Ok(program)
    })();

    if env::var("SWC_DEBUG").unwrap_or_default() == "1" {
        res = res.with_context(|| format!("Parser config: {:?}", syntax));
    }

    res
}

/// Converts ast node to source string and sourcemap.
///
///
/// This method receives target file path, but does not write file to the
/// path. See: https://github.com/swc-project/swc/issues/1255
///
///
///
/// This should be called in a scope of [swc_common::GLOBALS].
#[allow(clippy::too_many_arguments)]
pub fn print<T>(
    node: &T,
    source_file_name: Option<&str>,
    output_path: Option<PathBuf>,
    inline_sources_content: bool,
    source_map: SourceMapsConfig,
    source_map_names: &AHashMap<BytePos, JsWord>,
    orig: Option<&sourcemap::SourceMap>,
    comments: Option<&dyn Comments>,
    emit_source_map_columns: bool,
    preamble: &str,
    codegen_config: swc_ecma_codegen::Config,
) -> Result<TransformOutput, Error>
where
    T: Node + VisitWith<IdentCollector>,
{
    self.run(|| {
        let _timer = timer!("Compiler.print");

        let mut src_map_buf = vec![];

        let src = {
            let mut buf = vec![];
            {
                let mut w = swc_ecma_codegen::text_writer::JsWriter::new(
                    self.cm.clone(),
                    "\n",
                    &mut buf,
                    if source_map.enabled() {
                        Some(&mut src_map_buf)
                    } else {
                        None
                    },
                );
                w.preamble(preamble).unwrap();
                let mut wr = Box::new(w) as Box<dyn WriteJs>;

                if codegen_config.minify {
                    wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));
                }

                let mut emitter = Emitter {
                    cfg: codegen_config,
                    comments,
                    cm: self.cm.clone(),
                    wr,
                };

                node.emit_with(&mut emitter)
                    .context("failed to emit module")?;
            }
            // Invalid utf8 is valid in javascript world.
            String::from_utf8(buf).expect("invalid utf8 character detected")
        };

        if cfg!(debug_assertions)
            && !src_map_buf.is_empty()
            && src_map_buf.iter().all(|(bp, _)| bp.is_dummy())
            && src.lines().count() >= 3
            && option_env!("SWC_DEBUG") == Some("1")
        {
            panic!("The module contains only dummy spans\n{}", src);
        }

        let (code, map) = match source_map {
            SourceMapsConfig::Bool(v) => {
                if v {
                    let mut buf = vec![];

                    self.cm
                        .build_source_map_with_config(
                            &src_map_buf,
                            orig,
                            SwcSourceMapConfig {
                                source_file_name,
                                output_path: output_path.as_deref(),
                                names: source_map_names,
                                inline_sources_content,
                                emit_columns: emit_source_map_columns,
                            },
                        )
                        .to_writer(&mut buf)
                        .context("failed to write source map")?;
                    let map = String::from_utf8(buf).context("source map is not utf-8")?;
                    (src, Some(map))
                } else {
                    (src, None)
                }
            }
            SourceMapsConfig::Str(_) => {
                let mut src = src;
                let mut buf = vec![];

                self.cm
                    .build_source_map_with_config(
                        &src_map_buf,
                        orig,
                        SwcSourceMapConfig {
                            source_file_name,
                            output_path: output_path.as_deref(),
                            names: source_map_names,
                            inline_sources_content,
                            emit_columns: emit_source_map_columns,
                        },
                    )
                    .to_writer(&mut buf)
                    .context("failed to write source map file")?;
                let map = String::from_utf8(buf).context("source map is not utf-8")?;

                src.push_str("\n//# sourceMappingURL=data:application/json;base64,");
                base64::encode_config_buf(
                    map.as_bytes(),
                    base64::Config::new(base64::CharacterSet::Standard, true),
                    &mut src,
                );
                (src, None)
            }
        };

        Ok(TransformOutput { code, map })
    })
}
