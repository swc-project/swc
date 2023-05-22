use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{
        block_scoping,
        destructuring::{destructuring, Config},
        parameters, spread,
    },
    es2018::object_rest_spread,
};
use swc_ecma_transforms_testing::{test, test_exec};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Fold {
    chain!(
        resolver(Mark::new(), Mark::new(), false),
        destructuring(Config { loose: true })
    )
}

test!(
    syntax(),
    |_| tr(),
    issue_2819,
    r#"const [first, , third] = ["red", "yellow", "green"]"#,
    r#"const first = "red", third = "green";"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| tr(),
    issue_2821,
    r#"const [x, y, ...z] = [1];"#,
    r#"const _ref = [
    1
], x = _ref[0], y = _ref[1], z = _ref.slice(2)"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    need_to_array,
    r#"const [x, y, ...z] = o;"#,
    r#"const _o = _to_array(o), x = _o[0], y = _o[1], z = _o.slice(2);"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    need_to_array_loose,
    r#"const [x, y, ...z] = o;"#,
    r#"const x = o[0], y = o[1], z = o.slice(2);"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    issue_2841,
    r#"function foo(a,b)
    {
        [a,b,...restParam] = arguments;
    }"#,
    r#"function foo(a, b) {
    var ref;
    ref = Array.prototype.slice.call(arguments), a = ref[0], b = ref[1], restParam = ref.slice(2), ref;
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    issue_2841_loose,
    r#"function foo(a,b)
    {
        [a,b,...restParam] = arguments;
    }"#,
    r#"function foo(a, b) {
    var ref;
    ref = arguments, a = ref[0], b = ref[1], restParam = ref.slice(2), ref;
}"#,
    ok_if_code_eq
);

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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    issue_1948,
    "
    const fn2 = (arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) => {
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    };

    function fn3(arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) {
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    };

    class cls {
        fn4(arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) {
            console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
        }

        fn5(arg1, arg2) {
            console.log(arg1, arg2);
        }
    }",
    "
    var fn2 = function(arg1, param, arg2, param1) {
        var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
        for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key \
     < _len; _key++){
            arg3[_key - 4] = arguments[_key];
        }
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    };
    function fn3(arg1, param, arg2, param1) {
        var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
        for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key \
     < _len; _key++){
            arg3[_key - 4] = arguments[_key];
        }
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    }
    ;
    class cls {
        fn4(arg1, param, arg2, param1) {
            var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
            for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; \
     _key < _len; _key++){
                arg3[_key - 4] = arguments[_key];
            }
            console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
        }
        fn5(arg1, arg2) {
            console.log(arg1, arg2);
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
    array_pat_assign_prop_binding,
    "[code = 1] = [1]",
    "
var ref;
    ref = 1, 
    code = ref === void 0 ? 1 : ref;
"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_2,
    "[foo = 1, bar = 2] = [3];",
    "
var ref, ref1, ref2;
    ref = [3],
    ref1 = ref[0],
    foo = ref1 === void 0 ? 1 : ref1,
    ref2 = ref[1],
    bar = ref2 === void 0 ? 2 : ref2,
    ref;
"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_3,
    "[foo = 1, bar = 2] = [3, 4];",
    "
var ref, ref1;
    ref = 3,
    foo = ref === void 0 ? 1 : ref,
    ref1 = 4,
    bar = ref1 === void 0 ? 2 : ref1;
"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_4,
    "const [foo = 1] = [2];",
    "const tmp = 2, foo = tmp === void 0 ? 1 : tmp;"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_5,
    "const [foo = 1, bar] = [2, 3];",
    "
const tmp = 2,
    foo = tmp === void 0 ? 1 : tmp,
    bar = 3;
"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_6,
    "const [foo = 1] = [];",
    "
const _ref = [],
    tmp = _ref[0],
    foo = tmp === void 0 ? 1 : tmp;
"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_7,
    "const [foo = 1] = [1, 2];",
    "
const _ref = [1, 2],
    tmp = _ref[0],
    foo = tmp === void 0 ? 1 : tmp;
"
);

