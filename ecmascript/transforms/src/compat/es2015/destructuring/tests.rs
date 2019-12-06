use super::*;
use crate::{
    compat::{
        es2015,
        es2015::{block_scoping, parameters, spread},
        es2018::object_rest_spread,
    },
    resolver,
};
use swc_common::chain;
use swc_ecma_parser::Syntax;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Fold<Module> {
    Destructuring
}

test!(
    syntax(),
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
    syntax(),
    |_| tr(),
    issue_260_01,
    "[code = 1] = []",
    "var ref, ref1;
ref = [], ref1 = ref[0], code = ref1 === void 0 ? 1 : ref1, ref;"
);

test!(
    syntax(),
    |_| tr(),
    issue_260_02,
    "[code = 1, ...rest] = []",
    "var ref, ref1;
ref = [], ref1 = ref[0], code = ref1 === void 0 ? 1 : ref1, rest = ref.slice(1), ref;"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop,
    "({code = 1} = {})",
    "var ref, ref1;
ref = {}, ref1 = ref.code, code = ref1 === void 0 ? 1 : ref1, ref;"
);

test!(
    syntax(),
    |_| tr(),
    obj_assign_pat,
    r#"let { a = 1 } = foo"#,
    r#"let _foo$a = foo.a, a = _foo$a === void 0 ? 1 : _foo$a;"#
);

test!(
    syntax(),
    |_| tr(),
    obj_assign_expr,
    r#"let a;
[{ a = 1 }] = foo"#,
    r#"let a;
var ref, ref1, ref2;
ref = foo, ref1 = ref[0], ref2 = ref1.a, a = ref2 === void 0 ? 1 : ref2, ref;"#
);

test!(
    syntax(),
    |_| tr(),
    array1,
    r#"var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var a = 'hello', ref = [', ', 'junk'], b = ref[0], c = 'world';"#
);

test!(
    syntax(),
    |_| tr(),
    array2,
    r#"[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"a = 'hello', [b] = [', ', 'junk'], [c] = ['world'];
"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_completion_record,
    r#"var x, y;
[x, y] = [1, 2];"#,
    r#"var x, y;
x = 1, y = 2"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_pat,
    r#"var z = {};
var { x: { y } = {} } = z;"#,
    r#"var z = {
};
var tmp = z.x, ref = tmp === void 0 ? {} : tmp, y = ref.y;"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr,
    r#"console.log([x] = [123]);"#,
    r#"console.log(x = 123);"#
);

test_exec!(
    syntax(),
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
    syntax(),
    |_| Destructuring,
    empty_obj_pat_1,
    r#"expect(function () {
  var {} = null;
}).toThrow("Cannot destructure 'undefined' or 'null'");"#
);

// test!(syntax(),
//     |_| tr(),
//     empty_obj_pat_2,
//     r#"var {} = null;"#,
//     r#"var _ref = null;
// _objectDestructuringEmpty(_ref);"#
// );

test!(
    syntax(),
    |_| tr(),
    empty,
    r#"var [, a, [b], [c], d] = ["foo", "hello", [", ", "junk"], ["world"]];"#,
    r#"var ref = ['foo', 'hello', [', ', 'junk'], ['world']], a = ref[1], ref1 = ref[2],
     b = ref1[0], ref2 = ref[3], c = ref2[0], d = ref[4];
"#
);

