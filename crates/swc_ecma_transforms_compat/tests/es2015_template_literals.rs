use std::path::PathBuf;

use swc_ecma_ast::{Expr, Pass};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::template_literal;
use swc_ecma_transforms_testing::{test, test_exec, test_fixture};
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

fn syntax() -> Syntax {
    Default::default()
}

fn tr(config: template_literal::Config) -> impl Pass {
    template_literal(config)
}

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    issue_231,
    "const truthy = 'a=b';
const foo = `http://example.com/foo/bar${truthy && '?'}${truthy}`;
expect(foo).toBe('http://example.com/foo/bar?a=b');\
     "
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    issue_388,
    "
\"use strict\";
const write = (text) => {
  console.log(text)
}
write(1)
write('2')
write`3`"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    escape_quotes,
    include_str!("inline-inputs/es2015_template_literals/escape_quotes/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    multiple,
    include_str!("inline-inputs/es2015_template_literals/multiple/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    none,
    include_str!("inline-inputs/es2015_template_literals/none/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    only,
    include_str!("inline-inputs/es2015_template_literals/only/input.js")
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    order,
    r#"
const calls = [];

`
  ${
    (calls.push(1), {
      [Symbol.toPrimitive](){
        calls.push(2);
        return 'foo';
      }
    })
  }
  ${
    (calls.push(3), {
      [Symbol.toPrimitive](){
        calls.push(4);
        return 'bar';
      }
    })
  }
`;

expect(calls).toEqual([1, 2, 3, 4]);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    order2,
    r#"const calls = [];

`
  ${{
    [Symbol.toPrimitive]() {
      calls.push(1);
      return "foo";
    }
  }}
  ${1 +
    {
      valueOf() {
        calls.push(2);
        return 2;
      }
    }}
`;

expect(calls).toEqual([1, 2]);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    single,
    include_str!("inline-inputs/es2015_template_literals/single/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    statement,
    include_str!("inline-inputs/es2015_template_literals/statement/input.js")
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    symbol,
    r#"const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    template_revision,
    include_str!("inline-inputs/es2015_template_literals/template_revision/input.js")
);

// default_order_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_order_exec,
    r#"
const calls = [];

`
  ${
    (calls.push(1), {
      [Symbol.toPrimitive](){
        calls.push(2);
        return 'foo';
      }
    })
  }
  ${
    (calls.push(3), {
      [Symbol.toPrimitive](){
        calls.push(4);
        return 'bar';
      }
    })
  }
`;

expect(calls).toEqual([1, 2, 3, 4]);

"#
);

// default_only
test!(
    syntax(),
    |_| tr(Default::default()),
    default_only,
    include_str!("inline-inputs/es2015_template_literals/default_only/input.js")
);

// default_single
test!(
    syntax(),
    |_| tr(Default::default()),
    default_single,
    include_str!("inline-inputs/es2015_template_literals/default_single/input.js")
);

// default_statement
test!(
    syntax(),
    |_| tr(Default::default()),
    default_statement,
    include_str!("inline-inputs/es2015_template_literals/default_statement/input.js")
);

// default_expression_first
test!(
    syntax(),
    |_| tr(Default::default()),
    default_expression_first,
    include_str!("inline-inputs/es2015_template_literals/default_expression_first/input.js")
);

// default_literals
test!(
    syntax(),
    |_| tr(Default::default()),
    default_literals,
    include_str!("inline-inputs/es2015_template_literals/default_literals/input.js")
);

// default_multiline
test!(
    syntax(),
    |_| tr(Default::default()),
    default_multiline,
    include_str!("inline-inputs/es2015_template_literals/default_multiline/input.js")
);

// default_template_revision
test!(
    // TODO: Improve parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    default_template_revision,
    include_str!("inline-inputs/es2015_template_literals/default_template_revision/input.js")
);

// default_order2_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_order2_exec,
    r#"
const calls = [];

`
  ${{
    [Symbol.toPrimitive]() {
      calls.push(1);
      return "foo";
    }
  }}
  ${1 +
    {
      valueOf() {
        calls.push(2);
        return 2;
      }
    }}
`;

expect(calls).toEqual([1, 2]);

"#
);

// default_cache_revision_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_cache_revision_exec,
    r#"
var tag = v => v;

function foo() {
  return tag`some template`;
}
function bar() {
  return tag`some template`;
}
expect(foo()).toBe(foo());
expect(foo()).toEqual(["some template"]);

expect(bar()).toBe(bar());
expect(bar()).toEqual(["some template"]);

expect(bar()).not.toBe(foo());

"#
);

// default_functions
test!(
    syntax(),
    |_| tr(Default::default()),
    default_functions,
    include_str!("inline-inputs/es2015_template_literals/default_functions/input.js")
);

// default_none
test!(
    syntax(),
    |_| tr(Default::default()),
    default_none,
    include_str!("inline-inputs/es2015_template_literals/default_none/input.js")
);

// default_symbol_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_symbol_exec,
    r#"
const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);

"#
);

// default_cache_revision
test!(
    syntax(),
    |_| tr(Default::default()),
    default_cache_revision,
    include_str!("inline-inputs/es2015_template_literals/default_cache_revision/input.js")
);

