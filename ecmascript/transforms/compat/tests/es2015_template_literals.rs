use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::template_literal;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr(_: ()) -> impl Fold {
    template_literal()
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
'use strict';
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
    r#"var t = `'${foo}' "${bar}"`;"#,
    r#"var t = "'".concat(foo, '\' "').concat(bar, '"');"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    multiple,
    r#"var foo = `test ${foo} ${bar}`;"#,
    r#"var foo = 'test '.concat(foo, ' ').concat(bar);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    none,
    r#"var foo = `test`;"#,
    r#"var foo = "test";"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    only,
    r#"var foo = `${test}`;"#,
    r#"var foo = ''.concat(test);"#
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
    r#"var foo = `test ${foo}`;"#,
    r#"var foo = 'test '.concat(foo);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    statement,
    r#"var foo = `test ${foo + bar}`;"#,
    r#"var foo = 'test '.concat(foo + bar);"#,
    ok_if_code_eq
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    symbol,
    r#"const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);"#
);

test!(
    // TODO: Fix parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    template_revision,
    r#"tag`\unicode and \u{55}`;
tag`\01`;
tag`\xg${0}right`;
tag`left${0}\xg`;
tag`left${0}\xg${1}right`;
tag`left${0}\u000g${1}right`;
tag`left${0}\u{-0}${1}right`;
function a() {
  var undefined = 4;
  tag`\01`;
}"#,
    r#"
function _templateObject8() {
  const data = _taggedTemplateLiteral([void 0], ["\\01"]);

  _templateObject8 = function () {
    return data;
  };

  return data;
}

function _templateObject7() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\u{-0}", "right"]);

  _templateObject7 = function () {
    return data;
  };

  return data;
}

function _templateObject6() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\u000g", "right"]);

  _templateObject6 = function () {
    return data;
  };

  return data;
}

function _templateObject5() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\xg", "right"]);

  _templateObject5 = function () {
    return data;
  };

  return data;
}

function _templateObject4() {
  const data = _taggedTemplateLiteral(["left", void 0], ["left", "\\xg"]);

  _templateObject4 = function () {
    return data;
  };

  return data;
}

