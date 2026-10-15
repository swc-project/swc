use std::path::PathBuf;

use swc_common::{pass::Optional, Mark};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::{exec_tr, test_fixture};
use swc_ecma_transforms_typescript::{typescript, Config};
use swc_ecma_utils::DropSpan;

fn syntax() -> Syntax {
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    })
}

// Exercise the standalone TypeScript pass while decorators still exist in the
// AST.
fn pipeline(drop_spans: bool) -> impl swc_ecma_ast::Pass {
    let unresolved = Mark::new();
    let top_level = Mark::new();
    (
        resolver(unresolved, top_level, true),
        Optional::new(DropSpan, drop_spans),
        typescript(
            Config {
                no_empty_export: true,
                ..Default::default()
            },
            unresolved,
            top_level,
        ),
        decorators(decorators::Config {
            legacy: true,
            ..Default::default()
        }),
    )
}

#[testing::fixture("tests/decorators/enum-availability/**/input.ts")]
fn snapshot(input: PathBuf) {
    test_fixture(
        syntax(),
        &|_| pipeline(false),
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}

#[testing::fixture("tests/decorators/enum-availability/**/exec.ts")]
fn runtime(input: PathBuf) {
    execute(input, false);
}

#[testing::fixture("tests/decorators/enum-availability/**/exec.ts")]
fn runtime_without_spans(input: PathBuf) {
    execute(input, true);
}

fn execute(input: PathBuf, drop_spans: bool) {
    let source = std::fs::read_to_string(input).unwrap();
    exec_tr(
        "enum_decorator_availability",
        syntax(),
        |_| pipeline(drop_spans),
        &source,
    );
}