test!(
    ignore,
    syntax(),
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
    y = _objectWithoutProperties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = _objectWithoutProperties(_z3, [x].map(_toPropertyKey));

(function (_ref) {
  var x = _ref.x,
      y = _objectWithoutProperties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = _objectWithoutProperties(_o, ["x", "y"]);
_o;"#
);

test!(
    ignore,
    syntax(),
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
    x = _extends({}, _z);
var _z2 = z,
    x = _z2.x,
    y = _objectWithoutProperties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = _objectWithoutProperties(_z3, [x].map(_toPropertyKey));

(function (_ref) {
  var x = _ref.x,
      y = _objectWithoutProperties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = _objectWithoutProperties(_o, ["x", "y"]);
_o;"#
);

test!(
    ignore,
    syntax(),
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
    syntax(),
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
    syntax(),
    |_| tr(),
    for_let,
    r#"for (let [ i, n ] = range; ; ) {}"#,
    r#"for(let i = range[0], n = range[1];;){}"#
);

test!(
    syntax(),
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
    syntax(),
    |_| Destructuring,
    fn_key_with_obj_rest_spread,
    r#"const { [(() => 1)()]: a, ...rest } = { 1: "a" };

expect(a).toBe("a");
expect(rest).toEqual({});"#
);

test!(
    syntax(),
    |_| tr(),
    babel_issue_3081,
    r#"let list = [1, 2, 3, 4];
for (let i = 0, { length } = list; i < length; i++) {
  list[i];
}"#,
    r#"let list = [1, 2, 3, 4];
for(let i = 0, length = list.length; i < length; i++){
    list[i];
}
"#
);

test_exec!(
    syntax(),
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
    syntax(),
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
    syntax(),
    |_| tr(),
    babel_issue_5744,
    r#"if (true) [a, b] = [b, a];"#,
    r#"var ref;
if (true) ref = [b, a], a = ref[0], b = ref[1], ref;"#
);

test!(
    ignore,
    syntax(),
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
    syntax(),
    |_| tr(),
    known_array,
    r#"var z = [];
var [x, ...y] = z;"#,
    r#"var z = [];
var x = z[0],
    y = z.slice(1);"#
);

test!(
    syntax(),
    |_| tr(),
    member_expr,
    r#"[foo.foo, foo.bar] = [1, 2];"#,
    r#"foo.foo = 1, foo.bar = 2;"#
);

test!(
    syntax(),
    |_| tr(),
    multiple,
    r#"var coords = [1, 2];
var { x, y } = coords,
    foo = "bar";"#,
    r#"var coords = [1, 2];
var x = coords.x, y = coords.y, foo = 'bar';"#
);

test_exec!(
    ignore,
    syntax(),
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
    syntax(),
    |_| tr(),
    object_advanced,
    r#"var rect = {};
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;
var { 3: foo, 5: bar } = [0, 1, 2, 3, 4, 5, 6];"#,
    r#"var rect = {
};
var _rect$topLeft = rect.topLeft, x1 = _rect$topLeft.x,
    y1 = _rect$topLeft.y, _rect$bottomRight = rect.bottomRight,
    x2 = _rect$bottomRight.x, y2 = _rect$bottomRight.y;
var ref = [0, 1, 2, 3, 4, 5, 6], foo = ref[3], bar = ref[5];"#
);

test_exec!(
    ignore,
    syntax(),
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
    syntax(),
    |_| tr(),
    spread_test,
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
    syntax(),
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
const _bar$Foo = bar[Foo], qux = _bar$Foo.qux;"
);

test!(
    syntax(),
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
export const A = 1, B = 2, C = 3;
export const E = 4, D = 5, F = 6;"
);

test!(
    syntax(),
    |_| tr(),
    issue_336,
    "const { 'foo-bar': fooBar } = baz;",
    "const fooBar = baz['foo-bar'];"
);

test!(
    syntax(),
    |_| tr(),
    issue_404_1,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "
function foo(bar) {
    const foo = bar.foo;
    return foo;
}"
);

test!(
    syntax(),
    |_| chain!(resolver(), es2015(Default::default()),),
    issue_404_2,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "
function foo(bar) {
    var foo1 = bar.foo;
    return foo1;
}"
);

test!(
    syntax(),
    |_| tr(),
    issue_404_3,
    "function foo(bar) {
    var { foo: foo1  } = bar;
    return foo1;
}",
    "
function foo(bar) {
    var foo1 = bar.foo;;
    return foo1;
}
"
);

// destructuring_function_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| chain!(object_rest_spread(), destructuring()),
    destructuring_function_key_with_object_rest_spread_exec,
    r#"
const { [(() => 1)()]: a, ...rest } = { 1: "a" };

expect(a).toBe("a");
expect(rest).toEqual({});

"#
);

// regression_8528
test!(
    syntax(),
    |_| destructuring(),
    regression_8528,
    r#"
function isBetween(x, a, b) {
  if (a > b) [a, b] = [b, a];
  return x > a && x < b;
}

"#,
    r#"
function isBetween(x, a, b) {
  var ref;
  if (a > b) ref = [b, a], a = ref[0], b = ref[1], ref;

  return x > a && x < b;
}

"#
);

// destructuring_for_of
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_for_of,
    r#"
for (var [ name, before, after ] of test.expectation.registers) {

}

for ([ name, before, after ] of test.expectation.registers) {

}

"#,
    r#"
for (var _ref of test.expectation.registers) {
  var _ref2 = _slicedToArray(_ref, 3);

  var name = _ref2[0];
  var before = _ref2[1];
  var after = _ref2[2];
}

for (var _ref3 of test.expectation.registers) {
  var _ref4 = _slicedToArray(_ref3, 3);

  name = _ref4[0];
  before = _ref4[1];
  after = _ref4[2];
  void 0;
}

"#
);

