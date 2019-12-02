use super::*;
use crate::{compat::es2015, resolver};
use swc_common::chain;

fn tr() -> impl Fold<Module> {
    Destructuring
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_169,
    "export class Foo {
	func(a, b = Date.now()) {
		return {a};
	}
}",
    "export class Foo{
     func(a, ref) {
        let b = ref === void 0 ? Date.now() : ref;
        return {
            a
        };
    }
}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_260_01,
    "[code = 1] = []",
    "var ref, ref1;
ref = [], ref1 = ref[0], code = ref1 === void 0 ? 1 : ref1, ref;"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_260_02,
    "[code = 1, ...rest] = []",
    "var ref, ref1;
ref = [], ref1 = ref[0], code = ref1 === void 0 ? 1 : ref1, rest = ref.slice(1), ref;"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    object_pat_assign_prop,
    "({code = 1} = {})",
    "var ref, ref1;
ref = {}, ref1 = ref.code, code = ref1 === void 0 ? 1 : ref1, ref;"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    obj_assign_pat,
    r#"let { a = 1 } = foo"#,
    r#"let ref = foo ? foo : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
        _ref$a = ref.a, a = _ref$a === void 0 ? 1 : _ref$a;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    obj_assign_expr,
    r#"let a;
[{ a = 1 }] = foo"#,
    r#"let a;
var ref, ref1, ref2;
ref = foo, ref1 = ref[0], ref2 = ref1.a, a = ref2 === void 0 ? 1 : ref2, ref;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    array1,
    r#"var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var ref = ['hello', [', ', 'junk'], ['world']], a = ref[0], ref1 = ref[1], 
    b = ref1[0], ref2 = ref[2], c = ref2[0];"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    array2,
    r#"[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var ref, ref1, ref2;
ref = ['hello', [', ', 'junk'], ['world']], a = ref[0], ref1 = ref[1],
     b = ref1[0], ref2 = ref[2], c = ref2[0], ref;
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    assign_expr_completion_record,
    r#"var x, y;
[x, y] = [1, 2];"#,
    r#"var x, y;
var ref;
ref = [1, 2], x = ref[0], y = ref[1], ref;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    assign_expr_pat,
    r#"var z = {};
var { x: { y } = {} } = z;"#,
    r#"var z = {
};
var ref = z ? z : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), tmp = ref.x,
 ref1 = tmp === void 0 ? {
} : tmp, ref2 = ref1 ? ref1 : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), y = ref2.y;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    assign_expr,
    r#"console.log([x] = [123]);"#,
    r#"var ref;
console.log((ref = [123], x = ref[0], ref));"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    chained,
    r#"var a, b, c, d;
({ a, b } = ({ c, d } = { a: 1, b: 2, c: 3, d: 4}));
expect(a).toBe(1);
expect(b).toBe(2);
expect(c).toBe(3);
expect(d).toBe(4);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    empty_obj_pat_1,
    r#"expect(function () {
  var {} = null;
}).toThrow("Cannot destructure 'undefined' or 'null'");"#
);

// test!(::swc_ecma_parser::Syntax::default(),
//     |_| tr(),
//     empty_obj_pat_2,
//     r#"var {} = null;"#,
//     r#"var _ref = null;
// babelHelpers.objectDestructuringEmpty(_ref);"#
// );

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    empty,
    r#"var [, a, [b], [c], d] = ["foo", "hello", [", ", "junk"], ["world"]];"#,
    r#"var ref = ['foo', 'hello', [', ', 'junk'], ['world']], a = ref[1], ref1 = ref[2],
     b = ref1[0], ref2 = ref[3], c = ref2[0], d = ref[4];
"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    es7_object_rest_builtins,
    r#"var z = {};
var { ...x } = z;
var { x, ...y } = z;
var { [x]: x, ...y } = z;
(function({ x, ...y }) { });

({ x, y, ...z } = o);"#,
    r#"var z = {};
var _z = z,
    x = Object.assign({}, _z);
var _z2 = z,
    x = _z2.x,
    y = babelHelpers.objectWithoutProperties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = babelHelpers.objectWithoutProperties(_z3, [x].map(babelHelpers.toPropertyKey));