test!(
    syntax(),
    |_| tr(),
    issue_260_02,
    "[code = 1, ...rest] = [];",
    "
var ref, ref1;
    ref = [],
    ref1 = ref[0],
    code = ref1 === void 0 ? 1 : ref1,
    rest = ref.slice(1),
    ref;
",
    ok_if_code_eq
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
    object_pat_assign_prop_2,
    "const {code = 1} = {}",
    "
const _ref = {},
  _ref_code = _ref.code,
  code = _ref_code === void 0 ? 1 : _ref_code;
"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding,
    "({foo: bar = 1} = {})",
    "
var ref, ref1;
ref = {}, ref1 = ref.foo, bar = ref1 === void 0 ? 1 : ref1, ref;
"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_2,
    "const {foo: bar = 1} = {}",
    "
const _ref = {},
  tmp = _ref.foo,
  bar = tmp === void 0 ? 1 : tmp;
"
);

test_exec!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_3,
    r#"
let foo = 1;
let bar = 2;
let x;
let y;
({ [++foo]: x = "c", [++bar]: y = "d" } = { 2: "a" });

expect(foo).toBe(2);
expect(bar).toBe(3);
expect(x).toBe("a");
expect(y).toBe("d");
"#
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_isseu_2850,
    "const obj = { foo = 123, bar: x = 123 } = { foo: 24, bar: 45 };",
    "
var ref, ref1, ref2;
const obj =(
    ref = {
        foo: 24,
        bar: 45
    },
    ref1 = ref.foo,
    foo = ref1 === void 0 ? 123 : ref1,
    ref2 = ref.bar,
    x = ref2 === void 0 ? 123 : ref2,
    ref
);
"
);

test_exec!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_isseu_2850_exec,
    r#"
const obj = { foo = 123, bar: x = 123 } = { foo: 24, bar: 45 };

expect(obj).toEqual({ foo: 24, bar: 45 });
expect(foo).toBe(24);
expect(x).toBe(45);
"#
);

test!(
    syntax(),
    |_| tr(),
    obj_assign_pat,
    r#"let { a = 1 } = foo"#,
    r#"let _foo_a = foo.a, a = _foo_a === void 0 ? 1 : _foo_a;"#
);

test!(
    syntax(),
    |_| tr(),
    obj_assign_expr,
    r#"let a;
[{ a = 1 }] = foo"#,
    r#"let a;
var ref, ref1, ref2;
ref = foo, ref1 = ref[0], ref2 = ref1.a, a = ref2 === void 0 ? 1 : ref2, ref1, ref;"#
);

test!(
    syntax(),
    |_| tr(),
    array1,
    r#"var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"var a = "hello", _ref = [", ", "junk"], b = _ref[0], c = "world";"#
);

test!(
    syntax(),
    |_| tr(),
    array2,
    r#"[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];"#,
    r#"
var ref, ref1;
    a = "hello",
    ref = [", ", "junk"],
    b = ref[0],
    ref,
    ref1 = ["world"],
    c = ref1[0],
    ref1;
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
var tmp = z.x, y = (tmp === void 0 ? {} : tmp).y;"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr,
    r#"console.log([x] = [123]);"#,
    r#"var ref;
console.log((ref = [123], x = ref[0], ref));"#
);

test_exec!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    chained,
    r#"var a, b, c, d;
({ a, b } = ({ c, d } = { a: 1, b: 2, c: 3, d: 4}));
expect(a).toBe(1);
expect(b).toBe(2);
expect(c).toBe(3);
expect(d).toBe(4);"#
);

