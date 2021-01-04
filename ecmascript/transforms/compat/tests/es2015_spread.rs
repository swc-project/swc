use swc_common::chain;
use swc_ecma_transforms_compat::es2015::block_scoping;
use swc_ecma_transforms_compat::es2015::parameters;
use swc_ecma_transforms_compat::es2015::spread;
use swc_ecma_transforms_compat::es2015::spread::Config;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn syntax() -> ::swc_ecma_parser::Syntax {
    Default::default()
}

fn tr() -> impl Fold {
    chain!(
        parameters(),
        spread(Config {
            ..Default::default()
        })
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_270,
    "instance[name](...args);",
    "var _instance;
(_instance = instance)[name].apply(_instance, _toConsumableArray(args));"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call,
    "ca(a, b, c, ...d, e)",
    "ca.apply(void 0, [a, b, c].concat(_toConsumableArray(d), [e]));"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_multi_spread,
    "ca(a, b, ...d, e, f, ...h)",
    "ca.apply(void 0, [a, b].concat(_toConsumableArray(d), [e, f], _toConsumableArray(h)));"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_noop,
    "ca(a, b, c, d, e)",
    "ca(a, b, c, d, e);"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array,
    "[a, b, c, ...d, e]",
    "[a, b, c].concat(_toConsumableArray(d), [e])"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array_empty,
    "[a,, b, c, ...d,,, e]",
    "[a,, b, c].concat(_toConsumableArray(d), [,, e])"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_new_noop,
    "new C(a, b, c, c, d, e)",
    "new C(a, b, c, c, d, e);"
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

"#,
    r#"
var obj = {
  foo: function foo() {
    this.bar.apply(this, arguments);
    this.blah.apply(this, arguments);
  }
};

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

"#,
    r#"
function foo() {
  return bar(Array.prototype.slice.call(arguments));
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

"#,
    r#"
function foo() {
  return bar.apply(void 0, ["test"].concat(Array.prototype.slice.call(arguments)));
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

"#,
    r#"
class Foo {
  bar() {
    super.bar.apply(this, [arg1, arg2].concat(_toConsumableArray(args)));
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

"#,
    r#"
var lyrics = _toConsumableArray(parts).concat(['head', 'and', 'toes']);

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

"#,
    r#"
var _obj;

function fn() {}

var args = [1, 2, 3];
var obj = {
  obj: {
    fn
  }
};

switch (true) {
  case true:
    (_obj = obj.obj).fn.apply(_obj, _toConsumableArray(args));

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

"#,
    r#"
add.apply(void 0, [foo].concat(_toConsumableArray(numbers), [bar]));

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

"#,
    r#"
var _foob, _test;

(_foob = foob).add.apply(_foob, [foo, bar].concat(_toConsumableArray(numbers)));

(_test = foob.test).add.apply(_test, [foo, bar].concat(_toConsumableArray(numbers)));

"#
);

// contexted_computed_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_computed_method_call_multiple_args,
    r#"
obj[method](foo, bar, ...args);

"#,
    r#"
var _obj;

(_obj = obj)[method].apply(_obj, [foo, bar].concat(_toConsumableArray(args)));

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

"#,
    r#"
add.apply(void 0, [foo, bar].concat(_toConsumableArray(numbers)));

"#
);

// array_literal_middle
test!(
    syntax(),
    |_| tr(),
    array_literal_middle,
    r#"
var a = [b, ...c, d];

"#,
    r#"
var a = [b].concat(_toConsumableArray(c), [d]);

"#
);

// array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    array_literal_with_hole,
    r#"
var arr = [ 'a',, 'b', ...c ];

"#,
    r#"
var arr = ['a',, 'b'].concat(_toConsumableArray(c));

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

"#,
    r#"
const arr = [];

arr.concat = () => {
  throw new Error('Should not be called');
};

const x = _toConsumableArray(arr);

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

"#,
    r#"
const arr = [];

arr.concat = () => {
  throw new Error('Should not be called');
};

const x = [].concat(arr);

"#
);

// method_call_multiple
test!(
    syntax(),
    |_| tr(),
    method_call_multiple,
    r#"
add(foo, ...numbers, bar, what, ...test);

"#,
    r#"
add.apply(void 0, [foo].concat(_toConsumableArray(numbers), [bar, what], _toConsumableArray(test)));

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

"#,
    r#"
function foo() {
  return bar.apply(void 0, arguments);
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

"#,
    r#"
var a = [b].concat(_toConsumableArray(c), [d, e], _toConsumableArray(f));

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

"#,
    r#"
var lyrics = ["head", "and", "toes"].concat(_toConsumableArray(parts));

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

"#,
    r#"
_construct(Numbers, _toConsumableArray(nums));
_construct(Numbers, [1].concat(_toConsumableArray(nums)));

"#
);

// spread_array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_with_hole,
    r#"
var arr = [ 'a',, 'b', ...c ];

"#,
    r#"
var arr = ['a',, 'b'].concat(_toConsumableArray(c));

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

"#,
    r#"
var _foob, _test;
(_foob = foob).add.apply(_foob, [foo, bar].concat(_toConsumableArray(numbers)));
(_test = foob.test).add.apply(_test, [foo, bar].concat(_toConsumableArray(numbers)))
"#
);

// spread_method_call_array_literal
test!(
    syntax(),
    |_| tr(),
    spread_method_call_array_literal,
    r#"
f(...[1, 2, 3]);

"#,
    r#"
f.apply(void 0, [1, 2, 3]);

"#
);

// spread_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_method_call_single_arg,
    r#"
add(...numbers);

"#,
    r#"
add.apply(void 0, _toConsumableArray(numbers));

"#
);

// spread_known_rest
test!(
    // Cost is too high.
    ignore,
    syntax(),
    |_| chain!(tr(), block_scoping()),
    spread_known_rest,
    r#"
function foo(...bar) {
  return [...bar];
}

"#,
    r#"
function foo() {
  for (var _len = arguments.length, bar = new Array(_len), _key = 0; _key < _len; _key++) {
    bar[_key] = arguments[_key];
  }

  return [].concat(bar);
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

"#,
    r#"
add.apply(void 0, [foo].concat(_toConsumableArray(numbers), [bar]));

"#
);

// spread_method_call_first
test!(
    syntax(),
    |_| tr(),
    spread_method_call_first,
    r#"
add(...numbers, foo, bar);

"#,
    r#"
add.apply(void 0, _toConsumableArray(numbers).concat([foo, bar]));

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

"#,
    r#"
class Foo {
  bar() {
    super.bar.apply(this, _toConsumableArray(args));
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

"#,
    r#"
var _foob, _test;
(_foob = foob).add.apply(_foob, _toConsumableArray(numbers));
(_test = foob.test).add.apply(_test, _toConsumableArray(numbers));
"#
);

// spread_array_literal_middle
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_middle,
    r#"
var a = [b, ...c, d];

"#,
    r#"
var a = [b].concat(_toConsumableArray(c), [d]);

"#
);

// spread_array_literals
test!(
    syntax(),
    |_| tr(),
    spread_array_literals,
    r#"
var lyrics = ["head", "and", "toes", ...parts];

"#,
    r#"
var lyrics = ["head", "and", "toes"].concat(_toConsumableArray(parts));

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
"#,
    r#"
const E_ARR = [];
export default function () {
  const someVar = E_ARR;
  return _toConsumableArray(someVar);
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

"#,
    r#"
add.apply(void 0, [foo].concat(_toConsumableArray(numbers), [bar, what], _toConsumableArray(test)));

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

"#,
    r#"
function foo() {
  return bar.apply(void 0, arguments);
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

"#,
    r#"
class Foo {
  bar() {
    super.bar.apply(this, [arg1, arg2].concat(_toConsumableArray(args)));
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

"#,
    r#"
var _obj;

(_obj = obj)[method].apply(_obj, _toConsumableArray(args));

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

"#,
    r#"
function foo() {
  return bar.apply(void 0, ["test"].concat(Array.prototype.slice.call(arguments)));
}

function bar(one, two, three) {
  return [one, two, three];
}

foo("foo", "bar");

"#
);