(function (_ref) {
  var x = _ref.x,
      y = babelHelpers.objectWithoutProperties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = babelHelpers.objectWithoutProperties(_o, ["x", "y"]);
_o;"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    es7_object_rest,
    r#"var z = {};
var { ...x } = z;
var { x, ...y } = z;
var { [x]: x, ...y } = z;
(function({ x, ...y }) { });

({ x, y, ...z } = o);"#,
    r#"var z = {};
var _z = z,
    x = babelHelpers.extends({}, _z);
var _z2 = z,
    x = _z2.x,
    y = babelHelpers.objectWithoutProperties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = babelHelpers.objectWithoutProperties(_z3, [x].map(babelHelpers.toPropertyKey));

(function (_ref) {
  var x = _ref.x,
      y = babelHelpers.objectWithoutProperties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = babelHelpers.objectWithoutProperties(_o, ["x", "y"]);
_o;"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    export_variable,
    r#"export let {a, b, c: {d, e: {f = 4}}} = {};"#,
    r#"
var _ref = {},
    a = _ref.a,
    b = _ref.b,
    _ref$c = _ref.c,
    d = _ref$c.d,
    _ref$c$e$f = _ref$c.e.f,
    f = _ref$c$e$f === void 0 ? 4 : _ref$c$e$f;
export { a, b, d, f };"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    for_in,
    r#"for (var [name, value] in obj) {
  print("Name: " + name + ", Value: " + value);
}"#,
    r#"for(var ref in obj){
    let name = ref[0], value = ref[1];
    print('Name: ' + name + ', Value: ' + value);
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    for_let,
    r#"for (let [ i, n ] = range; ; ) {}"#,
    r#"for(let i = range[0], n = range[1];;){}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    for_of,
    r#"for (var [ name, before, after ] of test.expectation.registers) {

}"#,
    r#"for(var ref of test.expectation.registers){
    let name = ref[0], before = ref[1], after = ref[2];
}"#
);

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    fn_key_with_obj_rest_spread,
    r#"const { [(() => 1)()]: a, ...rest } = { 1: "a" };

expect(a).toBe("a");
expect(rest).toEqual({});"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    babel_issue_3081,
    r#"let list = [1, 2, 3, 4];
for (let i = 0, { length } = list; i < length; i++) {
  list[i];
}"#,
    r#"let list = [1, 2, 3, 4];
for(let i = 0, ref = list ? list : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
  length = ref.length; i < length; i++){
    list[i];
}
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    babel_issue_5090,
    r#"const assign = function([...arr], index, value) {
  arr[index] = value;
  return arr;
}

const arr = [1, 2, 3];
assign(arr, 1, 42);

expect(arr).toEqual([1, 2, 3]);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    babel_issue_5628,
    r#"
(function () {
  let q;
  let w;
  let e;
  if (true) [q, w, e] = [1, 2, 3].map(()=>123);
})();"#,
    r#"(function() {
    let q;
    let w;
    let e;
    var ref;
    if (true)  ref = [1, 2, 3].map(()=>123), q = ref[0], w = ref[1], e = ref[2], ref;    
})();"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    babel_issue_5744,
    r#"if (true) [a, b] = [b, a];"#,
    r#"var ref;
if (true) ref = [b, a], a = ref[0], b = ref[1], ref;"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    babel_issue_6373,
    r#"import { NestedObjects } from "./some-module"

const { Foo, Bar } = NestedObjects"#,
    r#""use strict";

var _someModule = require("./some-module");

const Foo = _someModule.NestedObjects.Foo,
      Bar = _someModule.NestedObjects.Bar;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    known_array,
    r#"var z = [];
var [x, ...y] = z;"#,
    r#"var z = [];
var x = z[0],
    y = z.slice(1);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    member_expr,
    r#"[foo.foo, foo.bar] = [1, 2];"#,
    r#"var ref;
ref = [1, 2], foo.foo = ref[0], foo.bar = ref[1], ref;"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    mixed,
    r#"var rect = {};
var {topLeft: [x1, y1], bottomRight: [x2, y2] } = rect;"#,
    r#"var rect = {};
