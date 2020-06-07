#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_transforms::{optimization::simplifier, resolver};

#[macro_use]
mod common;

fn test(src: &str, expected: &str) {
    test_transform!(
        ::swc_ecma_parser::Syntax::default(),
        |_| chain!(resolver(), simplifier(Default::default())),
        src,
        expected,
        true
    )
}

fn test_same(src: &str) {
    test(src, src)
}

macro_rules! to {
    ($name:ident, $src:expr, $expected:expr) => {
        test!(
            Default::default(),
            |_| chain!(resolver(), simplifier(Default::default())),
            $name,
            $src,
            $expected
        );
    };
}

#[test]
fn simple() {
    test("{ let abc = 1;}", "{ let a = 1; }");
}
