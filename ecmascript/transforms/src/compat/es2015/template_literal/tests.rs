use super::*;

test!(
  TemplateLiteral,
  escape_quotes,
  r#"var t = `'${foo}' "${bar}"`;"#,
  r#"var t = "'".concat(foo, "' \"").concat(bar, "\"");"#
);

test!(
  TemplateLiteral,
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
  TemplateLiteral,
  functions,
  r#"var foo = `test ${_.test(foo)} ${bar}`;"#,
  r#"var foo = 'test ' + _.test(foo) + ' ' + bar;"#
);

test!(
  TemplateLiteral,
  literals,
  r#"var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;"#,
  r#"var foo = '' + 1 + f + 'oo' + true + b + 'ar' + 0 + baz;"#
);

test!(
  TemplateLiteral,
  multiline,
  r#"var o = `wow
this is
actually multiline!`;"#,
  r#"var o = "wow\nthis is\nactually multiline!";"#,
  ok_if_code_eq
);

test!(
  TemplateLiteral,
  multiple,
  r#"var foo = `test ${foo} ${bar}`;"#,
  r#"var foo = 'test ' + foo + ' ' + bar;"#
);

test!(
  TemplateLiteral,
  none,
  r#"var foo = `test`;"#,
  r#"var foo = "test";"#
);

test!(
  TemplateLiteral,
  only,
  r#"var foo = `${test}`;"#,
  r#"var foo = '' + test"#
);

test_exec!(
  TemplateLiteral,
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
  TemplateLiteral,
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
        TemplateLiteral,
        simple_tag,
        r#"var foo = tag`wow`;
var bar = tag`first${1}second`;"#,
        r#"function _templateObject2() {
  const data = _taggedTemplateLiteral(["first", "second"]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["wow"]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var foo = tag(_templateObject());
var bar = tag(_templateObject2(), 1);"#
    );

test!(
  TemplateLiteral,
  single,
  r#"var foo = `test ${foo}`;"#,
  r#"var foo = "test ".concat(foo);"#
);

test!(
  TemplateLiteral,
  statement,
  r#"var foo = `test ${foo + bar}`;"#,
  r#"var foo = "test ".concat(foo + bar);"#
);

test_exec!(
  TemplateLiteral,
  symbol,
  r#"const fn = () => `${Symbol()}`;

expect(fn).toThrow(TypeError);"#
);

test!(
        TemplateLiteral,
        tag,
        r#"
var foo = bar`wow\na${ 42 }b ${_.foobar()}`;
var bar = bar`wow\nab${ 42 } ${_.foobar()}`;
var bar = bar`wow\naB${ 42 } ${_.baz()}`;
"#,
        r#"Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 @kdy1 Sign out
881
30,563 3,141 babel/babel
 Code  Issues 616  Pull requests 103  Projects 1  Wiki  Insights
babel/packages/babel-plugin-transform-template-literals/test/fixtures/default/tag/output.js
040ba2b  on 12 May
@dczombera dczombera Remove no longer needed #__PURE__ annotations for taggedTemplateLiter…
@dczombera @debugpai @rajasekarm
     
36 lines (25 sloc)  905 Bytes
function _templateObject3() {
  const data = _taggedTemplateLiteral(["wow\naB", " ", ""], ["wow\\naB", " ", ""]);

  _templateObject3 = function () {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["wow\nab", " ", ""], ["wow\\nab", " ", ""]);

  _templateObject2 = function () {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["wow\na", "b ", ""], ["wow\\na", "b ", ""]);

  _templateObject = function () {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var foo = bar(_templateObject(), 42, _.foobar());
var bar = bar(_templateObject2(), 42, _.foobar());
var bar = bar(_templateObject3(), 42, _.baz());"#
    );

test!(
        TemplateLiteral,
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
}"#
    );
