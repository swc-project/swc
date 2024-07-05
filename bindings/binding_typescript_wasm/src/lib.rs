use anyhow::Error;
use serde::Deserialize;
use swc_core::{
    common::{
        comments::SingleThreadedComments,
        errors::{ColorConfig, HANDLER},
        source_map::SourceMapGenConfig,
        sync::Lrc,
        BytePos, FileName, Mark, SourceMap, Span, Spanned, GLOBALS,
    },
    ecma::{
        ast::{
            Decorator, EsVersion, Program, TsEnumDecl, TsModuleDecl, TsNamespaceDecl,
            TsParamPropParam,
        },
        parser::{
            parse_file_as_module, parse_file_as_program, parse_file_as_script, Syntax, TsSyntax,
        },
        visit::{Visit, VisitWith},
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
}

fn default_ts_syntax() -> TsSyntax {
    TsSyntax {
        decorators: true,
        ..Default::default()
    }
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

fn operate(input: String, options: Options) -> Result<String, Error> {
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

            let program = match program {
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

            let mut replacements = vec![];
            // Strip typescript types
            program.visit_with(&mut TsStrip {
                replacements: &mut replacements,
            });

            let mut code = String::with_capacity(fm.src.len());
            let mut index = 0;

            for r in replacements {
                code.push_str(&fm.src[index..r.0 .0 as usize]);
                index = r.1 .0 as usize;
            }

            Ok(code)
        },
    )
}

pub fn convert_err(err: Error) -> wasm_bindgen::prelude::JsValue {
    format!("{:?}", err).into()
}

struct TsStrip<'a> {
    replacements: &'a mut Vec<(BytePos, BytePos)>,
}

impl TsStrip<'_> {
    fn add_replacement(&mut self, span: Span) {
        self.replacements.push((span.lo, span.hi));
    }
}

impl Visit for TsStrip<'_> {
    fn visit_decorator(&mut self, n: &Decorator) {
        HANDLER.with(|handler| {
            handler.span_err(n.span, "Decorators are not supported");
        });
    }

    fn visit_ts_enum_decl(&mut self, e: &TsEnumDecl) {
        if e.declare {
            self.add_replacement(e.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                e.span,
                "TypeScript enum is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript namespace declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        if n.declare {
            self.add_replacement(n.span);
            return;
        }

        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript module declaration is not supported in strip-only mode",
            );
        });
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        HANDLER.with(|handler| {
            handler.span_err(
                n.span(),
                "TypeScript parameter property is not supported in strip-only mode",
            );
        });
        return;
    }
}
