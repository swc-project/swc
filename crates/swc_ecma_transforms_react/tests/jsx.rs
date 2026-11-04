use std::path::PathBuf;

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_react::{display_name, jsx, pure_annotations, Options, Runtime};
use swc_ecma_transforms_testing::{parse_options, test_fixture, FixtureTestConfig, Tester};

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
struct FixtureOptions {
    #[serde(flatten)]
    options: Options,

    #[serde(default, rename = "BABEL_8_BREAKING")]
    babel_8_breaking: bool,

    #[serde(default = "true_by_default")]
    pure: bool,

    #[serde(default)]
    throws: Option<String>,

    #[serde(default, alias = "useBuiltIns")]
    use_builtins: bool,
}

fn true_by_default() -> bool {
    true
}

fn fixture_tr(t: &mut Tester, mut options: FixtureOptions) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    options.options.next = Some(options.babel_8_breaking || options.options.runtime.is_some());

    if !options.babel_8_breaking && options.options.runtime.is_none() {
        options.options.runtime = Some(Runtime::Classic);
    }

    (
        resolver(unresolved_mark, top_level_mark, false),
        jsx(
            t.cm.clone(),
            Some(t.comments.clone()),
            options.options,
            top_level_mark,
            unresolved_mark,
        ),
        display_name(),
        pure_annotations(Some(t.comments.clone())),
    )
}

#[testing::fixture("tests/jsx/**/input.js")]
fn fixture(input: PathBuf) {
    let mut output = input.with_file_name("output.js");
    if !output.exists() {
        output = input.with_file_name("output.mjs");
    }

    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|t| {
            let options = parse_options(input.parent().unwrap());
            fixture_tr(t, options)
        },
        &input,
        &output,
        FixtureTestConfig {
            allow_error: true,
            module: Some(true),
            ..Default::default()
        },
    );
}
