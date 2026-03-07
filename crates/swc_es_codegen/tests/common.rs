use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_codegen::{emit_program, Config};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use testing::NormalizedOutput;
use walkdir::WalkDir;

#[derive(Debug)]
pub struct Generated {
    pub pretty: String,
    pub minified: String,
}

pub fn fixture_inputs() -> Vec<PathBuf> {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");

    let mut files: Vec<PathBuf> = WalkDir::new(&root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .filter(|entry| {
            let name = entry.file_name().to_string_lossy();
            name == "input.js"
                || name == "input.mjs"
                || name == "input.ts"
                || name == "input.tsx"
                || name == "input.jsx"
        })
        .map(|entry| entry.path().to_path_buf())
        .collect();

    files.sort();
    files
}

pub fn run_fixture(input: &Path) -> Generated {
    let source = fs::read_to_string(input)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", input.display()));

    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Real(input.to_path_buf()).into(), source);

    let mut recovered = Vec::new();
    let comments = SingleThreadedComments::default();

    let syntax = syntax_for_path(input);
    let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
        .unwrap_or_else(|err| panic!("failed to parse fixture {}: {err:?}", input.display()));

    assert!(
        recovered.is_empty(),
        "fixture {} has parser errors: {:?}",
        input.display(),
        recovered
    );

    let pretty = emit_program(&parsed.store, parsed.program, Config::default())
        .unwrap_or_else(|err| panic!("failed to emit pretty output {}: {err}", input.display()));
    let minified = emit_program(&parsed.store, parsed.program, Config { minify: true })
        .unwrap_or_else(|err| panic!("failed to emit min output {}: {err}", input.display()));

    Generated { pretty, minified }
}

fn syntax_for_path(input: &Path) -> Syntax {
    match input.extension().and_then(|ext| ext.to_str()) {
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
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
    }
}

pub fn assert_snapshot(path: &Path, content: &str) {
    let mut content = content.to_string();
    if !content.ends_with('\n') {
        content.push('\n');
    }

    if std::env::var("UPDATE").is_ok() {
        fs::write(path, content)
            .unwrap_or_else(|err| panic!("failed to update snapshot {}: {err}", path.display()));
        return;
    }

    NormalizedOutput::from(content)
        .compare_to_file(path)
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", path.display()));
}
