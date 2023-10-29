#![allow(unused)]

use std::{
    path::{Path, PathBuf},
    rc::Rc,
};

use serde::Deserialize;
use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_transforms_testing::{
    babel_like::{BabelLikeFixtureTest, PassContext},
    test_fixture, FixtureTestConfig,
};
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsConfig {
        decorators: true,
        auto_accessors: true,
        allow_super_outside_method: true,
        decorators_before_export: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/decorators/**/exec.js")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
    BabelLikeFixtureTest::new(&input)
        .syntax(Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }))
        .add_factory(|| {
            let static_block_mark = Mark::new();

            Box::new(move |c, name, opts| create_pass(c, name, opts, static_block_mark))
        })
        .execute();
}

#[testing::fixture("tests/decorators/**/input.js")]
#[testing::fixture("tests/decorators/**/input.mjs")]
fn fixture(input: PathBuf) {
    fixture_inner(input)
}

fn fixture_inner(input: PathBuf) {
    let src = std::fs::read_to_string(&input).unwrap();

    let output = input.with_file_name(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    BabelLikeFixtureTest::new(&input)
        .syntax(Syntax::Es(EsConfig {
            decorators: true,
            auto_accessors: true,
            allow_super_outside_method: true,
            decorators_before_export: true,
            ..Default::default()
        }))
        .add_factory(|| {
            let static_block_mark = Mark::new();

            Box::new(move |c, name, opts| create_pass(c, name, opts, static_block_mark))
        })
        .allow_error()
        .fixture(&output);
}

fn create_pass(
    c: &PassContext,
    name: &str,
    options: Option<serde_json::Value>,
    static_block_mark: Mark,
) -> Option<Box<dyn Fold>> {
    match name {
        "proposal-decorators" => Some(Box::new(decorator_2022_03())),

        "proposal-class-properties" => Some(Box::new(chain!(
            swc_ecma_transforms_compat::es2022::static_blocks(static_block_mark),
            swc_ecma_transforms_compat::es2022::class_properties(
                Some(c.comments.clone()),
                Default::default()
            )
        ))),

        "proposal-private-methods" => Some(Box::new(
            swc_ecma_transforms_compat::es2022::class_properties(
                Some(c.comments.clone()),
                Default::default(),
            ),
        )),

        "proposal-class-static-block" => Some(Box::new(
            swc_ecma_transforms_compat::es2022::static_blocks(static_block_mark),
        )),
        _ => None,
    }
}
