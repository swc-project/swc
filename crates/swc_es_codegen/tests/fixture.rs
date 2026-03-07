use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_codegen::{to_code, Config};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use testing::NormalizedOutput;
use walkdir::WalkDir;

fn syntax_for_file(path: &Path) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    match ext {
        "ts" => Syntax::Typescript(TsSyntax {
            decorators: true,
            ..Default::default()
        }),
        "tsx" => Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            ..Default::default()
        }),
        "jsx" => Syntax::Es(EsSyntax {
            jsx: true,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
    }
}

fn parse_source(src: &str, syntax: Syntax, file_name: &str) -> swc_es_parser::ParsedProgram {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom(file_name.into()).into(), src.to_string());
    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
        .unwrap_or_else(|err| panic!("failed to parse {file_name}: {err:?}"));

    assert!(
        recovered.is_empty(),
        "expected no recovered errors for {file_name}, got: {recovered:?}"
    );

    parsed
}

fn parse_fixture(path: &Path) -> swc_es_parser::ParsedProgram {
    let src = fs::read_to_string(path)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", path.display()));
    let syntax = syntax_for_file(path);
    parse_source(&src, syntax, &path.display().to_string())
}

fn ensure_snapshot(path: &Path, actual: &str) {
    NormalizedOutput::from(actual.to_string())
        .compare_to_file(path)
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", path.display()));
}

fn assert_idempotent(code: &str, syntax: Syntax, minify: bool, label: &str) {
    let parsed = parse_source(code, syntax, label);
    let emitted = to_code(&parsed.store, parsed.program, Config { minify });

    assert_eq!(
        code, emitted,
        "idempotence failed ({label}, minify={minify})"
    );
}

fn run_fixture(path: &Path) {
    let parsed = parse_fixture(path);

    let pretty = to_code(&parsed.store, parsed.program, Config { minify: false });
    let minified = to_code(&parsed.store, parsed.program, Config { minify: true });

    let ext = path
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or_else(|| panic!("fixture has no extension: {}", path.display()));
    let dir = path
        .parent()
        .unwrap_or_else(|| panic!("fixture has no parent: {}", path.display()));

    let pretty_path = dir.join(format!("output.{ext}"));
    let minified_path = dir.join(format!("output.min.{ext}"));

    ensure_snapshot(&pretty_path, &pretty);
    ensure_snapshot(&minified_path, &minified);

    let syntax = syntax_for_file(path);
    assert_idempotent(
        &pretty,
        syntax,
        false,
        &format!("{}:pretty", path.display()),
    );
    assert_idempotent(
        &minified,
        syntax_for_file(path),
        true,
        &format!("{}:min", path.display()),
    );
}

#[test]
fn fixture_snapshots() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixture");
    let mut inputs = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        if path.file_name().and_then(|name| name.to_str()) != Some("input.js")
            && path.file_name().and_then(|name| name.to_str()) != Some("input.jsx")
            && path.file_name().and_then(|name| name.to_str()) != Some("input.ts")
            && path.file_name().and_then(|name| name.to_str()) != Some("input.tsx")
        {
            continue;
        }

        inputs.push(path.to_path_buf());
    }

    inputs.sort();

    assert!(
        !inputs.is_empty(),
        "no fixtures found under {}",
        root.display()
    );

    for input in inputs {
        run_fixture(&input);
    }
}
