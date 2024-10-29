use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_testing::{compare_stdout, test_fixture};

fn tr() -> impl Pass {
    let unresolved = Mark::new();
    let global = Mark::new();
    (resolver(unresolved, global, false), arrow(unresolved))
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

#[testing::fixture("tests/arrow/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                arrow(unresolved_mark),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
