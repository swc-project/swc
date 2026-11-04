#![allow(clippy::unit_arg)]

use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::computed_props::{computed_properties, Config};
use swc_ecma_transforms_testing::{test, test_exec};

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    computed_properties(Default::default())
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_210,
    include_str!("inline-inputs/es2015_computed_props/issue_210/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    big_int,
    include_str!("inline-inputs/es2015_computed_props/big_int/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    accessors,
    include_str!("inline-inputs/es2015_computed_props/accessors/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680,
    include_str!("inline-inputs/es2015_computed_props/issue_2680/input.js")
);

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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(()),
    issue_2680_4,
    include_str!("inline-inputs/es2015_computed_props/issue_2680_4/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    argument,
    include_str!("inline-inputs/es2015_computed_props/argument/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    assignment,
    include_str!("inline-inputs/es2015_computed_props/assignment/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    method,
    include_str!("inline-inputs/es2015_computed_props/method/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    mixed,
    include_str!("inline-inputs/es2015_computed_props/mixed/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    multiple,
    include_str!("inline-inputs/es2015_computed_props/multiple/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    single,
    include_str!("inline-inputs/es2015_computed_props/single/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    symbol,
    include_str!("inline-inputs/es2015_computed_props/symbol/input.js")
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

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    this,
    include_str!("inline-inputs/es2015_computed_props/this/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_1,
    include_str!("inline-inputs/es2015_computed_props/issue_315_1/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_2,
    include_str!("inline-inputs/es2015_computed_props/issue_315_2/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_3,
    include_str!("inline-inputs/es2015_computed_props/issue_315_3/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(Default::default()),
    issue_315_4,
    include_str!("inline-inputs/es2015_computed_props/issue_315_4/input.js")
);

// spec_mixed
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_mixed,
    include_str!("inline-inputs/es2015_computed_props/spec_mixed/input.js")
);

// spec_single
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_single,
    include_str!("inline-inputs/es2015_computed_props/spec_single/input.js")
);

// spec

// regression_7144
test!(
    syntax(),
    |_| tr(Default::default()),
    regression_7144,
    include_str!("inline-inputs/es2015_computed_props/regression_7144/input.js")
);

// spec_multiple
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_multiple,
    include_str!("inline-inputs/es2015_computed_props/spec_multiple/input.js")
);

// spec_this
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_this,
    include_str!("inline-inputs/es2015_computed_props/spec_this/input.js")
);

// spec_method
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_method,
    include_str!("inline-inputs/es2015_computed_props/spec_method/input.js")
);

// spec_assignment
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_assignment,
    include_str!("inline-inputs/es2015_computed_props/spec_assignment/input.js")
);

// spec_argument
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_argument,
    include_str!("inline-inputs/es2015_computed_props/spec_argument/input.js")
);

// spec_two
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_two,
    include_str!("inline-inputs/es2015_computed_props/spec_two/input.js")
);

// spec_variable
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_variable,
    include_str!("inline-inputs/es2015_computed_props/spec_variable/input.js")
);

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

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_assignment,
    include_str!("inline-inputs/es2015_computed_props/loose_assignment/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_argument,
    include_str!("inline-inputs/es2015_computed_props/loose_argument/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_coerce,
    include_str!("inline-inputs/es2015_computed_props/loose_coerce/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_method,
    include_str!("inline-inputs/es2015_computed_props/loose_method/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_mixed,
    include_str!("inline-inputs/es2015_computed_props/loose_mixed/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_multiple,
    include_str!("inline-inputs/es2015_computed_props/loose_multiple/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_single,
    include_str!("inline-inputs/es2015_computed_props/loose_single/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_this,
    include_str!("inline-inputs/es2015_computed_props/loose_this/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_two,
    include_str!("inline-inputs/es2015_computed_props/loose_two/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_variable,
    include_str!("inline-inputs/es2015_computed_props/loose_variable/input.js")
);

test!(
    syntax(),
    |_| computed_properties(Config { loose: true }),
    loose_str_lit,
    include_str!("inline-inputs/es2015_computed_props/loose_str_lit/input.js")
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
