use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
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
use swc_ecma_transforms_testing::{test, test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Pass {
    (
        resolver(Mark::new(), Mark::new(), false),
        destructuring(Config { loose: true }),
    )
}

test!(
    syntax(),
    |_| tr(),
    issue_2819,
    r#"const [first, , third] = ["red", "yellow", "green"]"#
);

test!(
    syntax(),
    |_| tr(),
    issue_2821,
    r#"const [x, y, ...z] = [1];"#
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    need_to_array,
    r#"const [x, y, ...z] = o;"#
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    need_to_array_loose,
    r#"const [x, y, ...z] = o;"#
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    issue_2841,
    r#"function foo(a,b)
    {
        [a,b,...restParam] = arguments;
    }"#
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    issue_2841_loose,
    r#"function foo(a,b)
    {
        [a,b,...restParam] = arguments;
    }"#
);

test!(
    syntax(),
    |_| tr(),
    issue_169,
    "export class Foo {
	func(a, b = Date.now()) {
		return {a};
	}
}"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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
    }"
);

test!(syntax(), |_| tr(), issue_260_01, "[code = 1] = []");

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding,
    "[code = 1] = [1]"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_2,
    "[foo = 1, bar = 2] = [3];"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_3,
    "[foo = 1, bar = 2] = [3, 4];"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_4,
    "const [foo = 1] = [2];"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_5,
    "const [foo = 1, bar] = [2, 3];"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_6,
    "const [foo = 1] = [];"
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_7,
    "const [foo = 1] = [1, 2];"
);

test!(
    syntax(),
    |_| tr(),
    issue_260_02,
    "[code = 1, ...rest] = [];"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop,
    "({code = 1} = {})"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_2,
    "const {code = 1} = {}"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding,
    "({foo: bar = 1} = {})"
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_2,
    "const {foo: bar = 1} = {}"
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
    "const obj = { foo = 123, bar: x = 123 } = { foo: 24, bar: 45 };"
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

test!(syntax(), |_| tr(), obj_assign_pat, r#"let { a = 1 } = foo"#);

test!(
    syntax(),
    |_| tr(),
    obj_assign_expr,
    r#"let a;
[{ a = 1 }] = foo"#
);

test!(
    syntax(),
    |_| tr(),
    array1,
    r#"var [a, [b], [c]] = ["hello", [" ", "junk"], ["world"]];"#
);

test!(
    syntax(),
    |_| tr(),
    array2,
    r#"[a, [b], [c]] = ["hello", [" ", "junk"], ["world"]];"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_completion_record,
    r#"var x, y;
[x, y] = [1, 2];"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_pat,
    r#"var z = {};
var { x: { y } = {} } = z;"#
);

test!(
    syntax(),
    |_| tr(),
    assign_expr,
    r#"console.log([x] = [123]);"#
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
    r#"var [, a, [b], [c], d] = ["foo", "hello", [" ", "junk"], ["world"]];"#
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

({ x, y, ...z } = o);"#
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

({ x, y, ...z } = o);"#
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_1,
    r#"export const { a: a2, b: b2 } = { a: 1, b: 2 };"#
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_2,
    r#"export const { a: b } = { a: 1 }"#
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
"#
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    export_variable,
    r#"export let {a, b, c: {d, e: {f = 4}}} = {};"#
);

test!(
    syntax(),
    |_| tr(),
    for_in,
    r#"for (var [name, value] in obj) {
  print("Name: " + name + " Value: " + value);
}"#
);

test!(
    syntax(),
    |_| tr(),
    for_let,
    r#"for (let [ i, n ] = range; ; ) {}"#
);

test!(
    syntax(),
    |_| tr(),
    for_of,
    r#"for (var [ name, before, after ] of test.expectation.registers) {

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
}"#
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
})();"#
);

test!(
    syntax(),
    |_| tr(),
    babel_issue_5744,
    r#"if (true) [a, b] = [b, a];"#
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    babel_issue_6373,
    r#"import { NestedObjects } from "./some-module"

const { Foo, Bar } = NestedObjects"#
);

test!(
    syntax(),
    |_| tr(),
    known_array,
    r#"var z = [];
var [x, ...y] = z;"#
);

test!(
    syntax(),
    |_| tr(),
    member_expr,
    r#"[foo.foo, foo.bar] = [1, 2];"#
);

test!(
    syntax(),
    |_| tr(),
    multiple,
    r#"var coords = [1, 2];
var { x, y } = coords,
    foo = "bar";"#
);

test_exec!(
    ignore,
    syntax(),
    |_| destructuring(Config { loose: true }),
    number_key_with_object_spread,
    r#"const foo = {
  1: "a"
  2: "b"
  3: "c"
};

const { [1]: bar, ...rest } = foo;

expect(bar).toBe("a");
expect(rest).toEqual({ 2: "b" 3: "c" });"#
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
} = bar;"
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
] = [4,5,6];"
);