// destructuring_object_basic
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_object_basic,
    r#"
var coords = [1, 2];
var { x, y } = coords;

"#,
    r#"
var coords = [1, 2];
var x = coords.x,
    y = coords.y;

"#
);

// destructuring_assignment_arrow_function_block
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_assignment_arrow_function_block,
    r#"
() => { [a, b] = [1, 2] }

"#,
    r#"
() => {
  a = 1, b = 2;
};

"#
);

// destructuring_non_iterable
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_non_iterable_exec,
    r#"
expect(
  () => {
    var [foo, bar] = undefined;
  }).toThrow("Invalid attempt to destructure non-iterable instance");

expect(
  () => {
    var foo = [ ...undefined ];
  }).toThrow("Invalid attempt to spread non-iterable instance");

"#
);

// destructuring_empty_object_pattern
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_empty_object_pattern_exec,
    r#"
expect(function () {
  var {} = null;
}).toThrow("Cannot destructure undefined");

"#
);

// destructuring_chained
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_chained_exec,
    r#"
var a, b, c, d;
({ a, b } = ({ c, d } = { a: 1, b: 2, c: 3, d: 4}));
expect(a).toBe(1);
expect(b).toBe(2);
expect(c).toBe(3);
expect(d).toBe(4);

"#
);

// destructuring_object_rest_impure_computed_keys
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_object_rest_impure_computed_keys_exec,
    r#"
var key, x, y, z;
// impure
key = 1;
var { [key++]: y, ...x } = { 1: 1, a: 1 };
expect(x).toEqual({ a: 1 });
expect(key).toBe(2);
expect(1).toBe(y);

// takes care of the order

key = 1;
var { [++key]: y, [++key]: z, ...rest} = {2: 2, 3: 3};
expect(y).toBe(2);
expect(z).toBe(3);

// pure, computed property should remain as-is
key = 2;
({ [key]: y, z, ...x } = {2: "two", z: "zee"});
expect(y).toBe("two");
expect(x).toEqual({});
expect(z).toBe("zee");

// rhs evaluated before lhs
var order = [];
function left() {
  order.push("left");
  return 0;
}
function right() {
  order.push("right");
  return {};
}
var { [left()]: y, ...x} = right();
expect(order).toEqual(["right", "left"]);

"#
);

// destructuring_issue_5090
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_issue_5090_exec,
    r#"
const assign = function([...arr], index, value) {
  arr[index] = value;
  return arr;
}

const arr = [1, 2, 3];
assign(arr, 1, 42);

expect(arr).toEqual([1, 2, 3]);

"#
);

// destructuring_default_precedence
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_default_precedence_exec,
    r#"