test!(
    syntax(),
    |_| tr(),
    empty,
    r#"var [, a, [b], [c], d] = ["foo", "hello", [", ", "junk"], ["world"]];"#,
    r#"var _ref = ["foo", "hello", [", ", "junk"], ["world"]], a = _ref[1], _ref_ = _ref[2],
     b = _ref_[0], _ref_1 = _ref[3], c = _ref_1[0], d = _ref[4];
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
    y = _object_without_properties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = _object_without_properties(_z3, [x].map(_to_property_key));

(function (_ref) {
  var x = _ref.x,
      y = _object_without_properties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = _object_without_properties(_o, ["x", "y"]);
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
    y = _object_without_properties(_z2, ["x"]);
var _z3 = z,
    x = _z3[x],
    y = _object_without_properties(_z3, [x].map(_to_property_key));

(function (_ref) {
  var x = _ref.x,
      y = _object_without_properties(_ref, ["x"]);
});

var _o = o;
x = _o.x;
y = _o.y;
z = _object_without_properties(_o, ["x", "y"]);
_o;"#
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_1,
    r#"export const { a: a2, b: b2 } = { a: 1, b: 2 };"#,
    r#"
var _ref = {
    a: 1,
    b: 2,
};
export const a2 = _ref.a, b2 = _ref.b;
"#
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_2,
    r#"export const { a: b } = { a: 1 }"#,
    r#"
var _ref = {
    a: 1
};
export const b = _ref.a;
"#
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_3,
    r#"
export const {
    a: a1,
    b: b1,
    b: { c: c1 },
} = { a: 1, b: { c: 1 } };
"#,
    r#"
var _ref = {
    a: 1,
    b: {
      c: 1,
    },
  },
  _ref_b = _ref.b;
export const a1 = _ref.a,
  b1 = _ref.b,
  c1 = _ref_b.c;
"#
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
    print("Name: " + name + ", Value: " + value);
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
    |_| destructuring(Config { loose: true }),
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
    |_| destructuring(Config { loose: true }),
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
var x = coords.x, y = coords.y, foo = "bar";"#
);

test_exec!(
    ignore,
    syntax(),
    |_| destructuring(Config { loose: true }),
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

test_exec!(
    ignore,
    syntax(),
    |_| destructuring(Config { loose: true }),
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
const qux = bar[Foo].qux;"
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
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default()
            ),
        )
    },
    issue_404_2,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}",
    "
function foo(bar) {
    var foo = bar.foo;
    return foo;
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
    var foo1 = bar.foo;
    return foo1;
}
"
);

// destructuring_function_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| chain!(
        object_rest_spread(Default::default()),
        destructuring(Default::default())
    ),
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
    |_| destructuring(Default::default()),
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
        spread(Default::default()),
        destructuring(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default()),
    ),
    destructuring_for_of,
    r#"
for (var [ name, before, after ] of test.expectation.registers) {

}

for ([ name, before, after ] of test.expectation.registers) {

}

"#,
    r#"
for (var _$ref of test.expectation.registers){
    var _ref = _sliced_to_array(_$ref, 3), name = _ref[0], before = _ref[1], after = _ref[2];
}

var _$ref1;
for (ref of test.expectation.registers){
    _$ref1 = _sliced_to_array(ref, 3), name = _$ref1[0], before = _$ref1[1], after = _$ref1[2], _$ref1;
}

"#
);

// destructuring_object_basic
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_non_iterable_exec,
    r#"
expect(
  () => {
    var [foo, bar] = undefined;
  }).toThrow();

expect(
  () => {
    var foo = [ ...undefined ];
  }).toThrow();

"#
);

// destructuring_empty_object_pattern
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_empty_object_pattern_exec,
    r#"
expect(function () {
  var {} = null;
}).toThrow("Cannot destructure null");

"#
);

// destructuring_chained
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
//    [destructuring(Default::default()), { "useBuiltIns": true }],
//    spread(spread::Config{..Default::default()}),
//    parameters(Default::default()),
//    block_scoping(),
//    object_rest_spread(Default::default()),
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
//    y = _object_without_properties(_z2, ["x"]);
//var _z3 = z,
//    x = _z3[x],
//    y = _object_without_properties(_z3, [x].map(_to_property_key));
//
//(function (_ref) {
//  var x = _ref.x,
//      y = _object_without_properties(_ref, ["x"]);
//});
//
//var _o = o;
//x = _o.x;
//y = _o.y;
//z = _object_without_properties(_o, ["x", "y"]);
//_o;
//
//"#
//);

