use super::*;

test!(
    Destructuring::default(),
    obj_assign_pat,
    r#"let { a = 1 } = foo"#,
    r#"let _foo$a = foo.a, a = _foo$a === void 0 ? 1 : _foo$a;"#
);

test!(
    Destructuring::default(),
    obj_assign_expr,
    r#"let a;
[{ a = 1 }] = foo"#,
    r#"let a;
var ref, ref1, ref2;
( ref = foo, ( ref1 = ref[0], ref2 = ref1.a, a = ref2 === void 0 ? 1 : ref2), ref);"#
);

test!(
    Destructuring::default(),
    array1,
    r#"var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var ref = ['hello', [', ', 'junk'], ['world']], a = ref[0], ref1 = ref[1], 
    b = ref1[0], ref2 = ref[2], c = ref2[0];"#
);

test!(
    Destructuring::default(),
    array2,
    r#"[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var ref, ref1, ref2;
( ref2 = ['hello', [', ', 'junk'], ['world']], a = ref2[0], ( ref = ref2[1], b = ref[0], ref),
 ( ref1 = ref2[2], c = ref1[0], ref1), ref2);"#
);

test!(
    Destructuring::default(),
    assign_expr_completion_record,
    r#"var x, y;
[x, y] = [1, 2];"#,
    r#"var x, y;
var ref;
( ref = [1, 2], x = ref[0], y = ref[1], ref);"#
);

test!(
    Destructuring::default(),
    assign_expr_pat,
    r#"var z = {};
var { x: { y } = {} } = z;"#,
    r#"var z = {
};
var tmp = z.x, ref = tmp === void 0 ? {
} : tmp, y = ref.y;"#
);

test!(
    Destructuring::default(),
    assign_expr,
    r#"console.log([x] = [123]);"#,
    r#"var ref;
console.log((ref = [123], x = ref[0], ref));"#
);

test_exec!(
    Destructuring::default(),
    chained,
    r#"var a, b, c, d;
({ a, b } = ({ c, d } = { a: 1, b: 2, c: 3, d: 4}));
expect(a).toBe(1);
expect(b).toBe(2);
expect(c).toBe(3);
expect(d).toBe(4);"#
);

test_exec!(
    Destructuring::default(),
    empty_obj_pat_1,
    r#"expect(function () {
  var {} = null;
}).toThrow("Cannot destructure undefined");"#
);

// test!(
//     Destructuring::default(),
//     empty_obj_pat_2,
//     r#"var {} = null;"#,
//     r#"var _ref = null;
// babelHelpers.objectDestructuringEmpty(_ref);"#
// );

test!(
    Destructuring::default(),
    empty,
    r#"var [, a, [b], [c], d] = ["foo", "hello", [", ", "junk"], ["world"]];"#,
    r#"var ref = ['foo', 'hello', [', ', 'junk'], ['world']], a = ref[1], ref1 = ref[2],
     b = ref1[0], ref2 = ref[3], c = ref2[0], d = ref[4];
"#
);

test!(
    ignore,
    Destructuring::default(),
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
    Destructuring::default(),
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
    Destructuring::default(),
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
    Destructuring::default(),
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
    Destructuring::default(),
    for_let,
    r#"for (let [ i, n ] = range; ; ) {}"#,
    r#"for(let i = range[0], n = range[1];;){}"#
);

test!(
    Destructuring::default(),
    for_of,
    r#"for (var [ name, before, after ] of test.expectation.registers) {

}"#,
    r#"for(var ref of test.expectation.registers){
    let name = ref[0], before = ref[1], after = ref[2];
}"#
);

test_exec!(
    Destructuring::default(),
    fn_key_with_obj_rest_spread,
    r#"const { [(() => 1)()]: a, ...rest } = { 1: "a" };

expect(a).toBe("a");
expect(rest).toEqual({});"#
);

test!(
    Destructuring::default(),
    babel_issue_3081,
    r#"let list = [1, 2, 3, 4];
for (let i = 0, { length } = list; i < length; i++) {
  list[i];
}"#,
    r#"let list = [1, 2, 3, 4];
for(let i = 0, length = list.length; i < length; i++){
    list[i];
}"#
);

test_exec!(
    Destructuring::default(),
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
    Destructuring::default(),
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
    Destructuring::default(),
    babel_issue_5744,
    r#"if (true) [a, b] = [b, a];"#,
    r#"var ref;
if (true) ( ref = [b, a], a = ref[0], b = ref[1], ref);"#
);

test!(
    ignore,
    Destructuring::default(),
    babel_issue_6373,
    r#"import { NestedObjects } from "./some-module"

const { Foo, Bar } = NestedObjects"#,
    r#""use strict";

var _someModule = require("./some-module");

const Foo = _someModule.NestedObjects.Foo,
      Bar = _someModule.NestedObjects.Bar;"#
);

test!(
    Destructuring::default(),
    known_array,
    r#"var z = [];
var [x, ...y] = z;"#,
    r#"var z = [];
var x = z[0],
    y = z.slice(1);"#
);

test!(
    Destructuring::default(),
    member_expr,
    r#"[foo.foo, foo.bar] = [1, 2];"#,
    r#"var ref;
( ref = [1, 2], foo.foo = ref[0], foo.bar = ref[1], ref);"#
);

test!(
    Destructuring::default(),
    mixed,
    r#"var rect = {};
var {topLeft: [x1, y1], bottomRight: [x2, y2] } = rect;"#,
    r#"var rect = {};
var _rect$topLeft = rect.topLeft, x1 = _rect$topLeft[0], y1 = _rect$topLeft[1], 
_rect$bottomRight = rect.bottomRight, x2 = _rect$bottomRight[0], y2 = _rect$bottomRight[1]"#
);

test!(
    Destructuring::default(),
    multiple,
    r#"var coords = [1, 2];
var { x, y } = coords,
    foo = "bar";"#,
    r#"var coords = [1, 2];
var x = coords.x,
    y = coords.y,
    foo = "bar";"#
);

test_exec!(
    Destructuring::default(),
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
    Destructuring::default(),
    object_advanced,
    r#"var rect = {};
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;
var { 3: foo, 5: bar } = [0, 1, 2, 3, 4, 5, 6];"#,
    r#"var rect = {};
var _rect$topLeft = rect.topLeft, x1 = _rect$topLeft.x, y1 = _rect$topLeft.y,
 _rect$bottomRight = rect.bottomRight, x2 = _rect$bottomRight.x, y2 = _rect$bottomRight.y;
var ref = [0, 1, 2, 3, 4, 5, 6], foo = ref[3], bar = ref[5];"#
);

test!(
    Destructuring::default(),
    object_basic,
    r#"var coords = [1, 2];
var { x, y } = coords;"#,
    r#"var coords = [1, 2];
var x = coords.x,
    y = coords.y;"#
);

test_exec!(
    Destructuring::default(),
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
    Destructuring::default(),
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
