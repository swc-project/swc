#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::{chain, SyntaxContext};
use swc_ecma_transforms::{
    optimization::simplify::dce::{self, dce},
    resolver,
};

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

fn used(ids: &[&str], src: &str, expected: &str) {
    test_transform!(
        Default::default(),
        |_| chain!(
            resolver(),
            dce(dce::Config {
                used: Some(
                    ids.into_iter()
                        .map(|&v| { (v.into(), SyntaxContext::empty()) })
                        .collect()
                ),
                ..Default::default()
            })
        ),
        src,
        expected,
        false
    );
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

to!(
    import_unused_export_named,
    "import foo, { bar } from 'src'; export { foo }; ",
    "import foo from 'src'; export { foo }; "
);

#[test]
fn export_named_unused() {
    used(&["foo"], "export { foo, bat }", "export { foo }");
}

#[test]
fn export_default_expr_unused() {
    used(&[], "export default 5;", "");
}

#[test]
fn export_default_expr_used() {
    used(&["default"], "export default 5;", "export default 5;");
}

noop!(
    issue_760_1,
    "var ref;
    const Auth = window === null || window === void 0 ? void 0 : (ref = window.aws) === null || \
     ref === void 0 ? void 0 : ref.Auth;
    "
);

noop!(
    issue_760_2_export_default,
    "const initialState = 'foo';
export default function reducer(state = initialState, action = {}) {
}"
);

noop!(
    issue_760_2_export_named,
    "const initialState = 'foo';
export function reducer(state = initialState, action = {}) {
}"
);

optimized_out!(
    issue_760_2_no_export,
    "const initialState = 'foo';
function reducer(state = initialState, action = {}) {
}"
);
