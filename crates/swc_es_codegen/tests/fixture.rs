use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName};
use swc_es_codegen::emit_program;
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use testing::NormalizedOutput;

fn syntax_for_path(path: &Path) -> Syntax {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("ts") => Syntax::Typescript(TsSyntax {
            decorators: true,
            ..Default::default()
        }),
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            ..Default::default()
        }),
        Some("jsx") => Syntax::Es(EsSyntax {
            jsx: true,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            jsx: true,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
    }
}

fn expected_output_path(input: &Path) -> PathBuf {
    let ext = input
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("js");
    input.with_file_name(format!("output.{ext}"))
}

fn compare_or_update(path: &Path, mut content: String) {
    if !content.ends_with('\n') {
        content.push('\n');
    }

    if std::env::var("UPDATE").is_ok() {
        fs::write(path, &content)
            .unwrap_or_else(|err| panic!("failed to update snapshot {}: {err}", path.display()));
        return;
    }

    NormalizedOutput::from(content)
        .compare_to_file(path)
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", path.display()));
}

fn run_fixture(path: PathBuf) {
    let syntax = syntax_for_path(&path);

    testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(&path)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

        let comments = SingleThreadedComments::default();
        let mut recovered = Vec::new();
        let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
            .unwrap_or_else(|err| panic!("failed to parse fixture {}: {err:?}", path.display()));

        for error in recovered {
            error.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let emitted = emit_program(&parsed.store, parsed.program)
            .unwrap_or_else(|err| panic!("failed to emit fixture {}: {err}", path.display()));

        let output = expected_output_path(&path);
        compare_or_update(&output, emitted.clone());

        let roundtrip_fm = cm.new_source_file(
            FileName::Custom("roundtrip.js".into()).into(),
            emitted.clone(),
        );
        let mut roundtrip_recovered = Vec::new();
        let roundtrip_parsed = parse_file_as_program(
            &roundtrip_fm,
            syntax,
            Some(&comments),
            &mut roundtrip_recovered,
        )
        .unwrap_or_else(|err| panic!("failed to parse emitted output {}: {err:?}", path.display()));

        for error in roundtrip_recovered {
            error.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let emitted_again = emit_program(&roundtrip_parsed.store, roundtrip_parsed.program)
            .unwrap_or_else(|err| panic!("failed to re-emit fixture {}: {err}", path.display()));

        assert_eq!(
            emitted,
            emitted_again,
            "emit -> parse -> emit should be idempotent for {}",
            path.display()
        );

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.js")]
fn fixture_js(path: PathBuf) {
    run_fixture(path);
}

#[testing::fixture("tests/fixture/**/input.jsx")]
fn fixture_jsx(path: PathBuf) {
    run_fixture(path);
}

#[testing::fixture("tests/fixture/**/input.ts")]
fn fixture_ts(path: PathBuf) {
    run_fixture(path);
}

#[testing::fixture("tests/fixture/**/input.tsx")]
fn fixture_tsx(path: PathBuf) {
    run_fixture(path);
}