// default_tag
test!(
    syntax(),
    |_| tr(Default::default()),
    default_tag,
    include_str!("inline-inputs/es2015_template_literals/default_tag/input.js")
);

// default_simple_tag
test!(
    syntax(),
    |_| tr(Default::default()),
    default_simple_tag,
    include_str!("inline-inputs/es2015_template_literals/default_simple_tag/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_598_1,
    include_str!("inline-inputs/es2015_template_literals/issue_598_1/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_01,
    include_str!("inline-inputs/es2015_template_literals/codegen_01/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_02,
    include_str!("inline-inputs/es2015_template_literals/codegen_02/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_03,
    include_str!("inline-inputs/es2015_template_literals/codegen_03/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_04,
    include_str!("inline-inputs/es2015_template_literals/codegen_04/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_05,
    include_str!("inline-inputs/es2015_template_literals/codegen_05/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_06,
    include_str!("inline-inputs/es2015_template_literals/codegen_06/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_07,
    include_str!("inline-inputs/es2015_template_literals/codegen_07/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_08,
    include_str!("inline-inputs/es2015_template_literals/codegen_08/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_09,
    include_str!("inline-inputs/es2015_template_literals/codegen_09/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_10,
    include_str!("inline-inputs/es2015_template_literals/codegen_10/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1280,
    include_str!("inline-inputs/es2015_template_literals/issue_1280/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1488_1,
    include_str!("inline-inputs/es2015_template_literals/issue_1488_1/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_1,
    include_str!("inline-inputs/es2015_template_literals/issue_1549_1/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_2,
    include_str!("inline-inputs/es2015_template_literals/issue_1549_2/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1742_1,
    include_str!("inline-inputs/es2015_template_literals/issue_1742_1/input.js")
);

test!(
    syntax(),
    |_| tr(Default::default()),
    preserve_comment,
    include_str!("inline-inputs/es2015_template_literals/preserve_comment/input.js")
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    issue_1742_2,
    "
    const obj = {
      foo() {
        return this;
      }
    }
    expect(typeof obj.foo`template`).toEqual('object')
    "
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_escape_quotes,
    include_str!("inline-inputs/es2015_template_literals/loose_escape_quotes/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_expression_first,
    include_str!("inline-inputs/es2015_template_literals/loose_expression_first/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_function,
    include_str!("inline-inputs/es2015_template_literals/loose_function/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_literals,
    include_str!("inline-inputs/es2015_template_literals/loose_literals/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_multi_line,
    include_str!("inline-inputs/es2015_template_literals/loose_multi_line/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_multiple,
    include_str!("inline-inputs/es2015_template_literals/loose_multiple/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_none,
    include_str!("inline-inputs/es2015_template_literals/loose_none/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_only,
    include_str!("inline-inputs/es2015_template_literals/loose_only/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_single,
    include_str!("inline-inputs/es2015_template_literals/loose_single/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_statement,
    include_str!("inline-inputs/es2015_template_literals/loose_statement/input.js")
);

test_exec!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_order,
    "
    const calls = [];

    `
      ${
        calls.push(1),
        {
          [Symbol.toPrimitive](){
            calls.push(2);
            return 'foo';
          }
        }
      }
      ${
        calls.push(3),
        {
          [Symbol.toPrimitive](){
            calls.push(4);
            return 'bar';
          }
        }
      }
    `;
    
    expect(calls).toEqual([1, 2, 3, 4]);
  "
);

test_exec!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_order_2,
    "
    const calls = [];

    `
      ${{
        [Symbol.toPrimitive]() {
          calls.push(1);
          return 'foo';
        }
      }}
      ${1 +
        {
          valueOf() {
            calls.push(2);
            return 2;
          }
        }}
    `;
    
    expect(calls).toEqual([1, 2]);
  "
);

test_exec!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_symbol,
    "const fn = () => `${Symbol()}`;

  expect(fn).toThrow(TypeError);"
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: false,
        mutable_template: true
    }),
    loose_no_tag,
    include_str!("inline-inputs/es2015_template_literals/loose_no_tag/input.js")
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: false,
        mutable_template: true
    }),
    loose_tag,
    include_str!("inline-inputs/es2015_template_literals/loose_tag/input.js")
);

test!(
    // TODO: Fix parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    loose_template_revision,
    include_str!("inline-inputs/es2015_template_literals/loose_template_revision/input.js")
);

/// Models plugins that synthesize ordinary templates with only raw text.
struct ClearCooked;

impl VisitMut for ClearCooked {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);
        if let Expr::Tpl(tpl) = expr {
            for quasi in &mut tpl.quasis {
                quasi.cooked = None;
            }
        }
    }
}

#[testing::fixture("tests/template-literals/missing-cooked/**/input.js")]
fn missing_cooked(input: PathBuf) {
    let output = input.with_file_name("output.js");
    test_fixture(
        syntax(),
        &|_| (visit_mut_pass(ClearCooked), tr(Default::default())),
        &input,
        &output,
        Default::default(),
    );
}
