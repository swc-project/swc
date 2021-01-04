use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::computed_properties;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr(_: ()) -> impl Fold {
    computed_properties()
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    issue_210,
    "
const b = {[a]: 1}
export const c = {[a]: 1}
",
    "const b = _defineProperty({
}, a, 1);
export const c = _defineProperty({
}, a, 1);"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    big_int,
    "
const b = {1n: 1, [x]: 'x', 2n: 2}
",
    "var _obj;
const b = (_obj = {
    1n: 1
}, _defineProperty(_obj, x, 'x'), _defineProperty(_obj, 2n, 2), _obj);"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    accessors,
    r#"var obj = {
  get [foobar]() {
    return "foobar";
  },
  set [foobar](x) {
    console.log(x);
  },
  get test() {
    return "regular getter after computed property";
  },
  set "test"(x) {
    console.log(x);
  }
};
"#,
    r#"var _obj, _mutatorMap = {
};
var obj = ( _obj = {
}, _mutatorMap[foobar] = _mutatorMap[foobar] || {
}, _mutatorMap[foobar].get = function() {
    return 'foobar';
}, _mutatorMap[foobar] = _mutatorMap[foobar] || {
}, _mutatorMap[foobar].set = function(x) {
    console.log(x);
}, _mutatorMap['test'] = _mutatorMap['test'] || {
}, _mutatorMap['test'].get = function() {
    return 'regular getter after computed property';
}, _mutatorMap['test'] = _mutatorMap['test'] || {
}, _mutatorMap['test'].set = function(x) {
    console.log(x);
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    argument,
    r#"foo({
  [bar]: "foobar"
});"#,
    r#"foo(_defineProperty({}, bar, "foobar"));
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    assignment,
    r#"foo = {
  [bar]: "foobar"
};"#,
    r#"foo = _defineProperty({}, bar, "foobar");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    method,
    r#"var obj = {
  [foobar]() {
    return "foobar";
  },
  test() {
    return "regular method after computed property";
  }
};"#,
    r#"var _obj;

var obj = (_obj = {}, _defineProperty(_obj, foobar, function () {
  return "foobar";
}), _defineProperty(_obj, "test", function () {
  return "regular method after computed property";
}), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    mixed,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar"
};"#,
    r#"var _obj;

var obj = (_obj = {}, _defineProperty(_obj, "x" + foo, "heh"), _defineProperty(_obj,
 "y" + bar, "noo"), _defineProperty(_obj, "foo", "foo"), _defineProperty(_obj, "bar", "bar"), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    multiple,
    r#"var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo"
};"#,
    r#"var _obj;

var obj = (_obj = {}, _defineProperty(_obj, "x" + foo, "heh"),
_defineProperty(_obj, "y" + bar, "noo"), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    single,
    r#"var obj = {
  ["x" + foo]: "heh"
};"#,
    r#"var obj = _defineProperty({}, "x" + foo, "heh");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    symbol,
    r#"var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};
"#,
    r#"var k = Symbol();
var _obj, _mutatorMap = {
};
var foo = ( _obj = {
}, _defineProperty(_obj, Symbol.iterator, 'foobar'), _mutatorMap[k] = _mutatorMap[k] || {
}, _mutatorMap[k].get = function() {
    return k;
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    this,
    r#"var obj = {
  ["x" + foo.bar]: "heh"
};"#,
    r#"var obj = _defineProperty({}, "x" + foo.bar, "heh");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    issue_315_1,
    "
({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});

export function corge() {}
",
    "
_defineProperty({
    foo: _defineProperty({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
});
export function corge() {
}"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    issue_315_2,
    "
export function corge() {}
",
    "
export function corge() {}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    issue_315_3,
    "
export function corge() {}

({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});
",
    "
export function corge() {
}
_defineProperty({
    foo: _defineProperty({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
});
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| computed_properties(),
    issue_315_4,
    "
export class Foo {}

({
  foo: {
    bar: null,
    [baz]: null
  },

  [bon]: {
    flab: null
  }
});
",
    "
export class Foo {}

_defineProperty({
    foo: _defineProperty({
        bar: null
    }, baz, null)
}, bon, {
    flab: null
});
"
);

// spec_mixed
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_mixed,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo",
  foo: "foo",
  bar: "bar"
};

"#,
    r#"
var _obj;

var obj = (_obj = {}, _defineProperty(_obj, "x" + foo, "heh"), _defineProperty(_obj, "y" + bar, "noo"), _defineProperty(_obj, "foo", "foo"), _defineProperty(_obj, "bar", "bar"), _obj);

"#
);

// spec_single
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_single,
    r#"
var obj = {
  ["x" + foo]: "heh"
};

"#,
    r#"
var obj = _defineProperty({}, "x" + foo, "heh");

"#
);

// spec

// regression_7144
test!(
    syntax(),
    |_| tr(Default::default()),
    regression_7144,
    r#"
export default {
  [a]: b,
  [c]: d
};
"#,
    r#"
var _obj;

export default (_obj = {}, _defineProperty(_obj, a, b), _defineProperty(_obj, c, d), _obj);

"#
);

// spec_multiple
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_multiple,
    r#"
var obj = {
  ["x" + foo]: "heh",
  ["y" + bar]: "noo"
};

"#,
    r#"
var _obj;

var obj = (_obj = {}, _defineProperty(_obj, "x" + foo, "heh"), _defineProperty(_obj, "y" + bar, "noo"), _obj);

"#
);

// spec_this
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_this,
    r#"
var obj = {
  ["x" + foo.bar]: "heh"
};

"#,
    r#"
var obj = _defineProperty({}, "x" + foo.bar, "heh");

"#
);

// spec_method
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_method,
    r#"
var obj = {
  [foobar]() {
    return "foobar";
  },
  test() {
    return "regular method after computed property";
  }
};

"#,
    r#"
var _obj;

var obj = (_obj = {}, _defineProperty(_obj, foobar, function () {
  return "foobar";
}), _defineProperty(_obj, "test", function () {
  return "regular method after computed property";
}), _obj);

"#
);

// spec_assignment
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_assignment,
    r#"
foo = {
  [bar]: "foobar"
};

"#,
    r#"
foo = _defineProperty({}, bar, "foobar");

"#
);

// spec_argument
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_argument,
    r#"
foo({
  [bar]: "foobar"
});

"#,
    r#"
foo(_defineProperty({}, bar, "foobar"));

"#
);

// spec_two
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_two,
    r#"
var obj = {
  first: "first",
  ["second"]: "second",
};

"#,
    r#"
var obj = _defineProperty({
  first: "first"
}, "second", "second");

"#
);

// spec_variable
test!(
    syntax(),
    |_| tr(Default::default()),
    spec_variable,
    r#"
var foo = {
  [bar]: "foobar"
};

"#,
    r#"
var foo = _defineProperty({}, bar, "foobar");

"#
);

// spec_symbol_exec
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    spec_symbol_exec,
    r#"
var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};

expect(foo[Symbol.iterator]).toBe("foobar")
expect(foo[k]).toBe(k)

"#
);
