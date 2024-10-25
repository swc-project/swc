use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::template_literal;
use swc_ecma_transforms_testing::{test, test_exec};

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
    r#"var t = `'${foo}' "${bar}"`;"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    multiple,
    r#"var foo = `test ${foo} ${bar}`;"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    none,
    r#"var foo = `test`;"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    only,
    r#"var foo = `${test}`;"#
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
    r#"var foo = `test ${foo}`;"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    statement,
    r#"var foo = `test ${foo + bar}`;"#
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
    r"tag`\unicode and \u{55}`;
tag`\01`;
tag`\xg${0}right`;
tag`left${0}\xg`;
tag`left${0}\xg${1}right`;
tag`left${0}\u000g${1}right`;
tag`left${0}\u{-0}${1}right`;
function a() {
  var undefined = 4;
  tag`\01`;
}"
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
    r#"
var foo = `${test}`;

"#
);

// default_single
test!(
    syntax(),
    |_| tr(Default::default()),
    default_single,
    r#"
var foo = `test ${foo}`;

"#
);

// default_statement
test!(
    syntax(),
    |_| tr(Default::default()),
    default_statement,
    r#"
var foo = `test ${foo + bar}`;

"#
);

// default_expression_first
test!(
    syntax(),
    |_| tr(Default::default()),
    default_expression_first,
    r#"
var foo = 5;
var bar = 10;
var baz = 15;

var example = `${"a"}`;
var example2 = `${1}`;
var example3 = 1 + `${foo}${bar}${baz}`;
var example4 = 1 + `${foo}bar${baz}`;
var example5 = `${""}`;

"#
);

// default_literals
test!(
    syntax(),
    |_| tr(Default::default()),
    default_literals,
    r#"
var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;

"#
);

// default_multiline
test!(
    syntax(),
    |_| tr(Default::default()),
    default_multiline,
    r#"
var o = `wow
this is
actually multiline!`;

"#
);

// default_template_revision
test!(
    // TODO: Improve parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    default_template_revision,
    r"
tag`\unicode and \u{55}`;

tag`\01`;
tag`\xg${0}right`;
tag`left${0}\xg`;
tag`left${0}\xg${1}right`;
tag`left${0}\u000g${1}right`;
tag`left${0}\u{-0}${1}right`;

function a() {
  var undefined = 4;
  tag`\01`;
}

"
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
    r#"
var foo = `test ${_.test(foo)} ${bar}`;

"#
);

// default_none
test!(
    syntax(),
    |_| tr(Default::default()),
    default_none,
    r#"
var foo = `test`;

"#
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

// default_tag
test!(
    syntax(),
    |_| tr(Default::default()),
    default_tag,
    r"
var foo = bar`wow\na${ 42 }b ${_.foobar()}`;
var bar = bar`wow\nab${ 42 } ${_.foobar()}`;
var bar = bar`wow\naB${ 42 } ${_.baz()}`;

"
);

// default_simple_tag
test!(
    syntax(),
    |_| tr(Default::default()),
    default_simple_tag,
    r#"
var foo = tag`wow`;
var bar = tag`first${1}second`;

"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_598_1,
    "
  export function foo() {
    console.log(i18n`Hello World`);
    console.log(i18n`Nobody will ever see this.`);
  }
"
);

test!(syntax(), |_| tr(Default::default()), codegen_01, "`\"`");

test!(syntax(), |_| tr(Default::default()), codegen_02, "`\"\"`");

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_03,
    "`\"${foo}`"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_04,
    "`\"${foo}\"`"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_05,
    "`\"\"${foo}\"\"`"
);

test!(syntax(), |_| tr(Default::default()), codegen_06, "\"``\"");

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_07,
    r#"`The ${argumentName} has unexpected type of "`"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_08,
    r#"`". Expected argument to be an object with the following `"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_09,
    r#"`keys: "${reducerKeys.join('" "')}"`"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_10,
    r#"`The ${argumentName} has unexpected type of "` +
  matchType +
  `". Expected argument to be an object with the following ` +
  `keys: "${reducerKeys.join('" "')}"`"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1280,
    "
    const myVar = T`'Hello'`;
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1488_1,
    "
    `\\``
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_1,
    "const a = `\r\n`;"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_2,
    "const a = \"\\r\\n\";"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1742_1,
    "
    function foo() {
      return this;
    }
    foo`template`
    "
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
    r#"var t = `'${foo}' "${bar}"`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_expression_first,
    r#"
var foo = 5;
var bar = 10;
var baz = 15;

var example = `${"a"}`;
var example2 = `${1}`;
var example3 = 1 + `${foo}${bar}${baz}`;
var example4 = 1 + `${foo}bar${baz}`;
var example5 = `${""}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_function,
    r#"var foo = `test ${_.test(foo)} ${bar}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_literals,
    r#"var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_multi_line,
    r#"
var o = `wow
this is
actually multiline!`;
    "#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_multiple,
    r#"var foo = `test ${foo} ${bar}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_none,
    r#"var foo = `test`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_only,
    r#"var foo = `${test}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_single,
    r#"var foo = `test ${foo}`;"#
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: true,
        mutable_template: false
    }),
    loose_statement,
    r#"var foo = `test ${foo + bar}`;"#
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
    "`foo ${bar} baz`;"
);

test!(
    syntax(),
    |_| tr(template_literal::Config {
        ignore_to_primitive: false,
        mutable_template: true
    }),
    loose_tag,
    r"
var foo = bar`wow\na${ 42 }b ${_.foobar()}`;
var bar = bar`wow\nab${ 42 } ${_.foobar()}`;
var bar = bar`wow\naB${ 42 } ${_.baz()}`;
    "
);

test!(
    // TODO: Fix parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    loose_template_revision,
    r"tag`\unicode and \u{55}`;
tag`\01`;
tag`\xg${0}right`;
tag`left${0}\xg`;
tag`left${0}\xg${1}right`;
tag`left${0}\u000g${1}right`;
tag`left${0}\u{-0}${1}right`;
function a() {
var undefined = 4;
tag`\01`;
}"
);
