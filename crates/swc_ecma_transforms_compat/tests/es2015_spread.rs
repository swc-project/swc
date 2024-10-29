use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{block_scoping, parameters, spread};
use swc_ecma_transforms_testing::{test, test_exec};

fn syntax() -> ::swc_ecma_parser::Syntax {
    Default::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        parameters(Default::default(), unresolved_mark),
        spread(Default::default()),
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_270,
    "instance[name](...args);"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call,
    "ca(a, b, c, ...d, e)"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_multi_spread,
    "ca(a, b, ...d, e, f, ...h)"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_noop,
    "ca(a, b, c, d, e)"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array,
    "[a, b, c, ...d, e]"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array_empty,
    "[a,, b, c, ...d,,, e]"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_new_noop,
    "new C(a, b, c, c, d, e)"
);

// this_context
test!(
    syntax(),
    |_| tr(),
    this_context,
    r#"
var obj = {
  foo: function foo() {
    this.bar(...arguments)
    this.blah(...arguments)
  }
}

"#
);

// arguments_array
test!(
    syntax(),
    |_| tr(),
    arguments_array,
    r#"
function foo() {
  return bar([...arguments]);
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);

// single_exec
test_exec!(
    syntax(),
    |_| tr(),
    single_exec,
    r#"
// test that toConsumableArray clones the array.
const arr = [];
const foo = () => arr;

const x = [...foo()];

expect(x).not.toBe(arr);

"#
);

// arguments_concat
test!(
    syntax(),
    |_| tr(),
    arguments_concat,
    r#"
function foo() {
  return bar("test", ...arguments);
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);

// contexted_method_call_super_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_method_call_super_multiple_args,
    r#"
class Foo {
	bar() {
		super.bar(arg1, arg2, ...args);
	}
}

"#
);

// array_literal_first
test!(
    syntax(),
    |_| tr(),
    array_literal_first,
    r#"
var lyrics = [...parts, "head", "and", "toes"];

"#
);

// regression_t6761
test!(
    syntax(),
    |_| tr(),
    regression_t6761,
    r#"
function fn(){}

var args = [1, 2, 3];
var obj = {obj: {fn}};

switch (true){
    case true:
        obj.obj.fn(...args);
        break;
}

"#
);

// method_call_middle
test!(
    syntax(),
    |_| tr(),
    method_call_middle,
    r#"
add(foo, ...numbers, bar);

"#
);

// contexted_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_method_call_multiple_args,
    r#"
foob.add(foo, bar, ...numbers);
foob.test.add(foo, bar, ...numbers);

"#
);

// contexted_computed_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_computed_method_call_multiple_args,
    r#"
obj[method](foo, bar, ...args);

"#
);

// regression_6647

// method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    method_call_multiple_args,
    r#"
add(foo, bar, ...numbers);

"#
);

// array_literal_middle
test!(
    syntax(),
    |_| tr(),
    array_literal_middle,
    r#"
var a = [b, ...c, d];

"#
);

// array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    array_literal_with_hole,
    r#"
var arr = [ 'a',, 'b', ...c ];

"#
);

// regression_issue_8907
test!(
    syntax(),
    |_| tr(),
    regression_issue_8907_modified,
    r#"
const arr = [];

arr.concat = () => {
    throw new Error('Should not be called');
};

const x = [...arr];

"#
);

// regression_issue_8907
test!(
    // Cost is too high
    ignore,
    syntax(),
    |_| tr(),
    regression_issue_8907,
    r#"
const arr = [];

arr.concat = () => {
    throw new Error('Should not be called');
};

const x = [...arr];

"#
);

// method_call_multiple
test!(
    syntax(),
    |_| tr(),
    method_call_multiple,
    r#"
add(foo, ...numbers, bar, what, ...test);

"#
);