test!(
    syntax(),
    |_| tr(),
    issue_336,
    "const { 'foo-bar': fooBar } = baz;"
);

test!(
    syntax(),
    |_| tr(),
    issue_404_1,
    "function foo(bar) {
  const { foo } = bar;
  return foo;
}"
);

test!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default(),
            ),
        )
    },
    issue_404_2,
    "function foo(bar) {
  const { foo } = bar;
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
}"
);

// destructuring_function_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| (
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

"#
);

// destructuring_for_of
test!(
    syntax(),
    |_| (
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

"#
);

// destructuring_object_basic
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_assignment_arrow_function_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_non_iterable
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

        (
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

        (
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

        (
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

        (
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

        (
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
//"#
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
//z = _object_without_properties(_o, ["x" "y"]);
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

        (
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

console.log(unpackArray(["hello", " ", "world"], [1, 2, 3]));

"#
);

// destructuring_array_unpack_optimisation
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

        (
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

"#
);

// destructuring_es7_object_rest
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

        (
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

"#
);

// destructuring_object_advanced
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_spread
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_mixed
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_assignment_statement
test!(
    syntax(),
    |_| (
        destructuring(Default::default()),
        spread(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default())
    ),
    destructuring_assignment_statement_no_loose,
    r#"
[a, b] = f();
"#
);

// destructuring_assignment_statement_loose
test!(
    syntax(),
    |_| (
        destructuring(Config { loose: true }),
        spread(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default())
    ),
    destructuring_assignment_statement,
    r#"
[a, b] = f();
"#
);

// destructuring_array
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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
var [a, [b], [c]] = ["hello", [" ", "junk"], ["world"]];
[a, [b], [c]] = ["hello", [" ", "junk"], ["world"]];

"#
);

// destructuring_assignment_arrow_function_no_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_issue_9834
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_number_key_with_object_rest_spread
test_exec!(
    syntax(),
    |_| (
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
    |_| (
        spread(Default::default()),
        destructuring(Default::default()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default()),
    ),
    destructuring_for_in,
    r#"
for (var [name, value] in obj) {
  print("Name: " + name + " Value: " + value);
}

for ([name, value] in obj) {
  print("Name: " + name + " Value: " + value);
}

"#
);

// destructuring_for_in_loose
test!(
    syntax(),
    |_| (
        spread(Default::default()),
        destructuring(Config { loose: true }),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default()),
    ),
    destructuring_for_in_loose,
    r#"
for (var [name, value] in obj) {
  print("Name: " + name + " Value: " + value);
}

for ([name, value] in obj) {
  print("Name: " + name + " Value: " + value);
}

"#
);

// destructuring_issue_5744
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

"#
);

// destructuring_spread_generator
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
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

test!(syntax(), |_| tr(), custom_call, "foo([a, b] = [1, 2])");

test!(
    syntax(),
    |_| tr(),
    issue_1477_1,
    "
    const [ { a: a_ = 1 } ] = b
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
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_3,
    "
    const [ a = 1 ] = b
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_4,
    "
    [ a = 1 ] = b
    "
);

test!(
    syntax(),
    |_| tr(),
    next_001,
    "
    const { NODE_ENV }= process.env;
    "
);

test!(
    syntax(),
    |_| tr(),
    next_002,
    "
    ({ NODE_ENV }= process.env);
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_1,
    "\
    var baz = 1;
    ({ foo: bar = baz } = {});
    "
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_2,
    "\
    var baz = 1;
    [bar = baz] = [];    
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole,
    "\
    let [x = 23] = [,];

    assert.sameValue(x, 23);
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole_2,
    "\
    let y = [x = 23] = [,];
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole,
    "\
    const [x = 23] = [,];

    assert.sameValue(x, 23);
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_2,
    "const [x = 23, y = 42] = [,,];"
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_3,
    "const [x = 23, y] = [, 42];"
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
      "
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
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_const_id_init_hole,
    "\
    const [x] = [,];
    const [y] = [,], [z] = [,]
    "
);

test!(
    syntax(),
    |_| tr(),
    statements_let_id_init_hole,
    "let [x] = [,];"
);

test!(syntax(), |_| tr(), issue_6304, "let [] = [];");

test!(syntax(), |_| tr(), issue_6304_1, "let [] = [,];");

test!(syntax(), |_| tr(), issue_6304_2, "let [] = [...[1, 2, 3]];");

test_exec!(
    syntax(),
    |_| tr(),
    issue_7418,
    r#"
    const truc = { as: "OK"}

    function x(as) {
        return function g() {
        const { as } = truc
        console.log(as)
        }
        as
    }

    x()();
    "#
);

#[testing::fixture("tests/destructuring/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(Default::default()),
        &|_: &mut swc_ecma_transforms_testing::Tester<'_>| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                object_rest_spread(Default::default()),
                destructuring(Default::default()),
            )
        },
        &input,
        &output,
        Default::default(),
    )
}
