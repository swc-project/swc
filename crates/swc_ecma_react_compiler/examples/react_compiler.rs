//! Run React Compiler against a single JavaScript/TypeScript file.
//!
//! Usage:
//!
//! ```sh
//! cargo run -p swc_ecma_react_compiler --example react_compiler -- path/to/file.tsx
//! ```

use std::{env, path::Path};

use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter, Node};
use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use swc_ecma_react_compiler::{
    default_plugin_options,
    diagnostics::{DiagnosticMessage, Severity},
    transform, SourceType,
};

fn main() {
    if let Err(err) = run() {
        eprintln!("{err}");
        std::process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let path = env::args()
        .nth(1)
        .ok_or_else(|| "usage: react_compiler <path-to-js-or-ts-file>".to_string())?;
    let path = Path::new(&path);
    let source_text = std::fs::read_to_string(path)
        .map_err(|err| format!("failed to read {}: {err}", path.display()))?;

    let (program, comments, source_type) = parse_program(path, &source_text)?;
    let mut options = default_plugin_options();
    options.filename = Some(path.display().to_string());

    let result = transform(
        &program,
        source_type,
        &source_text,
        Some(&comments),
        options,
    );
    emit_diagnostics(&result.diagnostics);

    let output = emit_program(result.program.as_ref().unwrap_or(&program))?;
    print!("{output}");

    Ok(())
}

fn parse_program(
    path: &Path,
    source_text: &str,
) -> Result<(Program, SingleThreadedComments, SourceType), String> {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(
        Lrc::new(FileName::Real(path.to_path_buf())),
        source_text.to_string(),
    );
    let comments = SingleThreadedComments::default();
    let mut errors = Vec::new();
    let syntax = syntax_for_path(path);
    let is_typescript = syntax.typescript();
    let program = parse_file_as_program(
        &fm,
        syntax,
        EsVersion::latest(),
        Some(&comments),
        &mut errors,
    );

    if !errors.is_empty() {
        let mut message = String::from("failed to parse input:");
        for error in errors {
            message.push('\n');
            message.push_str(&error.kind().msg());
        }
        return Err(message);
    }

    let program =
        program.map_err(|error| format!("failed to parse input: {}", error.kind().msg()))?;
    let source_type = SourceType::from_program(&program).with_typescript(is_typescript);
    Ok((program, comments, source_type))
}

fn syntax_for_path(path: &Path) -> Syntax {
    match path.extension().and_then(|extension| extension.to_str()) {
        Some("ts" | "mts" | "cts") => Syntax::Typescript(TsSyntax {
            tsx: false,
            ..Default::default()
        }),
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
    }
}

fn emit_program(program: &Program) -> Result<String, String> {
    let cm = Lrc::new(SourceMap::default());
    let mut buf = Vec::new();
    {
        let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default(),
            cm,
            comments: None,
            wr: Box::new(wr),
        };

        program
            .emit_with(&mut emitter)
            .map_err(|err| format!("failed to emit output: {err:?}"))?;
    }

    String::from_utf8(buf).map_err(|err| format!("emitted output is not valid UTF-8: {err}"))
}

fn emit_diagnostics(diagnostics: &[DiagnosticMessage]) {
    for diagnostic in diagnostics {
        let severity = match diagnostic.severity {
            Severity::Error => "error",
            Severity::Warning => "warning",
        };
        eprintln!("{severity}: {}", diagnostic.message);
    }
}
