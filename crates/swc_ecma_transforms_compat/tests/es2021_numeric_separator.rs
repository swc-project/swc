use std::{fs::read_to_string, path::PathBuf};

use swc_ecma_transforms_compat::es2021;
use swc_ecma_transforms_testing::{exec_tr, test_fixture};
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    es2021::numeric_separator()
}

#[testing::fixture("tests/numeric-separator/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(&input).unwrap();
    exec_tr("numeric-separator", Default::default(), |_| tr(), &input);
}

#[testing::fixture("tests/numeric-separator/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(Default::default(), &|_| tr(), &input, &output);
}
