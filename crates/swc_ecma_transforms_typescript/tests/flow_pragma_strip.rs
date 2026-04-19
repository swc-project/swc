use swc_common::{comments::SingleThreadedComments, FileName, Mark};
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::to_code_default;
use swc_ecma_parser::{parse_file_as_program, FlowSyntax, Syntax};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_transforms_typescript::{flow_pragma_strip, typescript};

fn transform(source: &str) -> String {
    ::testing::run_test(false, |cm, handler| -> Result<String, ()> {
        let comments = SingleThreadedComments::default();
        let fm = cm.new_source_file(
            FileName::Custom("flow.js".into()).into(),
            source.to_string(),
        );
        let mut recovered_errors = Vec::new();

        let program = parse_file_as_program(
            &fm,
            Syntax::Flow(FlowSyntax::default()),
            EsVersion::latest(),
            Some(&comments),
            &mut recovered_errors,
        )
        .map_err(|err| err.into_diagnostic(handler).emit())?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let program = program
            .apply(resolver(unresolved_mark, top_level_mark, false))
            .apply(typescript::typescript(
                typescript::Config {
                    flow_syntax: true,
                    ..Default::default()
                },
                unresolved_mark,
                top_level_mark,
            ))
            .apply(flow_pragma_strip(&comments))
            .apply(fixer(Some(&comments)));

        Ok(to_code_default(cm.clone(), Some(&comments), &program))
    })
    .expect("failed to run flow pragma strip test")
}

#[test]
fn strips_line_flow_pragma() {
    let output = transform("// @flow\nconst value: number = 1;\n");
    assert!(
        !output.contains("@flow"),
        "expected @flow pragma to be stripped, got: {output}"
    );
    assert!(output.contains("const value = 1;"));
}

#[test]
fn strips_block_flow_pragma() {
    let output = transform("/* @flow */\nconst value: number = 1;\n");
    assert!(
        !output.contains("@flow"),
        "expected block @flow pragma to be stripped, got: {output}"
    );
}

#[test]
fn strips_jsdoc_flow_pragma() {
    let output = transform("/**\n * @flow\n */\nconst value: number = 1;\n");
    assert!(
        !output.contains("@flow"),
        "expected JSDoc @flow pragma to be stripped, got: {output}"
    );
}

#[test]
fn strips_flow_strict_pragma() {
    let output = transform("// @flow strict\nconst value: number = 1;\n");
    assert!(
        !output.contains("@flow"),
        "expected `@flow strict` pragma to be stripped, got: {output}"
    );
}

#[test]
fn strips_noflow_pragma() {
    let output = transform("// @noflow\nconst value = 1;\n");
    assert!(
        !output.contains("@noflow"),
        "expected @noflow pragma to be stripped, got: {output}"
    );
}

#[test]
fn preserves_unrelated_leading_comment() {
    let output = transform("// Copyright 2026\n// @flow\nconst value: number = 1;\n");
    assert!(
        !output.contains("@flow"),
        "expected @flow pragma to be stripped, got: {output}"
    );
    assert!(
        output.contains("Copyright 2026"),
        "expected unrelated comment to be preserved, got: {output}"
    );
}

#[test]
fn preserves_copyright_banner_alongside_pragma() {
    let source = "/**\n * Copyright 2024 Example Corp\n *\n * @flow\n * @format\n */\nconst \
                  value: number = 1;\n";
    let output = transform(source);
    assert!(
        !output.contains("@flow"),
        "expected @flow pragma to be stripped, got: {output}"
    );
    assert!(
        output.contains("Copyright 2024 Example Corp"),
        "expected copyright banner to be preserved, got: {output}"
    );
    assert!(
        output.contains("@format"),
        "expected unrelated annotation to be preserved, got: {output}"
    );
}

#[test]
fn preserves_lookalike_comment() {
    let output = transform("// see @flowtype documentation\nconst value = 1;\n");
    assert!(
        output.contains("see @flowtype documentation"),
        "expected @flowtype lookalike comment to be preserved, got: {output}"
    );
}

#[test]
fn strips_pragma_under_shebang() {
    let input = "#!/usr/bin/env node\n// @flow\nconst value: number = 1;\n";
    let output = transform(input);
    assert!(
        !output.contains("@flow"),
        "expected @flow pragma to be stripped under a shebang, got: {output}"
    );
}
