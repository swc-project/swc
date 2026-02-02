use std::sync::Arc;

use anyhow::Result;
use swc_core::{
    self,
    common::{errors::ColorConfig, FileName, Globals, Mark, SourceMap, GLOBALS},
    ecma::{
        ast::*,
        parser::{unstable::Capturing, EsSyntax, Lexer, Parser, StringInput, Syntax, TsSyntax},
        transforms::base::resolver,
        visit::VisitMutWith,
    },
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use wasm_bindgen::prelude::wasm_bindgen;

static FILE_NAME: &str = "main.mtsx";

#[wasm_bindgen]
pub fn parse(input: &str, file_name: Option<String>) -> Result<Vec<String>, String> {
    let file_name = file_name.unwrap_or_else(|| FILE_NAME.to_string());
    let mut iter = file_name.rsplit('.');
    let ext = iter.next();

    let lower_ext = ext.map(|e| e.to_ascii_lowercase());

    let is_jsx = lower_ext
        .as_deref()
        .map(|e| {
            e == "jsx" || e == "tsx" || e == "mjsx" || e == "cjsx" || e == "mtsx" || e == "ctsx"
        })
        .unwrap_or_default();

    let is_esm = lower_ext
        .as_deref()
        .map(|e| e == "mjs" || e == "mts" || e == "mjsx" || e == "mtsx")
        .unwrap_or_default();

    let is_cjs = lower_ext
        .as_deref()
        .map(|e| e == "cjs" || e == "cts" || e == "cjsx" || e == "ctsx")
        .unwrap_or_default();

    let is_ts = lower_ext
        .as_deref()
        .map(|e| e == "ts" || e == "tsx" || e == "mts" || e == "cts" || e == "mtsx" || e == "ctsx")
        .unwrap_or_default();

    let is_d_ts =
        is_ts && matches!(iter.next(), Some("d" | "D")) || matches!(iter.next(), Some("d" | "D"));

    let cm: Arc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        Arc::new(FileName::Real(file_name.into())),
        input.to_string(),
    );

    let syntax = if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_jsx,
            dts: is_d_ts,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            ..Default::default()
        })
    };
    let target = EsVersion::latest();

    let lexer = Capturing::new(Lexer::new(syntax, target, StringInput::from(&*fm), None));

    let mut parser = Parser::new_from(lexer);

    let program = if is_esm {
        parser.parse_module().map(Program::Module)
    } else if is_cjs {
        parser.parse_commonjs().map(Program::Script)
    } else {
        parser.parse_program()
    };

    let mut ast = try_with_handler(
        cm,
        HandlerOpts {
            color: ColorConfig::Never,
            ..Default::default()
        },
        |handler| {
            for err in parser.take_errors() {
                err.into_diagnostic(handler).emit();
            }

            program.map_err(|err| {
                err.into_diagnostic(handler).emit();
                anyhow::anyhow!("Failed to parse the input")
            })
        },
    )
    .map_err(|err| err.to_pretty_string())?;

    let tokens = parser.input_mut().iter_mut().take();

    GLOBALS.set(&Globals::default(), || {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        ast.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, is_ts));

        Ok(vec![format!("{ast:#?}"), format!("{tokens:#?}")])
    })
}

#[wasm_bindgen]
pub fn version() -> String {
    swc_core::SWC_CORE_VERSION.into()
}
