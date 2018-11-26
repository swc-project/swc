use super::*;

test!(
    ComputedProps::default(),
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
    r#"var _foobar, _foobar2, _test, _test2, _obj, _mutatorMap;

var obj = (_obj = {}, _foobar = foobar, _mutatorMap = {}, _mutatorMap[_foobar] = _mutatorMap[_foobar] || {}, _mutatorMap[_foobar].get = function () {
  return "foobar";
}, _foobar2 = foobar, _mutatorMap[_foobar2] = _mutatorMap[_foobar2] || {}, _mutatorMap[_foobar2].set = function (x) {
  console.log(x);
}, _test = "test", _mutatorMap[_test] = _mutatorMap[_test] || {}, _mutatorMap[_test].get = function () {
  return "regular getter after computed property";
}, _test2 = "test", _mutatorMap[_test2] = _mutatorMap[_test2] || {}, _mutatorMap[_test2].set = function (x) {
  console.log(x);
}, _defineEnumerableProperties(_obj, _mutatorMap), _obj);"#
);

test!(
  ComputedProps::default(),
  argument,
  r#"foo({
  [bar]: "foobar"
});"#,
  r#"foo(_defineProperty({}, bar, "foobar"));
"#
);

test!(
  ComputedProps::default(),
  assignment,
  r#"foo = {
  [bar]: "foobar"
};"#,
  r#"foo = _defineProperty({}, bar, "foobar");"#
);

test!(
  ComputedProps::default(),
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
    ComputedProps::default(),
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
  ComputedProps::default(),
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
  ComputedProps::default(),
  single,
  r#"var obj = {
  ["x" + foo]: "heh"
};"#,
  r#"var obj = _defineProperty({}, "x" + foo, "heh");"#
);

test!(
  ComputedProps::default(),
  symbol,
  r#"var k = Symbol();
var foo = {
  [Symbol.iterator]: "foobar",
  get [k]() {
    return k;
  }
};
"#,
  r#"var _foo, _mutatorMap;

var k = Symbol();
var foo = (_foo = {}, _defineProperty(_foo, Symbol.iterator, "foobar"),
 _mutatorMap = {}, _mutatorMap[k] = _mutatorMap[k] || {}, _mutatorMap[k].get = function () {
  return k;
}, _defineEnumerableProperties(_foo, _mutatorMap), _foo);"#
);

test_exec!(
  ComputedProps::default(),
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
  ComputedProps::default(),
  this,
  r#"var obj = {
  ["x" + foo.bar]: "heh"
};"#,
  r#"var obj = _defineProperty({}, "x" + foo.bar, "heh");"#
);

test!(
  ComputedProps::default(),
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
  ComputedProps::default(),
  variable,
  r#"var foo = {
  [bar]: "foobar"
};"#,
  r#"var foo = _defineProperty({}, bar, "foobar");"#
);