function _templateObject3() {
  const data = _taggedTemplateLiteral([void 0, "right"], ["\\xg", "right"]);

  _templateObject3 = function () {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral([void 0], ["\\01"]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral([void 0], ["\\unicode and \\u{55}"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

tag(_templateObject());
tag(_templateObject2());
tag(_templateObject3(), 0);
tag(_templateObject4(), 0);
tag(_templateObject5(), 0, 1);
tag(_templateObject6(), 0, 1);
tag(_templateObject7(), 0, 1);

function a() {
  var undefined = 4;
  tag(_templateObject8());
}"#
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

"#,
    r#"
var foo = "".concat(test);

"#
);

// default_single
test!(
    syntax(),
    |_| tr(Default::default()),
    default_single,
    r#"
var foo = `test ${foo}`;

"#,
    r#"
var foo = "test ".concat(foo);

"#
);

// default_statement
test!(
    syntax(),
    |_| tr(Default::default()),
    default_statement,
    r#"
var foo = `test ${foo + bar}`;

"#,
    r#"
var foo = "test ".concat(foo + bar);

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

"#,
    r#"
var foo = 5;
var bar = 10;
var baz = 15;
var example = "a";
var example2 = "".concat(1);
var example3 = 1 + "".concat(foo).concat(bar).concat(baz);
var example4 = 1 + "".concat(foo, "bar").concat(baz);
var example5 = "";

"#
);

// default_literals
test!(
    syntax(),
    |_| tr(Default::default()),
    default_literals,
    r#"
var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;

"#,
    r#"
var foo = ''.concat(1).concat(f, 'oo', true).concat(b, 'ar', 0).concat(baz);

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

"#,
    r#"
var o = "wow\nthis is\nactually multiline!";

"#,
    ok_if_code_eq
);

// default_template_revision
test!(
    // TODO: Improve parser
    ignore,
    syntax(),
    |_| tr(Default::default()),
    default_template_revision,
    r#"
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

"#,
    r#"
function _templateObject8() {
  const data = _taggedTemplateLiteral([void 0], ["\\01"]);

  _templateObject8 = function () {
    return data;
  };

  return data;
}

function _templateObject7() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\u{-0}", "right"]);

  _templateObject7 = function () {
    return data;
  };

  return data;
}

function _templateObject6() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\u000g", "right"]);

  _templateObject6 = function () {
    return data;
  };

  return data;
}

function _templateObject5() {
  const data = _taggedTemplateLiteral(["left", void 0, "right"], ["left", "\\xg", "right"]);

  _templateObject5 = function () {
    return data;
  };

  return data;
}

function _templateObject4() {
  const data = _taggedTemplateLiteral(["left", void 0], ["left", "\\xg"]);

  _templateObject4 = function () {
    return data;
  };

  return data;
}

function _templateObject3() {
  const data = _taggedTemplateLiteral([void 0, "right"], ["\\xg", "right"]);

  _templateObject3 = function () {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral([void 0], ["\\01"]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral([void 0], ["\\unicode and \\u{55}"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

tag(_templateObject());
tag(_templateObject2());
tag(_templateObject3(), 0);
tag(_templateObject4(), 0);
tag(_templateObject5(), 0, 1);
tag(_templateObject6(), 0, 1);
tag(_templateObject7(), 0, 1);

function a() {
  var undefined = 4;
  tag(_templateObject8());
}

"#
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

"#,
    r#"
var foo = "test ".concat(_.test(foo), " ").concat(bar);

"#
);

// default_none
test!(
    syntax(),
    |_| tr(Default::default()),
    default_none,
    r#"
var foo = `test`;

"#,
    r#"
var foo = "test";

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

"#,
    r#"
function _templateObject() {
  const data = _taggedTemplateLiteral(["some template"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _templateObject1() {
  const data = _taggedTemplateLiteral(["some template"]);

  _templateObject1 = function () {
    return data;
  };

  return data;
}

var tag = v => v;

function foo() {
  return tag(_templateObject());
}

function bar() {
  return tag(_templateObject1());
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
    r#"
var foo = bar`wow\na${ 42 }b ${_.foobar()}`;
var bar = bar`wow\nab${ 42 } ${_.foobar()}`;
var bar = bar`wow\naB${ 42 } ${_.baz()}`;

"#,
    r#"
function _templateObject() {
  const data = _taggedTemplateLiteral(["wow\na", "b ", ""], ["wow\\na", "b ", ""]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _templateObject1() {
  const data = _taggedTemplateLiteral(["wow\nab", " ", ""], ["wow\\nab", " ", ""]);

  _templateObject1 = function () {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["wow\naB", " ", ""], ["wow\\naB", " ", ""]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}


var foo = bar(_templateObject(), 42, _.foobar());
var bar = bar(_templateObject1(), 42, _.foobar());
var bar = bar(_templateObject2(), 42, _.baz());

"#
);

// default_simple_tag
test!(
    syntax(),
    |_| tr(Default::default()),
    default_simple_tag,
    r#"
var foo = tag`wow`;
var bar = tag`first${1}second`;

"#,
    r#"
function _templateObject() {
  const data = _taggedTemplateLiteral(["wow"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _templateObject1() {
  const data = _taggedTemplateLiteral(["first", "second"]);

  _templateObject1 = function () {
    return data;
  };

  return data;
}

var foo = tag(_templateObject());
var bar = tag(_templateObject1(), 1);

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
",
    "function _templateObject() {
      const data = _taggedTemplateLiteral([
          \"Hello World\"
      ]);
      _templateObject = function() {
          return data;
      };
      return data;
  }
  function _templateObject1() {
      const data = _taggedTemplateLiteral([
          \"Nobody will ever see this.\"
      ]);
      _templateObject1 = function() {
          return data;
      };
      return data;
  }
  export function foo() {
      console.log(i18n(_templateObject()));
      console.log(i18n(_templateObject1()));
  }
  "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_01,
    "`\"`",
    r#""\"""#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_02,
    "`\"\"`",
    r#"
    "\"\""
    "#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_03,
    "`\"${foo}`",
    r#"
    "\"".concat(foo);
    "#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_04,
    "`\"${foo}\"`",
    r#"
    "\"".concat(foo, "\"");
    "#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_05,
    "`\"\"${foo}\"\"`",
    r#"
    "\"\"".concat(foo, "\"\"");
    "#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_06,
    "\"``\"",
    "\"``\"",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_07,
    r#"`The ${argumentName} has unexpected type of "`"#,
    r#""The ".concat(argumentName, " has unexpected type of \"");"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_08,
    r#"`". Expected argument to be an object with the following `"#,
    r#""\". Expected argument to be an object with the following ";"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_09,
    r#"`keys: "${reducerKeys.join('", "')}"`"#,
    r#""keys: \"".concat(reducerKeys.join('\", \"'), "\"");"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    codegen_10,
    r#"`The ${argumentName} has unexpected type of "` +
  matchType +
  `". Expected argument to be an object with the following ` +
  `keys: "${reducerKeys.join('", "')}"`"#,
    r#""The ".concat(argumentName, " has unexpected type of \"") + matchType + "\". Expected argument to be an object with the following " + "keys: \"".concat(reducerKeys.join('", "'), "\"")"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1280,
    "
    const myVar = T`'Hello'`;
    ",
    "
    function _templateObject() {
      const data = _taggedTemplateLiteral([
          \"'Hello'\"
      ]);
      _templateObject = function() {
          return data;
      };
      return data;
    }
  
    const myVar = T(_templateObject());    
    ",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1488_1,
    "
    `\\``
    ",
    "
    '`'
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_1,
    "const a = `\r\n`;",
    "const a = \"\\n\";",
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1549_2,
    "const a = \"\\r\\n\";",
    "const a = \"\\r\\n\";"
);
