use anyhow::{Context, Error};
use serde::{Deserialize, Serialize};
use swc_core::{
    common::{
        comments::SingleThreadedComments,
        errors::{ColorConfig, HANDLER},
        source_map::SourceMapGenConfig,
        sync::Lrc,
        FileName, Mark, SourceMap, Spanned, GLOBALS,
    },
    ecma::{
        ast::{Decorator, EsVersion, Program, TsEnumDecl, TsParamPropParam},
        codegen::text_writer::JsWriter,
        parser::{
            parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax, TsSyntax,
        },
        transforms::{
            base::{
                fixer::fixer,
                helpers::{inject_helpers, Helpers, HELPERS},
                hygiene::hygiene,
                resolver,
            },
            typescript::{strip_type, typescript},
        },
        visit::{Visit, VisitMutWith, VisitWith},
    },
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{
    future_to_promise,
    js_sys::{JsString, Promise},
};

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function transform(src: string, opts?: Options): Promise<TransformOutput>;
export function transformSync(src: string, opts?: Options): TransformOutput;
"#;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default)]
    pub module: Option<bool>,
    #[serde(default)]
    pub filename: Option<String>,

    #[serde(default = "default_ts_syntax")]
    pub parser: TsSyntax,

    #[serde(default)]
    pub external_helpers: bool,

    #[serde(default)]
    pub source_maps: bool,

    #[serde(default)]
    pub mode: Mode,

    #[serde(default)]
    pub transform: Option<swc_core::ecma::transforms::typescript::Config>,

    #[serde(default)]
    pub codegen: swc_core::ecma::codegen::Config,
}

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
}

#[derive(Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Mode {
    #[default]
    StripOnly,
    Transform,
}

#[derive(Serialize)]
pub struct TransformOutput {
    code: String,
    map: Option<String>,
}

#[wasm_bindgen]
pub fn transform(input: JsString, options: JsValue) -> Promise {
    future_to_promise(async move { transform_sync(input, options) })
}

#[wasm_bindgen(js_name = "transformSync")]
pub fn transform_sync(input: JsString, options: JsValue) -> Result<JsValue, JsValue> {
    let options: Options = serde_wasm_bindgen::from_value(options)?;

    let input = input.as_string().unwrap();

    let result = GLOBALS
        .set(&Default::default(), || operate(input, options))
        .map_err(convert_err)?;

    Ok(serde_wasm_bindgen::to_value(&result)?)
}

fn operate(input: String, options: Options) -> Result<TransformOutput, Error> {
    let cm = Lrc::new(SourceMap::default());

    try_with_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Never,
            skip_filename: true,
        },
        |handler| {
            let filename = options
                .filename
                .map_or(FileName::Anon, |f| FileName::Real(f.into()));

            let fm = cm.new_source_file(filename, input);

            let syntax = Syntax::Typescript(options.parser);
            let target = EsVersion::latest();

            let comments = SingleThreadedComments::default();
            let mut errors = vec![];

            let program = match options.module {
                Some(true) => {
                    parse_file_as_module(&fm, syntax, target, Some(&comments), &mut errors)
                        .map(Program::Module)
                }
                Some(false) => {
                    parse_file_as_script(&fm, syntax, target, Some(&comments), &mut errors)
                        .map(Program::Script)
                }
                None => parse_file_as_program(&fm, syntax, target, Some(&comments), &mut errors),
            };

            let mut program = match program {
                Ok(program) => program,
                Err(err) => {
                    err.into_diagnostic(handler).emit();

                    for e in errors {
                        e.into_diagnostic(handler).emit();
                    }

                    return Err(anyhow::anyhow!("failed to parse"));
                }
            };

            if !errors.is_empty() {
                for e in errors {
                    e.into_diagnostic(handler).emit();
                }

                return Err(anyhow::anyhow!("failed to parse"));
            }

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            HELPERS.set(&Helpers::new(options.external_helpers), || {
                // Apply resolver

                program.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, true));

                // Strip typescript types

                program.visit_with(&mut Validator { mode: options.mode });

                match options.mode {
                    Mode::StripOnly => {
                        program.visit_mut_with(&mut strip_type());
                    }
                    Mode::Transform => {
                        program.visit_mut_with(&mut typescript(
                            options.transform.unwrap_or_default(),
                            top_level_mark,
                        ));
                    }
                }

                // Apply external helpers

                program.visit_mut_with(&mut inject_helpers(unresolved_mark));

                // Apply hygiene

                program.visit_mut_with(&mut hygiene());

                // Apply fixer

                program.visit_mut_with(&mut fixer(Some(&comments)));
            });

            // Generate code

            let mut buf = vec![];
            let mut src_map_buf = if options.source_maps {
                Some(vec![])
            } else {
                None
            };

            {
                let wr = JsWriter::new(cm.clone(), "\n", &mut buf, src_map_buf.as_mut());
                let mut emitter = swc_core::ecma::codegen::Emitter {
                    cfg: options.codegen,
                    cm: cm.clone(),
                    comments: Some(&comments),
                    wr,
                };

                emitter.emit_program(&program).unwrap();
            }

            let code = String::from_utf8(buf).context("generated code is not utf-8")?;

            let map = if let Some(src_map_buf) = src_map_buf {
                let mut wr = vec![];
                let map = cm.build_source_map_with_config(&src_map_buf, None, TsSourceMapGenConfig);

                map.to_writer(&mut wr)
                    .context("failed to write source map")?;

                let map = String::from_utf8(wr).context("source map is not utf-8")?;
                Some(map)
            } else {
                None
            };

            Ok(TransformOutput { code, map })
        },
    )
}

pub fn convert_err(err: Error) -> wasm_bindgen::prelude::JsValue {
    format!("{:?}", err).into()
}

struct TsSourceMapGenConfig;

impl SourceMapGenConfig for TsSourceMapGenConfig {
    fn file_name_to_source(&self, f: &FileName) -> String {
        f.to_string()
    }
}

struct Validator {
    mode: Mode,
}

impl Visit for Validator {
    fn visit_decorator(&mut self, n: &Decorator) {
        HANDLER.with(|handler| {
            handler.span_err(n.span, "Decorators are not supported");
        });
    }

    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        if matches!(self.mode, Mode::StripOnly) {
            HANDLER.with(|handler| {
                handler.span_err(
                    e.span,
                    "TypeScript enum is not supported in strip-only mode",
                );
            });
            return;
        }

        e.visit_children_with(self);
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        if matches!(self.mode, Mode::StripOnly) {
            HANDLER.with(|handler| {
                handler.span_err(
                    n.span(),
                    "TypeScript parameter property is not supported in strip-only mode",
                );
            });
            return;
        }

        n.visit_children_with(self);
    }
}
