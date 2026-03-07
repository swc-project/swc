#![allow(dead_code)]

use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax};
use swc_es_semantics::{analyze_program, CfgEdgeKind, CfgRoot, Semantics};
use testing::NormalizedOutput;
use walkdir::WalkDir;

pub fn analyze_fixture(path: &Path) -> Semantics {
    let cm = SourceMap::default();
    let source = fs::read_to_string(path)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", path.display()));
    let fm = cm.new_source_file(FileName::Real(path.to_path_buf()).into(), source);

    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let parsed = parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax {
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        Some(&comments),
        &mut recovered,
    )
    .unwrap_or_else(|err| panic!("failed to parse fixture {}: {err:?}", path.display()));

    assert!(
        recovered.is_empty(),
        "fixture {} has parser errors: {:?}",
        path.display(),
        recovered
    );

    analyze_program(&parsed.store, parsed.program)
}

pub fn fixture_inputs(group: &str) -> Vec<PathBuf> {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures")
        .join(group);

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

pub fn root_to_string(root: CfgRoot) -> &'static str {
    match root {
        CfgRoot::Program(_) => "Program",
        CfgRoot::Function(_) => "Function",
        CfgRoot::Arrow(_) => "Arrow",
        CfgRoot::ClassStaticBlock(_) => "ClassStaticBlock",
    }
}

pub fn edge_kind_to_string(kind: CfgEdgeKind) -> &'static str {
    match kind {
        CfgEdgeKind::Normal => "Normal",
        CfgEdgeKind::True => "True",
        CfgEdgeKind::False => "False",
        CfgEdgeKind::Return => "Return",
        CfgEdgeKind::Throw => "Throw",
        CfgEdgeKind::Break => "Break",
        CfgEdgeKind::Continue => "Continue",
    }
}

pub fn assert_snapshot(path: &Path, content: String) {
    let mut content = content;
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
