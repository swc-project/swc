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
use swc_ecma_utils::stack_size::maybe_grow;
use testing::{run_test2, NormalizedOutput};

#[derive(Deserialize)]
#[serde(untagged)]
enum ParserConfig {
    Syntax(Syntax),
    Parser { parser: Syntax },
}

#[derive(Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "lowercase")]
enum CompilationMode {
    #[default]
    Infer,
    Annotation,
    All,
    Syntax,
}

impl CompilationMode {
    fn as_str(self) -> &'static str {
        match self {
            Self::Infer => "infer",
            Self::Annotation => "annotation",
            Self::All => "all",
            Self::Syntax => "syntax",
        }
    }
}

#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct CompilerConfig {
    compilation_mode: CompilationMode,
}

fn read_compilation_mode(input: &Path) -> CompilationMode {
    let options_json = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("options.json");
    if !options_json.exists() {
        return CompilationMode::Infer;
    }
    let json = read_to_string(&options_json).unwrap();
    serde_json::from_str::<CompilerConfig>(&json)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", options_json.display()))
        .compilation_mode
}

/// Reproduce the stack budget of native bundler workers independently of
/// RUST_MIN_STACK. Construct and drop each fixture's ASTs on the same thread.
fn run_on_worker_stack(test: impl FnOnce() + Send + 'static) {
    std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(test)
        .expect("spawn fixture worker")
        .join()
        .expect("fixture worker panicked");
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

fn transform_fixture(
    input: &Path,
    cm: Lrc<SourceMap>,
    compilation_mode: CompilationMode,
) -> TransformResult {
    let source_text = read_to_string(input)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", input.display()));
    let (program, comments, source_type) = parse_program(input, cm);
    let mut options = default_plugin_options();
    options.filename = Some(input.display().to_string());
    options.compilation_mode = compilation_mode.as_str().into();

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
        let result = transform_fixture(&input, cm.clone(), read_compilation_mode(&input));
        assert!(result.diagnostics.is_empty(), "{:#?}", result.diagnostics);
        let transformed = result.program.unwrap_or_else(|| {
            panic!(
                "React Compiler did not return a transformed program for {}\ndiagnostics:\n{:#?}",
                input.display(),
                result.diagnostics
            )
        });
        // Snapshot generation recursively emits the original call chain, even
        // after successful compilation. Only emission gets a larger stack;
        // parsing and transformation above still run on the 2 MiB worker.
        let code = maybe_grow(64 * 1024 * 1024, 64 * 1024 * 1024, || {
            emit_program(&transformed, cm)
        });

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
        // Always exercise conversion even when a fixture has no React patterns.
        drop(transform_fixture(&input, cm, CompilationMode::All));
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/compile-pass/**/input/*")]
fn compile_pass(input: PathBuf) {
    run_on_worker_stack(move || run_compile_pass(input));
}

#[testing::fixture("tests/fixture/build-pass/*")]
fn build_pass(input: PathBuf) {
    run_on_worker_stack(move || run_build_pass(input));
}

#[testing::fixture("tests/fixture/skip-pass/*")]
fn skip_pass(input: PathBuf) {
    run_on_worker_stack(move || {
        for mode in [CompilationMode::Infer, CompilationMode::Annotation] {
            run_test2(false, |cm, _| {
                let result = transform_fixture(&input, cm, mode);
                assert!(result.program.is_none());
                assert!(result.diagnostics.is_empty());
                assert!(result.events.is_empty());
                Ok(())
            })
            .unwrap();
        }
    });
}
