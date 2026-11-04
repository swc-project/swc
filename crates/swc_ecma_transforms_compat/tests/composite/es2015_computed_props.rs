#![allow(clippy::unit_arg)]

use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::computed_props::{computed_properties, Config};
use swc_ecma_transforms_testing::test_exec;

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    computed_properties(Default::default())
}

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_2,
    r#"
let a = "outside";
const obj = {
  get [{
    get [a]() {
      let a = "inside";
      return a;
    },
  }.outside]() {
    let a = "middle";
    return a;
  },
};

expect(obj.inside).toBe("middle");
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_3,
    r#"
const obj = {
  foo() {
      const obj2 = {
          get [1]() {
              return 42;
          },
      };
      return obj2;
  },
};

expect(obj.foo()[1]).toBe(42);
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)"#
);

// spec_mixed

// spec_single

// spec

// regression_7144

// spec_multiple

// spec_this

// spec_method

// spec_assignment

// spec_argument

// spec_two

// spec_variable

// spec_symbol_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    spec_symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)

"#
);

test_exec!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_symbol,
    r#"
var k = Symbol();
var foo = {
[Symbol.iterator]: "foobar",
get [k]() {
  return k;
}
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)

"#
);

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "computed-properties")]
    ComputedProperties,
    #[serde(rename = "computed-properties-loose")]
    ComputedPropertiesLoose,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/composite/computed-properties/computed-properties/**/input.js")]
#[testing::fixture("tests/composite/computed-properties/computed-properties-loose/**/input.js")]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ComputedProperties => {
                    Box::new(computed_properties(Default::default()))
                }
                CasePipeline::ComputedPropertiesLoose => {
                    Box::new(computed_properties(Config { loose: true }))
                }
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