var f0 = function (a, b = a, c = b) {
  return [a, b, c];
};

expect(f0(1)).toEqual([1, 1, 1]);

var f1 = function ({a}, b = a, c = b) {
  return [a, b, c];
};

expect(f1({a: 1})).toEqual([1, 1, 1]);

var f2 = function ({a}, b = a, c = a) {
  return [a, b, c];
};

expect(f2({a: 1})).toEqual([1, 1, 1]);

"#
);

//// destructuring_es7_object_rest_builtins
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": [
//
//    [destructuring(), { "useBuiltIns": true }],
//    spread(spread::Config{..Default::default()}),
//    parameters(),
//    block_scoping(),
//    object_rest_spread(),
//  ]
//}
//"#),
//    destructuring_es7_object_rest_builtins,
//    r#"
//var z = {};
//var { ...x } = z;
//var { x, ...y } = z;
//var { [x]: x, ...y } = z;
//(function({ x, ...y }) { });
//
//({ x, y, ...z } = o);
//
//"#,
//    r#"
//var z = {};
//var _z = z,
//    x = Object.assign({}, _z);
//var _z2 = z,
//    x = _z2.x,
//    y = _objectWithoutProperties(_z2, ["x"]);
//var _z3 = z,
//    x = _z3[x],
//    y = _objectWithoutProperties(_z3, [x].map(_toPropertyKey));
//
//(function (_ref) {
//  var x = _ref.x,
//      y = _objectWithoutProperties(_ref, ["x"]);
//});
//
//var _o = o;
//x = _o.x;
//y = _o.y;
//z = _objectWithoutProperties(_o, ["x", "y"]);
//_o;
//
//"#
//);

// destructuring_parameters
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_parameters,
    r#"
function somethingAdvanced({topLeft: {x: x1, y: y1} = {}, bottomRight: {x: x2, y: y2} = {}}, p2, p3){

}

function unpackObject({title: title, author: author}) {
  return title + " " + author;
}

console.log(unpackObject({title: "title", author: "author"}));

var unpackArray = function ([a, b, c], [x, y, z]) {
  return a+b+c;
};

console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));

"#,
    r#"
function somethingAdvanced(_ref, p2, p3) {
  var _ref$topLeft = _ref.topLeft;
  _ref$topLeft = _ref$topLeft === void 0 ? {} : _ref$topLeft;
  var x1 = _ref$topLeft.x,
      y1 = _ref$topLeft.y,
      _ref$bottomRight = _ref.bottomRight;
  _ref$bottomRight = _ref$bottomRight === void 0 ? {} : _ref$bottomRight;
  var x2 = _ref$bottomRight.x,
      y2 = _ref$bottomRight.y;
}

function unpackObject(_ref2) {
  var title = _ref2.title,
      author = _ref2.author;
  return title + " " + author;
}

console.log(unpackObject({
  title: "title",
  author: "author"
}));

var unpackArray = function (_ref3, _ref4) {
  var _ref5 = _slicedToArray(_ref3, 3),
      a = _ref5[0],
      b = _ref5[1],
      c = _ref5[2];

  var _ref6 = _slicedToArray(_ref4, 3),
      x = _ref6[0],
      y = _ref6[1],
      z = _ref6[2];

  return a + b + c;
};

console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));

"#
);

// destructuring_array_unpack_optimisation
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_array_unpack_optimisation,
    r#"
var [a, b] = [1, 2];
var [[a, b]] = [[1, 2]];
var [a, b, ...c] = [1, 2, 3, 4];
var [[a, b, ...c]] = [[1, 2, 3, 4]];

var [a, b] = [1, 2, 3];
var [[a, b]] = [[1, 2, 3]];
var [a, b] = [a, b];
[a[0], a[1]] = [a[1], a[0]];
var [a, b] = [...foo, bar];
var [a, b] = [foo(), bar];
var [a, b] = [clazz.foo(), bar];
var [a, b] = [clazz.foo, bar];
var [a, b] = [, 2];
[a, b] = [1, 2];
[a, b] = [, 2];
; // Avoid completion record special case

