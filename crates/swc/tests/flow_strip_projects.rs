#![cfg(feature = "flow")]

mod flow_strip;

use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc::Compiler;
use swc_ecma_parser::FlowSyntax;
use testing::Tester;

#[derive(Debug, Deserialize)]
struct ProjectMetadata {
    name: String,
    corpus: String,
    manifest: String,
    parser: ProjectParserOptions,
    counts: ProjectCounts,
}

#[derive(Debug, Deserialize)]
struct ProjectParserOptions {
    jsx: bool,
    require_directive: bool,
    enums: bool,
    decorators: bool,
    components: bool,
    pattern_matching: bool,
}

#[derive(Debug, Deserialize)]
struct ProjectCounts {
    files: usize,
}

impl ProjectParserOptions {
    fn flow_syntax(&self) -> FlowSyntax {
        FlowSyntax {
            jsx: self.jsx,
            all: false,
            require_directive: self.require_directive,
            enums: self.enums,
            decorators: self.decorators,
            components: self.components,
            pattern_matching: self.pattern_matching,
        }
    }
}

fn fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/flow-projects")
}

fn project_roots() -> Vec<PathBuf> {
    let mut roots = fs::read_dir(fixture_root())
        .unwrap_or_else(|err| panic!("failed to read flow project fixtures: {err}"))
        .map(|entry| entry.unwrap().path())
        .filter(|path| path.is_dir())
        .collect::<Vec<_>>();
    roots.sort();
    roots
}

fn read_metadata(project_root: &Path) -> ProjectMetadata {
    let path = project_root.join("metadata.json");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
    serde_json::from_str(&content)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", path.display()))
}

fn read_manifest(project_root: &Path, metadata: &ProjectMetadata) -> Vec<String> {
    let path = project_root.join(&metadata.manifest);
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut files = Vec::new();
    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }
        files.push(line.to_string());
    }

    files
}

#[test]
fn flow_strip_projects() {
    let project_roots = project_roots();
    assert!(
        !project_roots.is_empty(),
        "expected at least one flow project corpus under {}",
        fixture_root().display()
    );

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());

            for project_root in &project_roots {
                let metadata = read_metadata(project_root);
                let manifest = read_manifest(project_root, &metadata);

                assert_eq!(
                    manifest.len(),
                    metadata.counts.files,
                    "manifest count mismatch for {}",
                    metadata.name
                );

                for rel in manifest {
                    let file_path = project_root.join(&metadata.corpus).join(&rel);
                    assert!(
                        file_path.exists(),
                        "missing corpus file: {}",
                        file_path.display()
                    );

                    let label = format!("{}:{rel}", metadata.name);
                    flow_strip::compile_and_reparse_flow_file(
                        &compiler,
                        cm.clone(),
                        &handler,
                        &file_path,
                        &label,
                        metadata.parser.flow_syntax(),
                    )?;
                }
            }

            Ok(())
        })
        .unwrap();
}
