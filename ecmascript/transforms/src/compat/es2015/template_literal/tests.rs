use super::*;

test!(
  TemplateLiteral::default(),
  escape_quotes,
  r#"var t = `'${foo}' "${bar}"`;"#,
  r#"var t = "'" + foo + '\' "' + bar + '"';"#,
  ok_if_code_eq
);

test!(
  TemplateLiteral::default(),
  expr_first,
  r#"var foo = 5;
var bar = 10;
var baz = 15;

var example = `${"a"}`;
var example2 = `${1}`;
var example3 = 1 + `${foo}${bar}${baz}`;
var example4 = 1 + `${foo}bar${baz}`;
var example5 = `${""}`;"#,
  r#"var foo = 5;
var bar = 10;
var baz = 15;
var example = '' + 'a';
var example2 = '' + 1;
var example3 = 1 + '' + foo + bar + baz;
var example4 = 1 + '' + foo + 'bar' + baz;
var example5 = '' + '';"#,
  ok_if_code_eq
);

test!(
  TemplateLiteral::default(),
  functions,
  r#"var foo = `test ${_.test(foo)} ${bar}`;"#,
  r#"var foo = 'test ' + _.test(foo) + ' ' + bar;"#
);

test!(
  TemplateLiteral::default(),
  literals,
  r#"var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;"#,
  r#"var foo = '' + 1 + f + 'oo' + true + b + 'ar' + 0 + baz;"#
);

test!(
  TemplateLiteral::default(),
  multiline,
  r#"var o = `wow
this is
actually multiline!`;"#,
  r#"var o = "wow\nthis is\nactually multiline!";"#,
  ok_if_code_eq
);

test!(
  TemplateLiteral::default(),
  multiple,
  r#"var foo = `test ${foo} ${bar}`;"#,
  r#"var foo = 'test ' + foo + ' ' + bar;"#
);

test!(
  TemplateLiteral::default(),
  none,
  r#"var foo = `test`;"#,
  r#"var foo = "test";"#
);

test!(
  TemplateLiteral::default(),
  only,
  r#"var foo = `${test}`;"#,
  r#"var foo = '' + test"#
);

test_exec!(
  TemplateLiteral::default(),
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
  TemplateLiteral::default(),
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
  TemplateLiteral::default(),
  simple_tag,
  r#"var foo = tag`wow`;
var bar = tag`first${1}second`;"#,
  r#"var foo = tag(function _templateObject() {
    const data = _taggedTemplateLiteral(['wow']);
    _templateObject = function() {
        return data;
    };
    return data;
}());
var bar = tag(function _templateObject1() {
    const data = _taggedTemplateLiteral(['first', 'second']);
    _templateObject1 = function() {
        return data;
    };
    return data;
}(), 1);
"#
);

test!(
  TemplateLiteral::default(),
  single,
  r#"var foo = `test ${foo}`;"#,
  r#"var foo = 'test ' + foo;"#
);

test!(
  TemplateLiteral::default(),
  statement,
  r#"var foo = `test ${foo + bar}`;"#,
  r#"var foo = 'test ' + foo + bar;"#,
  ok_if_code_eq
);

test_exec!(
  TemplateLiteral::default(),
  symbol,
  r#"const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);"#
);

test!(
  TemplateLiteral::default(),
  tag,
  r#"
var foo = bar`wow\na${ 42 }b ${_.foobar()}`;
var bar = bar`wow\nab${ 42 } ${_.foobar()}`;
var bar = bar`wow\naB${ 42 } ${_.baz()}`;
"#,
  r#"var foo = bar1(function _templateObject() {
    const data = _taggedTemplateLiteral(['wow\na', 'b ', ''], ['wow\\\\na', 'b ', '']);
    _templateObject = function() {
        return data;
    };
    return data;
}(), 42, _.foobar());
var bar1 = bar1(function _templateObject1() {
    const data = _taggedTemplateLiteral(['wow\nab', ' ', ''], ['wow\\\\nab', ' ', '']);
    _templateObject1 = function() {
        return data;
    };
    return data;
}(), 42, _.foobar());
var bar1 = bar1(function _templateObject1() {
    const data = _taggedTemplateLiteral(['wow\naB', ' ', ''], ['wow\\\\naB', ' ', '']);
    _templateObject1 = function() {
        return data;
    };
    return data;
}(), 42, _.baz());
"#,
  ok_if_code_eq
);

test!(
  TemplateLiteral::default(),
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
