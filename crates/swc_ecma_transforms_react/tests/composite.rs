#![allow(clippy::arc_with_non_send_sync)]

use std::{fs, path::PathBuf};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{arrow, classes};
#[cfg(feature = "es3")]
use swc_ecma_transforms_compat::es3::property_literals;
use swc_ecma_transforms_react::{
    display_name, jsx, jsx_self, jsx_src, pure_annotations, refresh, Options, RefreshOptions,
    Runtime,
};
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

#[testing::fixture("tests/composite/jsx/**/input.js")]
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

#[testing::fixture("tests/composite/jsx-self/**/input.js")]
fn jsx_self_fixture(input: PathBuf) {
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let with_arrow = input.parent().unwrap().parent().unwrap().ends_with("arrow");
            (
                with_arrow.then(|| resolver(unresolved, top_level, false)),
                jsx_self(true),
                with_arrow.then(|| arrow(unresolved)),
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

#[testing::fixture("tests/composite/refresh/**/input.js")]
fn refresh_fixture(input: PathBuf) {
    let group = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .file_name()
        .unwrap()
        .to_str()
        .unwrap();
    let syntax = if group.starts_with("typescript") {
        Syntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: true,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        })
    };
    test_fixture(
        syntax,
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let options = if group == "custom-identifier" {
                RefreshOptions {
                    refresh_reg: "import_meta_refreshReg".into(),
                    refresh_sig: "import_meta_refreshSig".into(),
                    emit_full_signatures: true,
                }
            } else {
                RefreshOptions {
                    emit_full_signatures: true,
                    ..Default::default()
                }
            };
            (
                resolver(unresolved, top_level, false),
                refresh(
                    true,
                    Some(options),
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    top_level,
                ),
                (group == "typescript-jsx").then(|| {
                    jsx(
                        t.cm.clone(),
                        Some(t.comments.clone()),
                        Default::default(),
                        top_level,
                        unresolved,
                    )
                }),
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

#[testing::fixture("tests/composite/jsx-transform/classic/**/input.js")]
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

#[testing::fixture("tests/composite/jsx-transform/regression/**/input.js")]
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
#[testing::fixture("tests/composite/jsx-transform/es3/**/input.js")]
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

#[testing::fixture("tests/composite/jsx-source/exec/**/input.js")]
fn jsx_source_exec(input: PathBuf) {
    swc_ecma_transforms_testing::exec_tr(
        "jsx_source",
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        |_| {
            jsx_src(
                true,
                swc_common::sync::Lrc::new(swc_common::SourceMap::new(
                    swc_common::FilePathMapping::empty(),
                )),
            )
        },
        &fs::read_to_string(input).unwrap(),
    );
}
