#![allow(dead_code)]

use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_codegen::{emit_program, Config};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use swc_es_transforms::{transform_program, TransformOptions, TransformTarget};
use testing::NormalizedOutput;
use walkdir::WalkDir;

#[derive(Debug)]
pub struct FixtureResult {
    pub output: String,
    pub stats: swc_es_transforms::PassStats,
}

pub fn fixture_inputs() -> Vec<PathBuf> {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");

    let mut files: Vec<PathBuf> = WalkDir::new(&root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .filter(|entry| entry.file_name() == "input.js")
        .map(|entry| entry.path().to_path_buf())
        .collect();

    files.sort();
    files
}

pub fn run_fixture(input: &Path) -> FixtureResult {
    let source = fs::read_to_string(input)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", input.display()));

    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Real(input.to_path_buf()).into(), source);

    let mut recovered = Vec::new();
    let comments = SingleThreadedComments::default();

    let parsed =
        parse_file_as_program(&fm, syntax_for_path(input), Some(&comments), &mut recovered)
            .unwrap_or_else(|err| panic!("failed to parse fixture {}: {err:?}", input.display()));

    assert!(
        recovered.is_empty(),
        "fixture {} has parser errors: {:?}",
        input.display(),
        recovered
    );

    let options = read_options(input);

    let mut store = parsed.store;
    let result = transform_program(&mut store, parsed.program, &options);

    let output = emit_program(&store, result.program, Config::default()).unwrap_or_else(|err| {
        panic!(
            "failed to emit transformed output {}: {err}",
            input.display()
        )
    });

    FixtureResult {
        output,
        stats: result.stats,
    }
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

fn read_options(input: &Path) -> TransformOptions {
    let options_path = input.with_file_name("options.json");
    let data = fs::read_to_string(&options_path)
        .unwrap_or_else(|err| panic!("failed to read options {}: {err}", options_path.display()));

    let raw: RawOptions = serde_json::from_str(&data)
        .unwrap_or_else(|err| panic!("invalid options {}: {err}", options_path.display()));

    TransformOptions {
        target: match raw.target.as_deref().unwrap_or("es2022") {
            "es2022" => TransformTarget::Es2022,
            "es2021" => TransformTarget::Es2021,
            "es2020" => TransformTarget::Es2020,
            "es2019" => TransformTarget::Es2019,
            "es2018" => TransformTarget::Es2018,
            other => panic!("unknown target `{other}` in {}", options_path.display()),
        },
        enable_optional_chaining: raw.enable_optional_chaining.unwrap_or(true),
        enable_nullish_coalescing: raw.enable_nullish_coalescing.unwrap_or(true),
        enable_logical_assignment: raw.enable_logical_assignment.unwrap_or(true),
        enable_normalize: raw.enable_normalize.unwrap_or(true),
    }
}

#[derive(Debug, serde::Deserialize)]
struct RawOptions {
    target: Option<String>,
    enable_optional_chaining: Option<bool>,
    enable_nullish_coalescing: Option<bool>,
    enable_logical_assignment: Option<bool>,
    enable_normalize: Option<bool>,
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
