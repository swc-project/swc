mod common;

use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{
        block_scoping,
        destructuring::{destructuring, Config},
        parameters, spread,
    },
    es2018::object_rest_spread,
};
use swc_ecma_transforms_testing::{test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

fn tr() -> impl Pass {
    (
        resolver(Mark::new(), Mark::new(), false),
        destructuring(Config { loose: true }),
    )
}

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

test_exec!(
    ignore,
    syntax(),
    |_| destructuring(Config { loose: true }),
    fn_key_with_obj_rest_spread,
    r#"const { [(() => 1)()]: a, ...rest } = { 1: "a" };

expect(a).toBe("a");
expect(rest).toEqual({});"#
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

// destructuring_for_of

// destructuring_object_basic

// destructuring_assignment_arrow_function_block

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

// destructuring_array_unpack_optimisation

// destructuring_known_array

// destructuring_es7_object_rest

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

// destructuring_object_advanced

// destructuring_spread

// destructuring_mixed

// destructuring_assignment_statement

// destructuring_assignment_statement_loose

// destructuring_array

// destructuring_assignment_arrow_function_no_block

// destructuring_issue_9834

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

// destructuring_for_in_loose

// destructuring_issue_5744

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

// Pipeline directories have their own runner; update this exclusion when adding
// one.
#[testing::fixture("tests/destructuring/**/input.js", exclude("/tests/destructuring/(destructuring|destructuring-loose|destructuring-spread-block-scoping-object-rest-spread|destructuring-spread-block-scoping-object-rest-spread-loose|resolver-es2015|resolver-object-rest-spread-spread-parameters-destructuring-block-scoping|resolver-object-rest-spread-spread-parameters-destructuring-block-scoping-object-rest-spread|resolver-spread-parameters-destructuring-block-scoping-object-rest-spread|spread-destructuring-block-scoping-object-rest-spread|spread-destructuring-block-scoping-object-rest-spread-loose)/"))]
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

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "resolver-spread-parameters-destructuring-block-scoping-object-rest-spread")]
    ResolverSpreadParametersDestructuringBlockScopingObjectRestSpread,
    #[serde(rename = "spread-destructuring-block-scoping-object-rest-spread")]
    SpreadDestructuringBlockScopingObjectRestSpread,
    #[serde(
        rename = "resolver-object-rest-spread-spread-parameters-destructuring-block-scoping-object-rest-spread"
    )]
    ResolverObjectRestSpreadSpreadParametersDestructuringBlockScopingObjectRestSpread,
    #[serde(rename = "destructuring-spread-block-scoping-object-rest-spread")]
    DestructuringSpreadBlockScopingObjectRestSpread,
    #[serde(rename = "destructuring-spread-block-scoping-object-rest-spread-loose")]
    DestructuringSpreadBlockScopingObjectRestSpreadLoose,
    #[serde(rename = "spread-destructuring-block-scoping-object-rest-spread-loose")]
    SpreadDestructuringBlockScopingObjectRestSpreadLoose,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/destructuring/destructuring-spread-block-scoping-object-rest-spread/**/input.js"
)]
#[testing::fixture(
    "tests/destructuring/destructuring-spread-block-scoping-object-rest-spread-loose/**/input.js"
)]
#[testing::fixture(
    "tests/destructuring/\
     resolver-object-rest-spread-spread-parameters-destructuring-block-scoping-object-rest-spread/\
     **/input.js"
)]
#[testing::fixture(
    "tests/destructuring/\
     resolver-spread-parameters-destructuring-block-scoping-object-rest-spread/**/input.js"
)]
#[testing::fixture(
    "tests/destructuring/spread-destructuring-block-scoping-object-rest-spread/**/input.js"
)]
#[testing::fixture(
    "tests/destructuring/spread-destructuring-block-scoping-object-rest-spread-loose/**/input.js"
)]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
            CasePipeline::ResolverSpreadParametersDestructuringBlockScopingObjectRestSpread => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , spread (Default :: default () , unresolved_mark) , parameters (Default :: default () , unresolved_mark) , destructuring (Default :: default ()) , block_scoping (unresolved_mark) , object_rest_spread (Default :: default ()) ,) }),
            CasePipeline::SpreadDestructuringBlockScopingObjectRestSpread => Box::new({ let unresolved_mark = Mark :: new () ; (spread (Default :: default () , unresolved_mark) , destructuring (Default :: default ()) , block_scoping (unresolved_mark) , object_rest_spread (Default :: default ()) ,) }),
            CasePipeline::ResolverObjectRestSpreadSpreadParametersDestructuringBlockScopingObjectRestSpread => Box::new({ let unresolved_mark = Mark :: new () ; let top_level_mark = Mark :: new () ; (resolver (unresolved_mark , top_level_mark , false) , object_rest_spread (Default :: default ()) , spread (Default :: default () , unresolved_mark) , parameters (Default :: default () , unresolved_mark) , destructuring (Default :: default ()) , block_scoping (unresolved_mark) , object_rest_spread (Default :: default ()) ,) }),
            CasePipeline::DestructuringSpreadBlockScopingObjectRestSpread => Box::new((destructuring (Default :: default ()) , spread (Default :: default () , Mark :: new ()) , block_scoping (Mark :: new ()) , object_rest_spread (Default :: default ()))),
            CasePipeline::DestructuringSpreadBlockScopingObjectRestSpreadLoose => Box::new({ let unresolved_mark = Mark :: new () ; (destructuring (Config { loose : true }) , spread (Default :: default () , unresolved_mark) , block_scoping (unresolved_mark) , object_rest_spread (Default :: default ()) ,) }),
            CasePipeline::SpreadDestructuringBlockScopingObjectRestSpreadLoose => Box::new({ let unresolved_mark = Mark :: new () ; (spread (Default :: default () , unresolved_mark) , destructuring (Config { loose : true }) , block_scoping (unresolved_mark) , object_rest_spread (Default :: default ()) ,) }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
