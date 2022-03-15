use std::path::PathBuf;

use swc_common::{chain, pass::Repeat};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::fixer::paren_remover;
use swc_ecma_transforms_optimization::simplify::{dce::dce, expr_simplifier};
use swc_ecma_transforms_testing::{test_fixture, Tester};
use swc_ecma_visit::{as_folder, Fold, VisitMut};

fn remover(t: &Tester) -> impl VisitMut + Fold {
    as_folder(paren_remover(Some(
        Box::leak(Box::new(t.comments.clone())) as _
    )))
}

#[testing::fixture("tests/dce/**/input.js")]
fn dce_single_pass(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            decorators: true,
            ..Default::default()
        }),
        &|t| chain!(remover(t), dce(Default::default())),
        &input,
        &output,
    );
}

#[testing::fixture("tests/dce/**/input.js")]
fn dce_repeated(input: PathBuf) {
    let output = input.with_file_name("output.full.js");

    test_fixture(
        Syntax::Es(EsConfig {
            decorators: true,
            ..Default::default()
        }),
        &|t| chain!(remover(t), Repeat::new(dce(Default::default()))),
        &input,
        &output,
    );
}

#[testing::fixture("tests/expr-simplifier/**/input.js")]
fn expr(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            ..Default::default()
        }),
        &|t| chain!(remover(t), Repeat::new(expr_simplifier(Default::default()))),
        &input,
        &output,
    );
}