"#,
    r#"
var a = 1,
    b = 2;
var a = 1,
    b = 2;
var a = 1,
    b = 2,
    c = [3, 4];
var a = 1,
    b = 2,
    c = [3, 4];
var ref = [1, 2, 3],
    a = ref[0],
    b = ref[1];
var ref1 = [1, 2, 3],
    a = ref1[0],
    b = ref1[1];
var ref2 = [a, b],
    a = ref2[0],
    b = ref2[1];
var ref3;
ref3 = [a[1], a[0]], a[0] = ref3[0], a[1] = ref3[1], ref3;


var ref4 = _toConsumableArray(foo).concat([bar]), a = ref4[0], b = ref4[1];

var ref5 = [foo(), bar],
    a = ref5[0],
    b = ref5[1];
var ref6 = [clazz.foo(), bar],
    a = ref6[0],
    b = ref6[1];
var ref7 = [clazz.foo, bar],
    a = ref7[0],
    b = ref7[1];
var a,
    b = 2;
a = 1, b = 2;
a = void 0, b = 2;

; // Avoid completion record special case

"#
);

// destructuring_known_array
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_known_array,
    r#"
var z = [];
var [x, ...y] = z;

"#,
    r#"
var z = [];
var x = z[0],
    y = z.slice(1);

"#
);

// destructuring_es7_object_rest
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_es7_object_rest,
    r#"
var z = {};
var { ...x } = z;
var { x, ...y } = z;
var { [x]: x, ...y } = z;
(function({ x, ...y }) { });

({ x, y, ...z } = o);

"#,
    r#"
var z = {};
var x = _extends({
}, z);
var _z2 = z,
    x = _z2.x,
    y = _objectWithoutProperties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = _objectWithoutProperties(_z3, [x].map(_toPropertyKey));

(function (_ref) {
  var x = _ref.x,
      y = _objectWithoutProperties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = _objectWithoutProperties(_o, ["x", "y"]);
_o;

"#
);

// destructuring_const
test_exec!(
    syntax(),
    |_| destructuring(),
    destructuring_const_exec,
    r#"
const getState = () => ({});

const { data: { courses: oldCourses = [] } = {} } = getState();

expect(oldCourses).toEqual([]);

"#
);

// destructuring_assignment_expression_pattern
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
    ),
    destructuring_assignment_expression_pattern,
    r#"
var z = {};
var { x: { y } = {} } = z;

"#,
    r#"
var z = {};
var tmp = z.x, ref = tmp === void 0 ? {} : tmp, y = ref.y;
"#
);

// destructuring_object_advanced
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
    ),
    destructuring_object_advanced,
    r#"
var rect = {};
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;
var { 3: foo, 5: bar } = [0, 1, 2, 3, 4, 5, 6];

"#,
    r#"
var rect = {};
var _rect$topLeft = rect.topLeft,
    x1 = _rect$topLeft.x,
    y1 = _rect$topLeft.y,
    _rect$bottomRight = rect.bottomRight,
    x2 = _rect$bottomRight.x,
    y2 = _rect$bottomRight.y;
var ref = [0, 1, 2, 3, 4, 5, 6],
    foo = ref[3],
    bar = ref[5];

"#
);

// destructuring_spread
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
    ),
    destructuring_spread,
    r#"
function isSorted([x, y, ...wow]) {
  if (!zs.length) return true
  if (y > x) return isSorted(zs)
  return false
}

"#,
    r#"
function isSorted(_ref) {
  var _ref2 = _toArray(_ref),
      x = _ref2[0],
      y = _ref2[1],
      wow = _ref2.slice(2);

  if (!zs.length) return true;
  if (y > x) return isSorted(zs);
  return false;
}

"#
);

// destructuring_mixed
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
    ),
    destructuring_mixed,
    r#"
