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
}, _defineEnumerableProperty(_obj, _mutatorMap), _obj);"#
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
  r#"var k = Symbol();
var _obj, _mutatorMap = {
};
var foo = ( _obj = {
}, _defineProperty(_obj, Symbol.iterator, 'foobar'), _mutatorMap[k] = _mutatorMap[k] || {
}, _mutatorMap[k].get = function() {
    return k;
}, _defineEnumerableProperty(_obj, _mutatorMap), _obj);"#
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
