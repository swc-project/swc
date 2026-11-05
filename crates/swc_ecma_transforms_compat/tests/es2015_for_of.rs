mod common;

use std::{fs::read_to_string, path::PathBuf};

use swc_common::{comments::NoopComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{
    self,
    for_of::{for_of, Config},
};
use swc_ecma_transforms_testing::{compare_stdout, test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

// for_of_as_array_for_of

// for_of_as_array_for_of_array_pattern

// regression_redeclare_array_8913

// for_of_as_array_for_of_declaration_array_pattern

// for_of_as_array_for_of_declaration

// regression_scope_9696
test_exec!(
    syntax(),
    |_| for_of(Default::default()),
    regression_scope_9696_exec,
    r#"
var arr = [1, 2, 3];
var results = [];

for (let v of arr) {
  results.push(v);
  arr = null;
}

expect(results).toEqual([1, 2, 3]);

"#
);

// for_of_as_array_for_of_static_declaration

// for_of_as_array_for_of_static

// for_of_as_array_for_of_import_es2015

// regression_label_object_with_comment_4995

// regression_if_label_3858

#[testing::fixture("tests/for-of/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let top_level_mark = Mark::new();

            (
                resolver(Mark::new(), top_level_mark, false),
                for_of(Config {
                    assume_array: false,
                    ..Default::default()
                }),
            )
        },
        &input,
    );
}

#[testing::fixture("tests/for-of/issue-12433/modes/input.js")]
fn fixture_modes(input: PathBuf) {
    for (config, output) in [
        (
            Config {
                loose: true,
                ..Default::default()
            },
            "output.loose.js",
        ),
        (
            Config {
                assume_array: true,
                ..Default::default()
            },
            "output.array.js",
        ),
    ] {
        test_fixture(
            Syntax::default(),
            &|_| (resolver(Mark::new(), Mark::new(), false), for_of(config)),
            &input,
            &input.with_file_name(output),
            Default::default(),
        );
    }
}

#[testing::fixture("tests/for-of/issue-12433/modes/exec.js")]
fn exec_modes(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    for config in [
        Config {
            loose: true,
            ..Default::default()
        },
        Config {
            assume_array: true,
            ..Default::default()
        },
    ] {
        compare_stdout(
            Syntax::default(),
            |_| (resolver(Mark::new(), Mark::new(), false), for_of(config)),
            &input,
        );
    }
}

#[testing::fixture("tests/for-of/**/exec.js")]
fn exec_es2015(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                es2015::es2015(unresolved_mark, Some(NoopComments), Default::default()),
            )
        },
        &input,
    );
}

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "for-of-assume-array")]
    ForOfAssumeArray,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/for-of/for-of-assume-array/**/input.js")]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ForOfAssumeArray => Box::new(for_of(Config {
                    assume_array: true,
                    ..Default::default()
                })),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
