use std::path::PathBuf;

use swc_ecma_ast::{Expr, Pass};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::template_literal;
use swc_ecma_transforms_testing::{test_exec, test_fixture};
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

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    symbol,
    r#"const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);"#
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

// default_single

// default_statement

// default_expression_first

// default_literals

// default_multiline

// default_template_revision

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

// default_none

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

// default_tag

// default_simple_tag

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

#[testing::fixture("tests/composite/template-literals/missing-cooked/**/input.js")]
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

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "template-literal")]
    Default,
    #[serde(rename = "template-literal-ignore-to-primitive")]
    IgnoreToPrimitive,
    #[serde(rename = "template-literal-mutable-template")]
    MutableTemplate,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/composite/cases/template-literals/**/input.js")]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::Default => Box::new(tr(Default::default())),
                CasePipeline::IgnoreToPrimitive => Box::new(tr(template_literal::Config {
                    ignore_to_primitive: true,
                    mutable_template: false,
                })),
                CasePipeline::MutableTemplate => Box::new(tr(template_literal::Config {
                    ignore_to_primitive: false,
                    mutable_template: true,
                })),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
