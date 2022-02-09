use std::{fs::read_to_string, path::PathBuf};

use swc_ecma_transforms_compat::es2015::new_target::new_target;
use swc_ecma_transforms_testing::{exec_tr, test, test_fixture};

#[testing::fixture("tests/fixture/new-target/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(&input).unwrap();
    exec_tr("new-target", Default::default(), |_| new_target(), &input);
}

#[testing::fixture("tests/fixture/new-target/**/input.js")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join("output.js");
    test_fixture(Default::default(), &|_| new_target(), &input, &output);
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| new_target(),
    edge_12,
    r#"function foo() {
        const a = () => new.target
    }"#,
    r#"function foo() {
        var _newtarget = this instanceof foo ? this.constructor : void 0;
        const a = () => _newtarget
    }"#
);
