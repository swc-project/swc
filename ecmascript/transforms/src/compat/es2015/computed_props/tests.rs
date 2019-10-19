use super::*;

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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
    |_| ComputedProps,
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
    |_| ComputedProps,
    argument,
    r#"foo({
  [bar]: "foobar"
});"#,
    r#"foo(_defineProperty({}, bar, "foobar"));
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
    assignment,
    r#"foo = {
  [bar]: "foobar"
};"#,
    r#"foo = _defineProperty({}, bar, "foobar");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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
    |_| ComputedProps,
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
    |_| ComputedProps,
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
    |_| ComputedProps,
    single,
    r#"var obj = {
  ["x" + foo]: "heh"
};"#,
    r#"var obj = _defineProperty({}, "x" + foo, "heh");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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
    |_| ComputedProps,
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
    |_| ComputedProps,
    this,
    r#"var obj = {
  ["x" + foo.bar]: "heh"
};"#,
    r#"var obj = _defineProperty({}, "x" + foo.bar, "heh");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
    two,
    r#"var obj = {
  first: "first",
  ["second"]: "second",
};"#,
    r#"var _obj;
var obj = ( _obj = {
}, _defineProperty(_obj, 'first', 'first'), _defineProperty(_obj, 'second', 'second'), _obj);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
    variable,
    r#"var foo = {
  [bar]: "foobar"
};"#,
    r#"var foo = _defineProperty({}, bar, "foobar");"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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
var _obj, _obj1;
_obj1 = {
}, _defineProperty(_obj1, 'foo', (_obj = {
}, _defineProperty(_obj, 'bar', null), _defineProperty(_obj, baz, null), _obj)), \
     _defineProperty(_obj1, bon, {
    flab: null
}), _obj1;
export function corge() {}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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
    |_| ComputedProps,
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
export function corge() {}

var _obj, _obj1;
_obj1 = {
}, _defineProperty(_obj1, 'foo', (_obj = {
}, _defineProperty(_obj, 'bar', null), _defineProperty(_obj, baz, null), _obj)), \
     _defineProperty(_obj1, bon, {
    flab: null
}), _obj1;
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| ComputedProps,
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

var _obj, _obj1;
_obj1 = {
}, _defineProperty(_obj1, 'foo', (_obj = {
}, _defineProperty(_obj, 'bar', null), _defineProperty(_obj, baz, null), _obj)), \
     _defineProperty(_obj1, bon, {
    flab: null
}), _obj1;
"
);
