use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_testing::{compare_stdout, test, test_fixture};
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    let unresolved = Mark::new();
    let global = Mark::new();
    chain!(resolver(unresolved, global, false), arrow(unresolved))
}

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    arguments_nested_arrow,
    "
    function test() {
      console.log(arguments[0]);
      return () => {
        console.log(arguments[0]);
        return () => {
          console.log(arguments[0])
        };
      }
    }

    test()(1)(2);
    "
);

compare_stdout!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    arguments_nested_fn,
    "
    function test() {
      console.log(arguments[0]);
      return () => {
        console.log(arguments[0]);
        return function() {
          console.log(arguments[0]);
          return () => {
            console.log(arguments[0])
          };
        };
      }
    }
    test()(1)(2)(3);
    "
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    fixture_arguments,
    r#"
function fn() {
  var foo = () => {
    return arguments;
  };
}

var bar = () => arguments;

var baz = () => () => arguments;
"#,
    r#"
var _arguments = arguments;

function fn() {
  var _arguments = arguments;

  var foo = function () {
    return _arguments;
  };
}

var bar = function () {
  return _arguments;
};

var baz = function () {
  return function () {
    return _arguments;
  };
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    two_arrow,
    r#"
let foo = () => this;
let bar = () => this;
let foo1 = () => arguments;
let bar1 = () => arguments;
"#,
    r#"
var _this = this, _arguments = arguments;
let foo = function () {
  return _this;
}
let bar = function () {
  return _this;
}
let foo1 = function () {
  return _arguments;
}
let bar1 = function () {
  return _arguments;
}
"#
);

#[testing::fixture("tests/arrow/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            chain!(
                resolver(unresolved_mark, Mark::new(), false),
                arrow(unresolved_mark)
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
