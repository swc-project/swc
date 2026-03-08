#![allow(dead_code)]

use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_atoms::Atom;
use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_codegen::{emit_program, Config};
use swc_es_minifier::{minify_program, CompressOptions, MangleOptions, MinifyOptions};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use testing::NormalizedOutput;
use walkdir::WalkDir;

#[derive(Debug)]
pub struct FixtureResult {
    pub output: String,
    pub stats: swc_es_minifier::PassStats,
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
    let result = minify_program(&mut store, parsed.program, &options);

    let output = emit_program(&store, result.program, Config { minify: true })
        .unwrap_or_else(|err| panic!("failed to emit minified output {}: {err}", input.display()));

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

fn read_options(input: &Path) -> MinifyOptions {
    let options_path = input.with_file_name("options.json");
    let data = fs::read_to_string(&options_path)
        .unwrap_or_else(|err| panic!("failed to read options {}: {err}", options_path.display()));

    let raw: RawOptions = serde_json::from_str(&data)
        .unwrap_or_else(|err| panic!("invalid options {}: {err}", options_path.display()));

    MinifyOptions {
        compress: CompressOptions {
            fold_constants: raw.compress.fold_constants.unwrap_or(true),
            dead_code: raw.compress.dead_code.unwrap_or(true),
            simplify_branches: raw.compress.simplify_branches.unwrap_or(true),
            drop_unused_bindings: raw.compress.drop_unused_bindings.unwrap_or(true),
        },
        mangle: MangleOptions {
            enabled: raw.mangle.enabled.unwrap_or(false),
            top_level: raw.mangle.top_level.unwrap_or(false),
            keep_fn_names: raw.mangle.keep_fn_names.unwrap_or(true),
            keep_class_names: raw.mangle.keep_class_names.unwrap_or(true),
            reserved: raw
                .mangle
                .reserved
                .unwrap_or_default()
                .into_iter()
                .map(Atom::new)
                .collect(),
        },
    }
}

#[derive(Debug, serde::Deserialize, Default)]
struct RawOptions {
    #[serde(default)]
    compress: RawCompressOptions,
    #[serde(default)]
    mangle: RawMangleOptions,
}

#[derive(Debug, serde::Deserialize, Default)]
struct RawCompressOptions {
    fold_constants: Option<bool>,
    dead_code: Option<bool>,
    simplify_branches: Option<bool>,
    drop_unused_bindings: Option<bool>,
}

#[derive(Debug, serde::Deserialize, Default)]
struct RawMangleOptions {
    enabled: Option<bool>,
    top_level: Option<bool>,
    keep_fn_names: Option<bool>,
    keep_class_names: Option<bool>,
    reserved: Option<Vec<String>>,
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
