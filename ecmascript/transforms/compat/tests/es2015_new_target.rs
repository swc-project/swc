use std::{fs::read_to_string, path::PathBuf};
use swc_ecma_transforms_compat::es2015::new_target::new_target;
use swc_ecma_transforms_testing::{compare_stdout, test_fixture};

#[testing::fixture("tests/fixture/new-target/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(&input).unwrap();
    compare_stdout(Default::default(), |_| new_target(), &input);
}

#[testing::fixture("tests/fixture/new-target/**/input.js")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join("ouput.js");
    test_fixture(Default::default(), &|_| new_target(), &input, &output);
}
