#![feature(test)]

extern crate test;

use test::TestDescAndFn;

fn load_fixtures(tests: &mut Vec<TestDescAndFn>) {}

#[test]
fn fixture() {
    let mut tests = vec![];
    load_fixtures(&mut tests);
}