// destructuring_parameters
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
function somethingAdvanced(param, p2, p3) {
  var tmp = param.topLeft, _ref = tmp === void 0 ? {
    } : tmp, x1 = _ref.x, y1 = _ref.y, tmp1 = param.bottomRight, _ref1 = tmp1 === void 0 ? {
    } : tmp1, x2 = _ref1.x, y2 = _ref1.y;
}

function unpackObject(param) {
  var title = param.title,
      author = param.author;
  return title + " " + author;
}

console.log(unpackObject({
  title: "title",
  author: "author"
}));

 var unpackArray = function(param, param1) {
    var _param = _sliced_to_array(param, 3),
        a = _param[0],
        b = _param[1],
        c = _param[2],
        _param1 = _sliced_to_array(param1, 3),
        x = _param1[0],
        y = _param1[1],
        z = _param1[2];

  return a + b + c;
};

console.log(unpackArray(["hello", ", ", "world"], [1, 2, 3]));

"#
);

// destructuring_array_unpack_optimisation
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    var _ref = [1, 2, 3],
        a = _ref[0],
        b = _ref[1];
    var _ref1 = [1, 2, 3],
        a = _ref1[0],
        b = _ref1[1];
    var _ref2 = [a, b],
        a = _ref2[0],
        b = _ref2[1];
    var ref;
    ref = [a[1], a[0]], a[0] = ref[0], a[1] = ref[1], ref;


    var _to_consumable_array_concat = _sliced_to_array(_to_consumable_array(foo).concat([bar]), 2), a = _to_consumable_array_concat[0], b = _to_consumable_array_concat[1];
    // TODO: var ref4 = _to_consumable_array(foo).concat([bar]), a = ref4[0], b = ref4[1];

var _ref3 = [foo(), bar],
    a = _ref3[0],
    b = _ref3[1];
var _ref4 = [clazz.foo(), bar],
    a = _ref4[0],
    b = _ref4[1];
var _ref5 = [clazz.foo, bar],
    a = _ref5[0],
    b = _ref5[1];
var a,
    b = 2;
a = 1, b = 2;
a = void 0, b = 2;

; // Avoid completion record special case

"#
);

// destructuring_known_array
test!(
    // We will use constant propagation instead of optimizing in each pass
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
}, _object_destructuring_empty(z));
var x = z.x,
    y = _object_without_properties(z, ["x"]);
var x = z[x],
    y = _object_without_properties(z, [x].map(_to_property_key));

(function (_param) {
  var x = _param.x,
      y = _object_without_properties(_param, ["x"]);
});

var _o;
var ref;
_o = o, z = _object_without_properties(_o, ["x", "y"]), ref = _o, x = ref.x, y = ref.y, ref, _o;


"#
);

// destructuring_const
test_exec!(
    syntax(),
    |_| destructuring(Default::default()),
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_assignment_expression_pattern,
    r#"
var z = {};
var { x: { y } = {} } = z;

"#,
    r#"
var z = {};
var tmp = z.x, y = (tmp === void 0 ? {} : tmp).y;
"#
);

// destructuring_object_advanced
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_object_advanced,
    r#"
var rect = {};
var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;
var { 3: foo, 5: bar } = [0, 1, 2, 3, 4, 5, 6];

"#,
    r#"
var rect = {};
var _rect_topLeft = rect.topLeft,
    x1 = _rect_topLeft.x,
    y1 = _rect_topLeft.y,
    _rect_bottomRight = rect.bottomRight,
    x2 = _rect_bottomRight.x,
    y2 = _rect_bottomRight.y;
var _ref = [0, 1, 2, 3, 4, 5, 6],
    foo = _ref[3],
    bar = _ref[5];
"#
);

// destructuring_spread
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_spread,
    r#"
function isSorted([x, y, ...wow]) {
  if (!zs.length) return true
  if (y > x) return isSorted(zs)
  return false
}

"#,
    r#"
function isSorted(param) {
  var _param = _to_array(param),
    x = _param[0],
    y = _param[1],
    wow = _param.slice(2);

  if (!zs.length) return true;
  if (y > x) return isSorted(zs);
  return false;
}

"#
);

// destructuring_mixed
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_mixed,
    r#"