var rect = {};
var {topLeft: [x1, y1], bottomRight: [x2, y2] } = rect;

"#,
    r#"
var rect = {};

var _rect$topLeft = _slicedToArray(rect.topLeft, 2),
    x1 = _rect$topLeft[0],
    y1 = _rect$topLeft[1],
    _rect$bottomRight = _slicedToArray(rect.bottomRight, 2),
    x2 = _rect$bottomRight[0],
    y2 = _rect$bottomRight[1];

"#
);

// destructuring_assignment_statement
test!(
    syntax(),
    |_| chain!(
        destructuring(),
        spread(spread::Config {
            ..Default::default()
        }),
        block_scoping(),
        object_rest_spread()
    ),
    destructuring_assignment_statement,
    r#"
[a, b] = f();
"#,
    r#"
            var ref;
ref = f(), a = ref[0], b = ref[1], ref;
"#
);

// destructuring_array
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_array,
    r#"
var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];
[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];

"#,
    r#"
var a = 'hello', ref = [', ', 'junk'], b = ref[0], c = 'world';
a = 'hello', [b] = [', ', 'junk'], [c] = ['world'];

"#
);

// destructuring_assignment_arrow_function_no_block
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_assignment_arrow_function_no_block,
    r#"
() => [a, b] = [1, 2]

"#,
    r#"
var ref;
()=>(ref = [1, 2], a = ref[0], b = ref[1], ref)
"#
);

// destructuring_issue_9834
test!(
    syntax(),
    |_| chain!(
        object_rest_spread(),
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_issue_9834,
    r#"
const input = {};

const {
  given_name: givenName,
  'last_name': lastName,
  [`country`]: country,
  [prefix + 'state']: state,
  [`${prefix}consents`]: consents,
  ...rest
} = input;

"#,
    r#"
var input = {};

var _ref = prefix + 'state',
    _ref2 = `${prefix}consents`,
    givenName = input.given_name,
    lastName = input['last_name'],
    country = input[`country`],
    state = input[_ref],
    consents = input[_ref2],
    rest = _objectWithoutProperties(input, ["given_name", "last_name", `country`, _ref, _ref2].map(_toPropertyKey));

"#
);

// destructuring_number_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| chain!(object_rest_spread(), destructuring()),
    destructuring_number_key_with_object_rest_spread_exec,
    r#"
const foo = {
  1: "a",
  2: "b",
  3: "c",
};

const { [1]: bar, ...rest } = foo;

expect(bar).toBe("a");
expect(rest).toEqual({ 2: "b", 3: "c" });

"#
);

// destructuring_for_in
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_for_in,
    r#"
for (var [name, value] in obj) {
  print("Name: " + name + ", Value: " + value);
}

for ([name, value] in obj) {
  print("Name: " + name + ", Value: " + value);
}

"#,
    r#"
for (var _ref in obj) {
  var _ref2 = _slicedToArray(_ref, 2);

  var name = _ref2[0];
  var value = _ref2[1];
  print("Name: " + name + ", Value: " + value);
}

for (var _ref3 in obj) {
  var _ref4 = _slicedToArray(_ref3, 2);

  name = _ref4[0];
  value = _ref4[1];
  print("Name: " + name + ", Value: " + value);
}

"#
);

// destructuring_issue_5744
test!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_issue_5744,
    r#"
if (true) [a, b] = [b, a];

"#,
    r#"
var ref;
if (true) ref = [b, a], a = ref[0], b = ref[1], ref;

"#
);

// destructuring_spread_generator
test_exec!(
    syntax(),
    |_| chain!(
        spread(spread::Config {
            ..Default::default()
        }),
        parameters(),
        destructuring(),
        block_scoping(),
        object_rest_spread(),
    ),
    destructuring_spread_generator_exec,
    r#"
function* f() {
  for (var i = 0; i < 3; i++) {
    yield i;
  }
}
var [...xs] = f();
expect(xs).toEqual([0, 1, 2]);

"#
);
