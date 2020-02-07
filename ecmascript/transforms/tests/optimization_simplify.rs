#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_transforms::{optimization::simplifier, resolver};

#[macro_use]
mod common;

macro_rules! to {
    ($name:ident, $src:expr, $expected:expr) => {
        test!(
            Default::default(),
            |_| chain!(resolver(), simplifier()),
            $name,
            $src,
            $expected
        );
    };
}

macro_rules! removed {
    ($name:ident, $src:expr) => {
        to!($name, $src, "");
    };
}

removed!(
    single_pass,
    "
const a = 1;

if (a) {
    const b = 2;
}
"
);