// arguments
test!(
    syntax(),
    |_| tr(),
    arguments,
    r#"
function foo() {
  return bar(...arguments);
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);

// regression_issue_8907_exec
test_exec!(
    syntax(),
    |_| tr(),
    regression_issue_8907_exec,
    r#"
const arr = [];

arr.concat = () => {
    throw new Error('Should not be called');
};
let x;
expect(() => {
    x = [...arr];
}).not.toThrow();

expect(x).not.toBe(arr);

"#
);

// array_literal_multiple
test!(
    syntax(),
    |_| tr(),
    array_literal_multiple,
    r#"
var a = [b, ...c, d, e, ...f];

"#
);

// arguments_array_exec
test_exec!(
    syntax(),
    |_| tr(),
    arguments_array_exec,
    r#"
// test that toConsumableArray clones the array.

function foo() {
  const x = [...arguments];

  expect(x).not.toBe(arguments);
}

foo(1,2);

"#
);

// array_literals
test!(
    syntax(),
    |_| tr(),
    array_literals,
    r#"
var lyrics = ["head", "and", "toes", ...parts];

"#
);

// regression

// spread_new_expression
test!(
    syntax(),
    |_| tr(),
    spread_new_expression,
    r#"
new Numbers(...nums);
new Numbers(1, ...nums);

"#
);

// spread_array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_with_hole,
    r#"
var arr = [ 'a',, 'b', ...c ];

"#
);

// spread_single
test_exec!(
    syntax(),
    |_| tr(),
    spread_single_exec,
    r#"
// test that toConsumableArray clones the array.
const arr = [];
const foo = () => arr;

const x = [...foo()];

expect(x).not.toBe(arr);

"#
);

// spread_contexted_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_multiple_args,
    r#"
foob.add(foo, bar, ...numbers);
foob.test.add(foo, bar, ...numbers);

"#
);

// spread_method_call_array_literal
test!(
    syntax(),
    |_| tr(),
    spread_method_call_array_literal,
    r#"
f(...[1, 2, 3]);

"#
);

// spread_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_method_call_single_arg,
    r#"
add(...numbers);

"#
);

// spread_known_rest
test!(
    // Cost is too high.
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
            spread(Default::default()),
            block_scoping(unresolved_mark),
        )
    },
    spread_known_rest,
    r#"
function foo(...bar) {
  return [...bar];
}

"#
);

// spread_method_call_middle
test!(
    syntax(),
    |_| tr(),
    spread_method_call_middle,
    r#"
add(foo, ...numbers, bar);

"#
);

// spread_method_call_first
test!(
    syntax(),
    |_| tr(),
    spread_method_call_first,
    r#"
add(...numbers, foo, bar);

"#
);

// spread_contexted_method_call_super_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_super_single_arg,
    r#"
class Foo {
	bar() {
		super.bar(...args);
	}
}

"#
);

// spread_contexted_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_single_arg,
    r#"
foob.add(...numbers);
foob.test.add(...numbers);

"#
);

// spread_array_literal_middle
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_middle,
    r#"
var a = [b, ...c, d];

"#
);

// spread_array_literals
test!(
    syntax(),
    |_| tr(),
    spread_array_literals,
    r#"
var lyrics = ["head", "and", "toes", ...parts];

"#
);

// regression_10416
test!(
    syntax(),
    |_| tr(),
    regression_10416,
    r#"
const E_ARR = [];

export default function () {
  const someVar = E_ARR;
  return [...someVar];
}
"#
);

// spread_method_call_multiple
test!(
    syntax(),
    |_| tr(),
    spread_method_call_multiple,
    r#"
add(foo, ...numbers, bar, what, ...test);

"#
);

// spread_arguments
test!(
    syntax(),
    |_| tr(),
    spread_arguments,
    r#"
function foo() {
  return bar(...arguments);
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);

// spread_contexted_method_call_super_multiple_args
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_super_multiple_args,
    r#"
class Foo {
	bar() {
		super.bar(arg1, arg2, ...args);
	}
}

"#
);

// spread_contexted_computed_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_computed_method_call_single_arg,
    r#"
obj[method](...args);

"#
);

// spread_arguments_concat
test!(
    syntax(),
    |_| tr(),
    spread_arguments_concat,
    r#"
function foo() {
  return bar("test", ...arguments);
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);

test!(
    syntax(),
    |_| tr(),
    spread_string_literial,
    "
    String.raw({ raw: 'abcd' }, ...'___');
    "
);

test!(
    syntax(),
    |_| tr(),
    spread_string_literial_2,
    "
    f({ x: 0 }, ...[1, 2], [3], ...'456');
    "
);

test!(
    syntax(),
    |_| tr(),
    spread_literial,
    r#"
    f(1, ...[2, 3], ...[...[4, 5]], ...[6, ...[7]]);
    f(1, ..."123", ...[..."456", ..."789"]);
    "#
);

test!(
    syntax(),
    |_| tr(),
    spread_literial_init_hole,
    r#"
    f(1, ...[2, , 3], ...[...[4, ,]]);
    f(...[2, , 3], ...[...[4, ,]]);
    "#
);
