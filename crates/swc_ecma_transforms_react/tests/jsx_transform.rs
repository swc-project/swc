use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{arrow, classes};
#[cfg(feature = "es3")]
use swc_ecma_transforms_compat::es3::property_literals;
use swc_ecma_transforms_react::{display_name, jsx, Options};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

#[testing::fixture("tests/jsx-transform/classic/**/input.js")]
fn classic_jsx_fixture(input: PathBuf) {
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, false),
                jsx(
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    Options::default(),
                    top_level,
                    unresolved,
                ),
                display_name(),
                classes(Default::default()),
                arrow(unresolved),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}

#[testing::fixture("tests/jsx-transform/regression/**/input.js")]
fn jsx_regression_fixture(input: PathBuf) {
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                classes(Default::default()),
                jsx(
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    Default::default(),
                    top_level,
                    unresolved,
                ),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig::default(),
    );
}

#[cfg(feature = "es3")]
#[testing::fixture("tests/jsx-transform/es3/**/input.js")]
fn jsx_es3_fixture(input: PathBuf) {
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, false),
                jsx(
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    Default::default(),
                    top_level,
                    unresolved,
                ),
                display_name(),
                classes(Default::default()),
                arrow(unresolved),
                property_literals(),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