var rect = {};
var {topLeft: [x1, y1], bottomRight: [x2, y2] } = rect;

"#,
    r#"
var rect = {};

var _rect_topLeft = _sliced_to_array(rect.topLeft, 2),
    x1 = _rect_topLeft[0],
    y1 = _rect_topLeft[1],
    _rect_bottomRight = _sliced_to_array(rect.bottomRight, 2),
    x2 = _rect_bottomRight[0],
    y2 = _rect_bottomRight[1];
"#
);

// destructuring_assignment_statement
test!(
    syntax(),
    |_| chain!(
        destructuring(Default::default()),
        spread(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default())
    ),
    destructuring_assignment_statement_no_loose,
    r#"
[a, b] = f();
"#,
    r#"
            var ref;
ref = _sliced_to_array(f(), 2), a = ref[0], b = ref[1], ref;
"#
);

// destructuring_assignment_statement_loose
test!(
    syntax(),
    |_| chain!(
        destructuring(Config { loose: true }),
        spread(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default())
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_array,
    r#"
var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];
[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];

"#,
    r#"
var a = "hello",
    _ref = [", ", "junk"],
    b = _ref[0],
    c = "world";
var ref, ref1;
    a = "hello",
    ref = [", ", "junk"],
    b = ref[0],
    ref,
    ref1 = ["world"],
    c = ref1[0],
    ref1;
"#
);

// destructuring_assignment_arrow_function_no_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            object_rest_spread(Default::default()),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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

var _key = prefix + 'state',
    _key1 = `${prefix}consents`,
    givenName = input.given_name,
    lastName = input['last_name'],
    country = input[`country`],
    state = input[_key],
    consents = input[_key1],
    rest = _object_without_properties(input, ["given_name", 'last_name', `country`, _key, _key1].map(_to_property_key));


"#
);

// destructuring_number_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| chain!(
        object_rest_spread(Default::default()),
        destructuring(Default::default())
    ),
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
        spread(Default::default()),
        destructuring(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default()),
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
for(var _$ref in obj){
    var _ref = _sliced_to_array(_$ref, 2), name = _ref[0], value = _ref[1];
    print("Name: " + name + ", Value: " + value);
}
var _$ref1;
for(ref in obj){
    _$ref1 = _sliced_to_array(ref, 2), name = _$ref1[0], value = _$ref1[1], _$ref1;
    print("Name: " + name + ", Value: " + value);
}"#
);

// destructuring_for_in_loose
test!(
    syntax(),
    |_| chain!(
        spread(Default::default()),
        destructuring(Config { loose: true }),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default()),
    ),
    destructuring_for_in_loose,
    r#"
for (var [name, value] in obj) {
  print("Name: " + name + ", Value: " + value);
}

for ([name, value] in obj) {
  print("Name: " + name + ", Value: " + value);
}

"#,
    r#"
for(var _$ref in obj){
    var name = _$ref[0], value = _$ref[1];
    print("Name: " + name + ", Value: " + value);
}
var _$ref1;
for(ref in obj){
    _$ref1 = ref, name = _$ref1[0], value = _$ref1[1], _$ref1;
    print("Name: " + name + ", Value: " + value);
}"#
);

// destructuring_issue_5744
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default()),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
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

test!(
    syntax(),
    |_| tr(),
    custom_call,
    "foo([a, b] = [1, 2])",
    "var ref;
foo((ref = [1, 2], a = ref[0], b = ref[1], ref));"
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_1,
    "
    const [ { a: a_ = 1 } ] = b
    ",
    "
    const _b_ = b[0], tmp = _b_.a, a_ = tmp === void 0 ? 1 : tmp;
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_2,
    "
    async function f(a, b) {
        const [ { a: a_ = 1 } ] = JSON.parse(b)
      }
    ",
    "
    async function f(a, b) {
        const _JSON_parse = JSON.parse(b), _JSON_parse_ = _JSON_parse[0], tmp = _JSON_parse_.a, a_ \
     = tmp === void 0 ? 1 : tmp;
    }
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_3,
    "
    const [ a = 1 ] = b
    ",
    "
    const tmp = b[0], a = tmp === void 0 ? 1 : tmp;
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_4,
    "
    [ a = 1 ] = b
    ",
    "
    var ref, ref1;
    ref = b, ref1 = ref[0], a = ref1 === void 0 ? 1 : ref1, ref;
    "
);

