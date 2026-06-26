use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::{
    text_writer::{JsWriter, WriteJs},
    Emitter, Node,
};
use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use swc_ecma_react_compiler::{default_plugin_options, transform, SourceType, TransformResult};
use testing::{run_test2, NormalizedOutput};

#[derive(Deserialize)]
#[serde(untagged)]
enum ParserConfig {
    Syntax(Syntax),
    Parser { parser: Syntax },
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

fn fixture_dir(input: &Path) -> &Path {
    let input_dir = input
        .parent()
        .unwrap_or_else(|| panic!("input fixture has no parent: {}", input.display()));
    assert_eq!(
        input_dir.file_name().and_then(|name| name.to_str()),
        Some("input"),
        "input fixture must live under an input directory: {}",
        input.display()
    );

    input_dir
        .parent()
        .unwrap_or_else(|| panic!("input fixture has no case directory: {}", input.display()))
}

fn read_syntax(input: &Path) -> Syntax {
    let parser_json = fixture_dir(input).join("parser.json");

    if !parser_json.exists() {
        return syntax_for_path(input);
    }

    let json = read_to_string(&parser_json)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", parser_json.display()));

    match serde_json::from_str::<ParserConfig>(&json)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", parser_json.display()))
    {
        ParserConfig::Syntax(syntax) | ParserConfig::Parser { parser: syntax } => syntax,
    }
}

fn parse_program(
    input: &Path,
    cm: Lrc<SourceMap>,
) -> (Program, SingleThreadedComments, SourceType) {
    let fm = cm
        .load_file(input)
        .unwrap_or_else(|err| panic!("failed to load {}: {err}", input.display()));
    let comments = SingleThreadedComments::default();
    let mut errors = Vec::new();
    let syntax = read_syntax(input);
    let is_typescript = syntax.typescript();
    let program = parse_file_as_program(
        &fm,
        syntax,
        EsVersion::latest(),
        Some(&comments),
        &mut errors,
    );

    assert!(
        errors.is_empty(),
        "failed to parse {}:\n{}",
        input.display(),
        errors
            .iter()
            .map(|error| error.kind().msg())
            .collect::<Vec<_>>()
            .join("\n")
    );

    let program = program.unwrap_or_else(|error| {
        panic!(
            "failed to parse {}: {}",
            input.display(),
            error.kind().msg()
        )
    });
    let source_type = SourceType::from_program(&program).with_typescript(is_typescript);

    (program, comments, source_type)
}

fn emit_program(program: &Program, cm: Lrc<SourceMap>) -> String {
    let mut buf = Vec::new();
    {
        let wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default(),
            cm,
            comments: None,
            wr,
        };
        program
            .emit_with(&mut emitter)
            .expect("failed to emit transformed program");
    }

    String::from_utf8(buf).expect("emitted module is not valid UTF-8")
}

fn transform_fixture(input: &Path, cm: Lrc<SourceMap>) -> TransformResult {
    let source_text = read_to_string(input)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", input.display()));
    let (program, comments, source_type) = parse_program(input, cm);
    let mut options = default_plugin_options();
    options.filename = Some(input.display().to_string());

    transform(
        &program,
        source_type,
        &source_text,
        Some(&comments),
        options,
    )
}

fn run_ast_roundtrip(input: PathBuf) {
    let output = fixture_dir(&input)
        .join("output")
        .join(input.file_name().unwrap());

    run_test2(false, |cm, _| {
        let result = transform_fixture(&input, cm.clone());
        let transformed = result.program.unwrap_or_else(|| {
            panic!(
                "React Compiler did not return a transformed program for {}\ndiagnostics:\n{:#?}",
                input.display(),
                result.diagnostics
            )
        });
        let code = emit_program(&transformed, cm);

        NormalizedOutput::from(code)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

/// Build-pass fixtures assert that SWC-to-React-Compiler conversion does not
/// panic, even if the React Compiler later declines to emit a program.
fn run_build_pass(input: PathBuf) {
    run_test2(false, |cm, _| {
        drop(transform_fixture(&input, cm));

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/ast-roundtrip/input/*")]
#[testing::fixture("tests/fixture/cjs/input/*")]
fn ast_roundtrip(input: PathBuf) {
    run_ast_roundtrip(input);
}

#[testing::fixture("tests/fixture/build-pass/input/*")]
fn build_pass(input: PathBuf) {
    run_build_pass(input);
}
