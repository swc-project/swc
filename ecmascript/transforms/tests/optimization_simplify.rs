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
            |_| chain!(resolver(), simplifier(Default::default())),
            $name,
            $src,
            $expected
        );
    };
}

macro_rules! optimized_out {
    ($name:ident, $src:expr) => {
        to!($name, $src, "");
    };
}

optimized_out!(
    single_pass,
    "
const a = 1;

if (a) {
    const b = 2;
}
"
);

optimized_out!(issue_607, "let a");

to!(
    multi_run,
    "
let b = 2;

let a = 1;
if (b) { // Removed by first run of remove_dead_branch
    a = 2; // It becomes `flat assignment` to a on second run of inlining
}

let c;
if (a) { // Removed by second run of remove_dead_branch
    c = 3; // It becomes `flat assignment` to c on third run of inlining.
}
console.log(c); // Prevent optimizing out.
",
    "console.log(3)"
);