test!(
    syntax(),
    |_| tr(),
    next_001,
    "
    const { NODE_ENV }= process.env;
    ",
    "
    const NODE_ENV = process.env.NODE_ENV;
    "
);

test!(
    syntax(),
    |_| tr(),
    next_002,
    "
    ({ NODE_ENV }= process.env);
    ",
    "
    NODE_ENV = process.env.NODE_ENV;
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_1,
    "\
    var baz = 1;
    ({ foo: bar = baz } = {});
    ",
    "\
    var baz = 1;
    var ref, ref1;
    ref = {}, ref1 = ref.foo, bar = ref1 === void 0 ? baz : ref1, ref;
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_2,
    "\
    var baz = 1;
    [bar = baz] = [];    
    ",
    "\
    var baz = 1;
    var ref, ref1;
    ref = [], ref1 = ref[0], bar = ref1 === void 0 ? baz : ref1, ref;
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole,
    "\
    let [x = 23] = [,];

    assert.sameValue(x, 23);
    ",
    "\
    let x = 23;
    assert.sameValue(x, 23);
   "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole_2,
    "\
    let y = [x = 23] = [,];
    ",
    "\
    var ref, ref1;
    let y = (ref = [,], ref1 = ref[0], x = ref1 === void 0 ? 23 : ref1, ref);
   "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole,
    "\
    const [x = 23] = [,];

    assert.sameValue(x, 23);
    ",
    "\
    const x = 23;
    assert.sameValue(x, 23);
   "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_2,
    "const [x = 23, y = 42] = [,,];",
    "const x = 23, y = 42;"
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_3,
    "const [x = 23, y] = [, 42];",
    "const x = 23, y = 42;"
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_4,
    "\
    function* foo() {
        yield 1;
        yield 2;
      }
      
      let bar = foo();
      
      const [x = bar.next().value, y] = [, bar.next().value];
      console.log(x, y);
      ",
    "\
    function* foo() {
        yield 1;
        yield 2;
    }
    let bar = foo();
    const _ref = [,bar.next().value], tmp = _ref[0],
    x = tmp === void 0 ? bar.next().value : tmp, y = _ref[1];
    console.log(x, y);"
);

test!(
    syntax(),
    |_| tr(),
    for_const_dstr_ary_ptrn_elem_id_init_hole,
    "\
    var iterCount = 0;

    for (const [x = 23] = [,]; iterCount < 1; ) {
      assert.sameValue(x, 23);
      // another statement
    
      iterCount += 1;
    }
    
    assert.sameValue(iterCount, 1, 'Iteration occurred as expected');
    ",
    "\
    var iterCount = 0;
    for(const x = 23; iterCount < 1;){
        assert.sameValue(x, 23);
        iterCount += 1;
    }
    assert.sameValue(iterCount, 1, 'Iteration occurred as expected');
   "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_id_init_hole,
    "\
    const [x] = [,];
    const [y] = [,], [z] = [,]
    ",
    "\
    const x = void 0;
    const y = void 0, z = void 0;
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_id_init_hole,
    "let [x] = [,];",
    "let x;"
);

test!(
    syntax(),
    |_| tr(),
    issue_6304,
    "let [] = [];",
    "let _ref = [];"
);

test!(
    syntax(),
    |_| tr(),
    issue_6304_1,
    "let [] = [,];",
    "let _ref = [,];"
);

test!(
    syntax(),
    |_| tr(),
    issue_6304_2,
    "let [] = [...[1, 2, 3]];",
    "let _ref = [...[1, 2, 3]];"
);

test_exec!(
    syntax(),
    |_| tr(),
    issue_7418,
    r###"
    const truc = { as: "OK"}

    function x(as) {
        return function g() {
        const { as } = truc
        console.log(as)
        }
        as
    }

    x()();
    "###
);