var ref = rect ? rect : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
    _ref$topLeft = ref.topLeft, x1 = _ref$topLeft[0], y1 = _ref$topLeft[1],
    _ref$bottomRight = ref.bottomRight, x2 = _ref$bottomRight[0], y2 = _ref$bottomRight[1];"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    multiple,
    r#"var coords = [1, 2];
var { x, y } = coords,
    foo = "bar";"#,
    r#"var coords = [1, 2];
var ref = coords ? coords : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
     x = ref.x, y = ref.y, foo = 'bar';"#
);

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    number_key_with_object_spread,
    r#"const foo = {
  1: "a",
  2: "b",
  3: "c",
};

const { [1]: bar, ...rest } = foo;

expect(bar).toBe("a");
expect(rest).toEqual({ 2: "b", 3: "c" });"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    object_advanced,
    r#"var rect = {};
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;
var { 3: foo, 5: bar } = [0, 1, 2, 3, 4, 5, 6];"#,
    r#"var rect = {
};
var ref = rect ? rect : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")),
    _ref$topLeft = ref.topLeft, ref1 = _ref$topLeft ? _ref$topLeft : 
    _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), x1 = ref1.x, y1 = ref1.y,
    _ref$bottomRight = ref.bottomRight, ref2 = _ref$bottomRight ? _ref$bottomRight :
    _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), x2 = ref2.x, y2 = ref2.y;
var ref3 = [0, 1, 2, 3, 4, 5, 6], foo = ref3[3], bar = ref3[5];"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    object_basic,
    r#"var coords = [1, 2];
var { x, y } = coords;"#,
    r#"var coords = [1, 2];
var ref = coords ? coords : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), x = ref.x, y = ref.y;"#
);

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| Destructuring,
    spread_generator,
    r#"function* f() {
  for (var i = 0; i < 3; i++) {
    yield i;
  }
}
var [...xs] = f();
expect(xs).toEqual([0, 1, 2]);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    spread,
    r#"function isSorted([x, y, ...wow]) {
  if (!zs.length) return true
  if (y > x) return isSorted(zs)
  return false
}"#,
    r#"function isSorted(ref) {
    let x = ref[0], y = ref[1], wow = ref.slice(2);
    if (!zs.length) return true;
    if (y > x) return isSorted(zs);
    return false;
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_311,
    "const Foo = 'foo';

const bar = {
  [Foo]: {
    qux: 'baz'
  }
};

const {
  [Foo]: {
    qux
  }
} = bar;",
    "
const Foo = 'foo';
const bar = {
    [Foo]: {
        qux: 'baz'
    }
};
const ref = bar ? bar : _throw(new TypeError(\"Cannot destructure 'undefined' or 'null'\")), \
     _ref$Foo = ref[Foo], ref1 = _ref$Foo ? _ref$Foo : _throw(new TypeError(\"Cannot destructure \
     'undefined' or 'null'\")), qux = ref1.qux;"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_317,
    "export const [
    A,
    B,
    C
] = [1,2,3];

export const [
    E,
    D,
    F
] = [4,5,6];",
    "
var ref = [1, 2, 3];
export const A = ref[0], B = ref[1], C = ref[2];
var ref1 = [4, 5, 6];
export const E = ref[0], D = ref[1], F = ref[2];"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_336,
    "const { 'foo-bar': fooBar } = baz;",
    "const ref = baz ? baz : _throw(new TypeError(\"Cannot destructure 'undefined' or 'null'\")), \
     fooBar = ref['foo-bar'];"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_404_1,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "
function foo(bar) {
    const ref = bar ? bar : _throw(new TypeError(\"Cannot destructure 'undefined' or 'null'\")), \
     foo = ref.foo;
    return foo;
}"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(resolver(), es2015(),),
    issue_404_2,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "
function foo(bar) {
    var ref = bar ? bar : _throw(new TypeError(\"Cannot destructure 'undefined' or 'null'\")), \
     foo1 = ref.foo;
    return foo1;
}"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_404_3,
    "function foo(bar) {
    var { foo: foo1  } = bar;
    return foo1;
}",
    "
function foo(bar) {
    var ref = bar ? bar : _throw(new TypeError(\"Cannot destructure 'undefined' or 'null'\")), \
     foo1 = ref.foo;
    return foo1;
}
"
);
