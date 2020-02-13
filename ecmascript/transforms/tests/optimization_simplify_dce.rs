#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_transforms::{optimization::simplify::dce::dce, resolver};

#[macro_use]
mod common;

macro_rules! to {
    ($name:ident, $src:expr, $expected:expr) => {
        test!(
            Default::default(),
            |_| chain!(resolver(), dce(Default::default())),
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

macro_rules! noop {
    ($name:ident, $src:expr) => {
        to!($name, $src, $src);
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

noop!(
    noop_1,
    "
let b = 2;

let a = 1;
if (b) {
    a = 2;
}

let c;
if (a) {
    c = 3;
}
console.log(c);
"
);

noop!(
    noop_2,
    "
switch (1){
    case 1: 
        a = '1';
}

console.log(a);
"
);

noop!(
    noop_3,
    "
try {
    console.log(foo())
} catch (e) {
    console.error(e);
}"
);

to!(
    custom_loop_2,
    "let b = 2;

let a = 1;
a = 2;

let c;
if (2) c = 3
console.log(c)",
    "let c;
if (2) c = 3;
console.log(c);"
);

optimized_out!(simple_const, "{const x = 1}");

noop!(assign_op, "x *= 2; use(x)");

optimized_out!(import_default_unused, "import foo from 'foo'");

optimized_out!(import_specific_unused, "import {foo} from 'foo'");

optimized_out!(import_mixed_unused, "import foo, { bar } from 'foo'");

noop!(export_named, "export { x };");

noop!(export_named_from, "export {foo} from 'src';");

noop!(
    import_default_export_named,
    "import foo from 'src'; export { foo }; "
);
