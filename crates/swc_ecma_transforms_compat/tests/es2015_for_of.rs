use std::{fs::read_to_string, path::PathBuf};

use swc_common::{comments::NoopComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{
    self,
    for_of::{for_of, Config},
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_let,
    r#"for (let i of arr) {

}"#
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_member_expr,
    r#"for (obj.prop of arr) {

}"#
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_multiple,
    r#"for (var i of arr) {

}

for (var i of numbers) {

}
"#
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_nested_label_for_of,
    r#"b: for (let c of d()) {
  for (let e of f()) {
    continue b;
  }
}"#
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_var,
    r#"for (var i of arr) {

}"#
);

// for_of_as_array_for_of
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of,
    r#"
let elm;

for (elm of array) {
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_array_pattern
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_array_pattern,
    r#"
let elm;
for ([elm] of array) {
  console.log(elm);
}

"#
);

// regression_redeclare_array_8913
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    regression_redeclare_array_8913,
    r#"
function f(...t) {
  for (let o of t) {
    const t = o;
  }
}

"#
);

// for_of_as_array_for_of_declaration_array_pattern
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_declaration_array_pattern,
    r#"
for (const [elm] of array) {
  console.log(elm);
}

"#
);

test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_expression,
    r#"
let i;
for (i of items) i;

"#
);

// for_of_as_array_for_of_declaration
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_declaration,
    r#"
for (const elm of array) {
  console.log(elm);
}

"#
);

// regression_scope_9696
test_exec!(
    syntax(),
    |_| for_of(Default::default()),
    regression_scope_9696_exec,
    r#"
var arr = [1, 2, 3];
var results = [];

for (let v of arr) {
  results.push(v);
  arr = null;
}

expect(results).toEqual([1, 2, 3]);

"#
);

// for_of_as_array_for_of_static_declaration
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_static_declaration,
    r#"
const array = [];

for (const elm of array) {
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_static
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_static,
    r#"
const array = [];
let elm;

for (elm of array) {
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_import_es2015
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    for_of_as_array_for_of_import_es2015,
    r#"
import { array } from "foo";

for (const elm of array) {
  console.log(elm);
}

"#
);

// regression_label_object_with_comment_4995
test!(
    syntax(),
    |_| for_of(Default::default()),
    regression_label_object_with_comment_4995,
    r#"
myLabel: //woops
for (let a of b) {
  continue myLabel;
}

"#
);

// regression_if_label_3858
test!(
    syntax(),
    |_| for_of(Config {
        assume_array: true,
        ..Default::default()
    }),
    regression_if_label_3858,
    r#"
if ( true )
  loop: for (let ch of []) {
  }


"#
);

#[testing::fixture("tests/for-of/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let top_level_mark = Mark::new();

            (
                resolver(Mark::new(), top_level_mark, false),
                for_of(Config {
                    assume_array: false,
                    ..Default::default()
                }),
            )
        },
        &input,
    );
}

#[testing::fixture("tests/for-of/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::default(),
        &|_| {
            let top_level_mark = Mark::new();

            (
                resolver(Mark::new(), top_level_mark, false),
                for_of(Config {
                    assume_array: false,
                    ..Default::default()
                }),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}

#[testing::fixture("tests/for-of/**/exec.js")]
fn exec_es2015(input: PathBuf) {
    let input = read_to_string(input).unwrap();

    compare_stdout(
        Syntax::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                es2015::es2015(unresolved_mark, Some(NoopComments), Default::default()),
            )
        },
        &input,
    );
}
