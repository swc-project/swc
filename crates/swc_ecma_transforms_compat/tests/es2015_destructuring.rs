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
    include_str!("inline-inputs/es2015_destructuring/issue_2819/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_2821,
    include_str!("inline-inputs/es2015_destructuring/issue_2821/input.js")
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    need_to_array,
    include_str!("inline-inputs/es2015_destructuring/need_to_array/input.js")
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    need_to_array_loose,
    include_str!("inline-inputs/es2015_destructuring/need_to_array_loose/input.js")
);

test!(
    syntax(),
    |_| destructuring(Config { loose: false }),
    issue_2841,
    include_str!("inline-inputs/es2015_destructuring/issue_2841/input.js")
);

test!(
    syntax(),
    |_| destructuring(Config { loose: true }),
    issue_2841_loose,
    include_str!("inline-inputs/es2015_destructuring/issue_2841_loose/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_169,
    include_str!("inline-inputs/es2015_destructuring/issue_169/input.js")
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    issue_1948,
    include_str!("inline-inputs/es2015_destructuring/issue_1948/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_260_01,
    include_str!("inline-inputs/es2015_destructuring/issue_260_01/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_2,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_3,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_3/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_4,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_4/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_5,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_5/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_6,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_6/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array_pat_assign_prop_binding_7,
    include_str!("inline-inputs/es2015_destructuring/array_pat_assign_prop_binding_7/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_260_02,
    include_str!("inline-inputs/es2015_destructuring/issue_260_02/input.js")
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop,
    include_str!("inline-inputs/es2015_destructuring/object_pat_assign_prop/input.js")
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_2,
    include_str!("inline-inputs/es2015_destructuring/object_pat_assign_prop_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding,
    include_str!("inline-inputs/es2015_destructuring/object_pat_assign_prop_binding/input.js")
);

test!(
    syntax(),
    |_| tr(),
    object_pat_assign_prop_binding_2,
    include_str!("inline-inputs/es2015_destructuring/object_pat_assign_prop_binding_2/input.js")
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
    include_str!(
        "inline-inputs/es2015_destructuring/object_pat_assign_prop_binding_isseu_2850/input.js"
    )
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
    include_str!("inline-inputs/es2015_destructuring/obj_assign_pat/input.js")
);

test!(
    syntax(),
    |_| tr(),
    obj_assign_expr,
    include_str!("inline-inputs/es2015_destructuring/obj_assign_expr/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array1,
    include_str!("inline-inputs/es2015_destructuring/array1/input.js")
);

test!(
    syntax(),
    |_| tr(),
    array2,
    include_str!("inline-inputs/es2015_destructuring/array2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_completion_record,
    include_str!("inline-inputs/es2015_destructuring/assign_expr_completion_record/input.js")
);

test!(
    syntax(),
    |_| tr(),
    assign_expr_pat,
    include_str!("inline-inputs/es2015_destructuring/assign_expr_pat/input.js")
);

test!(
    syntax(),
    |_| tr(),
    assign_expr,
    include_str!("inline-inputs/es2015_destructuring/assign_expr/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/empty/input.js")
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    es7_object_rest_builtins,
    include_str!("inline-inputs/es2015_destructuring/es7_object_rest_builtins/input.js")
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    es7_object_rest,
    include_str!("inline-inputs/es2015_destructuring/es7_object_rest/input.js")
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_1,
    include_str!("inline-inputs/es2015_destructuring/export_variable_issue_2858_1/input.js")
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_2,
    include_str!("inline-inputs/es2015_destructuring/export_variable_issue_2858_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    export_variable_issue_2858_3,
    include_str!("inline-inputs/es2015_destructuring/export_variable_issue_2858_3/input.js")
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    export_variable,
    include_str!("inline-inputs/es2015_destructuring/export_variable/input.js")
);

test!(
    syntax(),
    |_| tr(),
    for_in,
    include_str!("inline-inputs/es2015_destructuring/for_in/input.js")
);

test!(
    syntax(),
    |_| tr(),
    for_let,
    include_str!("inline-inputs/es2015_destructuring/for_let/input.js")
);

test!(
    syntax(),
    |_| tr(),
    for_of,
    include_str!("inline-inputs/es2015_destructuring/for_of/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/babel_issue_3081/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/babel_issue_5628/input.js")
);

test!(
    syntax(),
    |_| tr(),
    babel_issue_5744,
    include_str!("inline-inputs/es2015_destructuring/babel_issue_5744/input.js")
);

test!(
    ignore,
    syntax(),
    |_| tr(),
    babel_issue_6373,
    include_str!("inline-inputs/es2015_destructuring/babel_issue_6373/input.js")
);

test!(
    syntax(),
    |_| tr(),
    known_array,
    include_str!("inline-inputs/es2015_destructuring/known_array/input.js")
);

test!(
    syntax(),
    |_| tr(),
    member_expr,
    include_str!("inline-inputs/es2015_destructuring/member_expr/input.js")
);

test!(
    syntax(),
    |_| tr(),
    multiple,
    include_str!("inline-inputs/es2015_destructuring/multiple/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/spread_test/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_311,
    include_str!("inline-inputs/es2015_destructuring/issue_311/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_317,
    include_str!("inline-inputs/es2015_destructuring/issue_317/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_336,
    include_str!("inline-inputs/es2015_destructuring/issue_336/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_404_1,
    include_str!("inline-inputs/es2015_destructuring/issue_404_1/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/issue_404_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_404_3,
    include_str!("inline-inputs/es2015_destructuring/issue_404_3/input.js")
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
    include_str!("inline-inputs/es2015_destructuring/regression_8528/input.js")
);

// destructuring_for_of
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            spread(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_for_of,
    include_str!("inline-inputs/es2015_destructuring/destructuring_for_of/input.js")
);

// destructuring_object_basic
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_object_basic,
    include_str!("inline-inputs/es2015_destructuring/destructuring_object_basic/input.js")
);

// destructuring_assignment_arrow_function_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_assignment_arrow_function_block,
    include_str!(
        "inline-inputs/es2015_destructuring/destructuring_assignment_arrow_function_block/input.js"
    )
);

// destructuring_non_iterable
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_parameters,
    include_str!("inline-inputs/es2015_destructuring/destructuring_parameters/input.js")
);

// destructuring_array_unpack_optimisation
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_array_unpack_optimisation,
    include_str!(
        "inline-inputs/es2015_destructuring/destructuring_array_unpack_optimisation/input.js"
    )
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_known_array,
    include_str!("inline-inputs/es2015_destructuring/destructuring_known_array/input.js")
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_es7_object_rest,
    include_str!("inline-inputs/es2015_destructuring/destructuring_es7_object_rest/input.js")
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_assignment_expression_pattern,
    include_str!(
        "inline-inputs/es2015_destructuring/destructuring_assignment_expression_pattern/input.js"
    )
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_object_advanced,
    include_str!("inline-inputs/es2015_destructuring/destructuring_object_advanced/input.js")
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_spread,
    include_str!("inline-inputs/es2015_destructuring/destructuring_spread/input.js")
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    destructuring_mixed,
    include_str!("inline-inputs/es2015_destructuring/destructuring_mixed/input.js")
);

// destructuring_assignment_statement
test!(
    syntax(),
    |_| (
        destructuring(Default::default()),
        spread(Default::default(), Mark::new()),
        block_scoping(Mark::new()),
        object_rest_spread(Default::default())
    ),
    destructuring_assignment_statement_no_loose,
    include_str!(
        "inline-inputs/es2015_destructuring/destructuring_assignment_statement_no_loose/input.js"
    )
);

// destructuring_assignment_statement_loose
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            destructuring(Config { loose: true }),
            spread(Default::default(), unresolved_mark),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_assignment_statement,
    include_str!("inline-inputs/es2015_destructuring/destructuring_assignment_statement/input.js")
);

// destructuring_array
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_array,
    include_str!("inline-inputs/es2015_destructuring/destructuring_array/input.js")
);

// destructuring_assignment_arrow_function_no_block
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_assignment_arrow_function_no_block,
    include_str!(
        "inline-inputs/es2015_destructuring/destructuring_assignment_arrow_function_no_block/\
         input.js"
    )
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
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_issue_9834,
    include_str!("inline-inputs/es2015_destructuring/destructuring_issue_9834/input.js")
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
    |_| {
        let unresolved_mark = Mark::new();
        (
            spread(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_for_in,
    include_str!("inline-inputs/es2015_destructuring/destructuring_for_in/input.js")
);

// destructuring_for_in_loose
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            spread(Default::default(), unresolved_mark),
            destructuring(Config { loose: true }),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_for_in_loose,
    include_str!("inline-inputs/es2015_destructuring/destructuring_for_in_loose/input.js")
);

// destructuring_issue_5744
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
            block_scoping(unresolved_mark),
            object_rest_spread(Default::default()),
        )
    },
    destructuring_issue_5744,
    include_str!("inline-inputs/es2015_destructuring/destructuring_issue_5744/input.js")
);

// destructuring_spread_generator
test_exec!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            spread(Default::default(), unresolved_mark),
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
    include_str!("inline-inputs/es2015_destructuring/custom_call/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_1,
    include_str!("inline-inputs/es2015_destructuring/issue_1477_1/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_2,
    include_str!("inline-inputs/es2015_destructuring/issue_1477_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_3,
    include_str!("inline-inputs/es2015_destructuring/issue_1477_3/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_1477_4,
    include_str!("inline-inputs/es2015_destructuring/issue_1477_4/input.js")
);

test!(
    syntax(),
    |_| tr(),
    next_001,
    include_str!("inline-inputs/es2015_destructuring/next_001/input.js")
);

test!(
    syntax(),
    |_| tr(),
    next_002,
    include_str!("inline-inputs/es2015_destructuring/next_002/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_1,
    include_str!("inline-inputs/es2015_destructuring/issue_3315_1/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_3315_2,
    include_str!("inline-inputs/es2015_destructuring/issue_3315_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_let_dstr_ary_ptrn_elem_id_init_hole/input.\
         js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_let_dstr_ary_ptrn_elem_id_init_hole_2,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_let_dstr_ary_ptrn_elem_id_init_hole_2/\
         input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_const_dstr_ary_ptrn_elem_id_init_hole/\
         input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_2,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_const_dstr_ary_ptrn_elem_id_init_hole_2/\
         input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_3,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_const_dstr_ary_ptrn_elem_id_init_hole_3/\
         input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_const_dstr_ary_ptrn_elem_id_init_hole_4,
    include_str!(
        "inline-inputs/es2015_destructuring/statements_const_dstr_ary_ptrn_elem_id_init_hole_4/\
         input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    for_const_dstr_ary_ptrn_elem_id_init_hole,
    include_str!(
        "inline-inputs/es2015_destructuring/for_const_dstr_ary_ptrn_elem_id_init_hole/input.js"
    )
);

test!(
    syntax(),
    |_| tr(),
    statements_const_id_init_hole,
    include_str!("inline-inputs/es2015_destructuring/statements_const_id_init_hole/input.js")
);

test!(
    syntax(),
    |_| tr(),
    statements_let_id_init_hole,
    include_str!("inline-inputs/es2015_destructuring/statements_let_id_init_hole/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_6304,
    include_str!("inline-inputs/es2015_destructuring/issue_6304/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_6304_1,
    include_str!("inline-inputs/es2015_destructuring/issue_6304_1/input.js")
);

test!(
    syntax(),
    |_| tr(),
    issue_6304_2,
    include_str!("inline-inputs/es2015_destructuring/issue_6304_2/input.js")
);

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
