use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments, source_map::DefaultSourceMapGenConfig, sync::Lrc, BytePos,
    FileName, LineCol, SourceMap,
};
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

fn read_syntax(input: &Path) -> Syntax {
    let parser_json = match input
        .parent()
        .and_then(|d| d.parent())
        .map(|p| p.join("parser.json"))
    {
        Some(p) if p.exists() => p,
        _ => return syntax_for_path(input),
    };

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

fn emit_program(
    program: &Program,
    cm: Lrc<SourceMap>,
    mappings: Option<&mut Vec<(BytePos, LineCol)>>,
) -> String {
    let mut buf = Vec::new();
    {
        let wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, mappings)) as Box<dyn WriteJs>;
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

fn run_compile_pass(input: PathBuf) {
    let output = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
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
        let code = emit_program(&transformed, cm, None);

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

fn position_of(text: &str, needle: &str) -> LineCol {
    let offset = text
        .find(needle)
        .unwrap_or_else(|| panic!("failed to find `{needle}`"));
    let prefix = &text[..offset];
    LineCol {
        line: prefix.bytes().filter(|byte| *byte == b'\n').count() as u32,
        col: prefix
            .rsplit_once('\n')
            .map_or(prefix, |(_, line)| line)
            .encode_utf16()
            .count() as u32,
    }
}

fn run_source_map(input: PathBuf) {
    run_test2(false, |cm, _| {
        let source = read_to_string(&input)
            .unwrap_or_else(|err| panic!("failed to read {}: {err}", input.display()));
        cm.new_source_file(
            Lrc::new(FileName::Custom("preloaded.js".into())),
            " ".repeat(source.len() + 1),
        );
        let transformed = transform_fixture(&input, cm.clone())
            .program
            .expect("React Compiler should transform source-map fixture");
        let mut mappings = Vec::new();
        let code = emit_program(&transformed, cm.clone(), Some(&mut mappings));
        let source_map = cm.build_source_map(&mappings, None, DefaultSourceMapGenConfig);

        for needle in ["Promise.resolve", "setValue(next)", "Count:"] {
            let original = position_of(&source, needle);
            let generated = position_of(&code, needle);
            let token = source_map
                .lookup_token(generated.line, generated.col)
                .unwrap_or_else(|| panic!("missing source-map entry for `{needle}`"));

            assert_eq!(
                token.get_dst_line(),
                generated.line,
                "wrong generated line for `{needle}`"
            );
            assert_eq!(
                token.get_source().map(|source| &**source),
                Some(input.to_string_lossy().as_ref()),
                "wrong source file for `{needle}`"
            );
            assert_eq!(
                token.get_src_line(),
                original.line,
                "wrong original line for `{needle}`"
            );
        }

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/compile-pass/**/input/*")]
fn compile_pass(input: PathBuf) {
    run_compile_pass(input);
}

#[testing::fixture("tests/fixture/build-pass/*")]
fn build_pass(input: PathBuf) {
    run_build_pass(input);
}

#[testing::fixture("tests/fixture/source-map/**/input.*")]
fn source_map(input: PathBuf) {
    run_source_map(input);
}
