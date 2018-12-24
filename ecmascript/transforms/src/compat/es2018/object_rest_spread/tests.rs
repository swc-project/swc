use super::object_rest_spread;
use crate::compat::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

fn tr(helpers: Arc<Helpers>) -> impl Fold<Module> {
  object_rest_spread(helpers.clone())
}

test_exec!(
  tr,
  rest_assignment_exec,
  r#"
let foo = {
  a: 1,
  b: 2,
};

({ a, ...c } = foo);
expect(a).toBe(1);
expect(c).toEqual({b: 2});
"#
);

test!(
  tr(Default::default()),
  rest_assignment_expression,
  r#"({ a1 } = c1);
({ a2, ...b2 } = c2);

console.log({ a3, ...b3 } = c3);"#,
  r#"var _c2;

({
  a1
} = c1);
var _c = c2;
({
  a2
} = _c);
b2 = _objectWithoutProperties(_c, ["a2"]);
_c;
console.log((_c2 = c3, ({
  a3
} = _c2), b3 = _objectWithoutProperties(_c2, ["a3"]), _c2));"#
);

test!(
  tr(Default::default()),
  rest_catch_clause,
  r#"
try {} catch({ ...a34 }) {}
try {} catch({a1, ...b1}) {}
try {} catch({a2, b2, ...c2}) {}
try {} catch({a2, b2, c2: { c3, ...c4 }}) {}

// Unchanged
try {} catch(a) {}
try {} catch({ b }) {}
"#,
  r#"
try {} catch (_ref) {
  let a34 = _extends({}, _ref);
}

try {} catch (_ref2) {
  let {
    a1
  } = _ref2,
      b1 = _objectWithoutProperties(_ref2, ["a1"]);
}

try {} catch (_ref3) {
  let {
    a2,
    b2
  } = _ref3,
      c2 = _objectWithoutProperties(_ref3, ["a2", "b2"]);
}

try {} catch (_ref4) {
  let {
    a2,
    b2,
    c2: {
      c3
    }
  } = _ref4,
      c4 = _objectWithoutProperties(_ref4.c2, ["c3"]);
} // Unchanged


try {} catch (a) {}

try {} catch ({
  b
}) {}
"#
);

test!(
  tr(Default::default()),
  rest_export,
  r#"
// ExportNamedDeclaration
export var { b, ...c } = asdf2;
// Skip
export var { bb, cc } = ads;
export var [ dd, ee ] = ads;
"#,
  r#"
// ExportNamedDeclaration
var {
  b
} = asdf2,
    c = _objectWithoutProperties(asdf2, ["b"]); // Skip

export { b, c };
export var {
  bb,
  cc
} = ads;
export var [dd, ee] = ads;
"#
);

test!(
  tr(Default::default()),
  rest_for_x,
  r#"
// ForXStatement
for (var {a, ...b} of []) {}
for ({a, ...b} of []) {}
async function a() {
  for await ({a, ...b} of []) {}
}

// skip
for ({a} in {}) {}
for ({a} of []) {}
async function a() {
  for await ({a} of []) {}
}

for (a in {}) {}
for (a of []) {}
async function a() {
  for await (a of []) {}
}
"#,
  r#"
// ForXStatement
for (var _ref of []) {
  var {
    a
  } = _ref,
      b = _objectWithoutProperties(_ref, ["a"]);
}

for (var _ref2 of []) {
  var {
    a
  } = _ref2,
      b = _objectWithoutProperties(_ref2, ["a"]);
}

async function a() {
  for await (var _ref3 of []) {
    var {
      a
    } = _ref3,
        b = _objectWithoutProperties(_ref3, ["a"]);
  }
} // skip


for ({
  a
} in {}) {}

for ({
  a
} of []) {}

async function a() {
  for await ({
    a
  } of []) {}
}

for (a in {}) {}

for (a of []) {}

async function a() {
  for await (a of []) {}
}
"#
);

test_exec!(
  tr,
  rest_impure_computed_exec,
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
"#
);

test!(
  tr(Default::default()),
  rest_impure_computed,
  r#"
var key, x, y, z;
// impure
key = 1;
var { [key++]: y, ...x } = { 1: 1, a: 1 };
expect(x).toEqual({ a: 1 });
expect(key).toBe(2);
expect(y).toBe(1);

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
"#,
  r#"
var key, x, y, z; // impure

key = 1;

var _$a = {
  1: 1,
  a: 1
},
    _ref = key++,
    {
  [_ref]: y
} = _$a,
    x = _objectWithoutProperties(_$a, [_ref].map(_toPropertyKey));

expect(x).toEqual({
  a: 1
});
expect(key).toBe(2);
expect(y).toBe(1); // takes care of the order

key = 1;

var _$ = {
  2: 2,
  3: 3
},
    _ref2 = ++key,
    _ref3 = ++key,
    {
  [_ref2]: y,
  [_ref3]: z
} = _$,
    rest = _objectWithoutProperties(_$, [_ref2, _ref3].map(_toPropertyKey));

expect(y).toBe(2);
expect(z).toBe(3); // pure, computed property should remain as-is

key = 2;
var _$z = {
  2: "two",
  z: "zee"
};
({
  [key]: y,
  z
} = _$z);
x = _objectWithoutProperties(_$z, [key, "z"].map(_toPropertyKey));
_$z;
expect(y).toBe("two");
expect(x).toEqual({});
expect(z).toBe("zee");"#
);

test!(
  tr(Default::default()),
  rest_nested_2,
  r#"
const test = {
  foo: {
    bar: {
      baz: {
        a: {
          x: 1,
          y: 2,
          z: 3,
        },
      },
    },
  },
};

const { foo: { bar: { baz: { a: { x, ...other } } } } } = test;
"#,
  r#"
const test = {
  foo: {
    bar: {
      baz: {
        a: {
          x: 1,
          y: 2,
          z: 3
        }
      }
    }
  }
};
const {
  foo: {
    bar: {
      baz: {
        a: {
          x
        }
      }
    }
  }
} = test,
      other = _objectWithoutProperties(test.foo.bar.baz.a, ["x"]);"#
);

test!(
  tr(Default::default()),
  rest_nested_computed_key,
  r#"
const {
  [({ ...rest }) => {
    let { ...b } = {};
  }]: a,
  [({ ...d } = {})]: c,
} = {};
"#,
  r#"
var _ref2;

const {
  [(_ref) => {
    let rest = _extends({}, _ref);
    let b = _extends({}, {});
  }]: a,
  [(_ref2 = {}, ({} = _ref2), d = _extends({}, _ref2), _ref2)]: c
} = {};
"#
);

test!(
  tr(Default::default()),
  rest_nested_default_value,
  r#"
const {
  a = ({ ...rest }) => {
    let { ...b } = {};
  },
  c = ({ ...d } = {}),
} = {};
"#,
  r#"
var _ref2;

const {
  a = (_ref) => {
    let rest = _extends({}, _ref);
    let b = _extends({}, {});
  },
  c = (_ref2 = {}, ({} = _ref2), d = _extends({}, _ref2), _ref2)
} = {};
"#
);

test_exec!(
  tr,
  rest_nested_order_exec,
  r#"
var result = "";

var obj = {
  get foo() {
    result += "foo"
  },
  a: {
    get bar() {
      result += "bar";
    }
  },
  b: {
    get baz() {
      result += "baz";
    }
  }
};

var { a: { ...bar }, b: { ...baz }, ...foo } = obj;

expect(result).toBe("barbazfoo");
"#
);

test!(
  tr(Default::default()),
  rest_nested_order,
  r#"
const { a: { ...bar }, b: { ...baz }, ...foo } = obj;
"#,
  r#"
const bar = _extends({}, obj.a),
      baz = _extends({}, obj.b),
      foo = _extends({}, obj);"#
);

test!(
  tr(Default::default()),
  rest_nested,
  r#"
const defunct = {
  outer: {
    inner: {
      three: 'three',
      four: 'four'
    }
  }
}

const { outer: { inner: { three, ...other } } } = defunct
"#,
  r#"
const defunct = {
  outer: {
    inner: {
      three: 'three',
      four: 'four'
    }
  }
};
const {
  outer: {
    inner: {
      three
    }
  }
} = defunct,
      other = _objectWithoutProperties(defunct.outer.inner, ["three"]);
"#
);

test_exec!(
  tr,
  rest_non_string_computed_exec,
  r#"
const a = {
  "3": "three",
  "foo": "bar"
}

const {
  [3]: omit,
  ...rest
} = a;

expect(rest).toEqual({"foo": "bar"});
expect(omit).toBe("three");

const [k1, k2, k3, k4, k5] = [null, undefined, true, false, {toString() { return "warrior"; }}];
const c = {
  [k1]: "1",
  [k2]: "2",
  [k3]: "3",
  [k4]: "4",
  [k5]: "5"
};

const {
  [k1]: v1,
  [k2]: v2,
  [k3]: v3,
  [k4]: v4,
  [k5]: v5,
  ...vrest
} = c;

expect(v1).toBe("1");
expect(v2).toBe("2");
expect(v3).toBe("3");
expect(v4).toBe("4");
expect(v5).toBe("5");
expect(vrest).toEqual({});

// shouldn't convert symbols to strings
const sx = Symbol();
const sy = Symbol();

const d = {
  [sx]: "sx",
  [sy]: "sy"
}

const {
  [sx]: dx,
  [sy]: dy
} = d;

expect(dx).toBe("sx");
expect(dy).toBe("sy");
"#
);

test!(
  tr(Default::default()),
  rest_non_string_computed,
  r#"
const a = {
  "3": "three",
  "foo": "bar"
}

const {
  [3]: omit,
  ...rest
} = a;

expect(rest).toEqual({"foo": "bar"});
expect(omit).toBe("three");

const [k1, k2, k3, k4, k5] = [null, undefined, true, false, {toString() { return "warrior"; }}];
const c = {
  [k1]: "1",
  [k2]: "2",
  [k3]: "3",
  [k4]: "4",
  [k5]: "5"
};

const {
  [k1]: v1,
  [k2]: v2,
  [k3]: v3,
  [k4]: v4,
  [k5]: v5,
  ...vrest
} = c;

expect(v1).toBe("1");
expect(v2).toBe("2");
expect(v3).toBe("3");
expect(v4).toBe("4");
expect(v5).toBe("5");
expect(vrest).toEqual({});

// shouldn't convert symbols to strings
const sx = Symbol();
const sy = Symbol();

const d = {
  [sx]: "sx",
  [sy]: "sy"
}

const {
  [sx]: dx,
  [sy]: dy
} = d;

expect(dx).toBe("sx");
expect(dy).toBe("sy");"#,
  r#"
const a = {
  "3": "three",
  "foo": "bar"
};
const {
  [3]: omit
} = a,
      rest = _objectWithoutProperties(a, ["3"]);
expect(rest).toEqual({
  "foo": "bar"
});
expect(omit).toBe("three");
const [k1, k2, k3, k4, k5] = [null, undefined, true, false, {
  toString() {
    return "warrior";
  }

}];
const c = {
  [k1]: "1",
  [k2]: "2",
  [k3]: "3",
  [k4]: "4",
  [k5]: "5"
};
const {
  [k1]: v1,
  [k2]: v2,
  [k3]: v3,
  [k4]: v4,
  [k5]: v5
} = c,
      vrest = _objectWithoutProperties(c, [k1, k2, k3, k4, k5].map(_toPropertyKey));
expect(v1).toBe("1");
expect(v2).toBe("2");
expect(v3).toBe("3");
expect(v4).toBe("4");
expect(v5).toBe("5");
expect(vrest).toEqual({}); // shouldn't convert symbols to strings

const sx = Symbol();
const sy = Symbol();
const d = {
  [sx]: "sx",
  [sy]: "sy"
};
const {
  [sx]: dx,
  [sy]: dy
} = d;
expect(dx).toBe("sx");
expect(dy).toBe("sy");"#
);

test!(
  tr(Default::default()),
  rest_parameters,
  r#"
function a({ ...a34 }) {}
function a2({a1, ...b1}) {}
function a3({a2, b2, ...c2}) {}
function a4({a3, ...c3}, {a5, ...c5}) {}
function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {}
function a6({a3, b2: { ba1, ...ba2 } }) {}
function a7({a1 = 1, ...b1} = {}) {}
function a8([{...a1}]) {}
function a9([{a1, ...a2}]) {}
function a10([a1, {...a2}]) {}
// Unchanged
function b(a) {}
function b2(a, ...b) {}
function b3({ b }) {}
"#,
  r#"
function a(_ref) {
  let a34 = _extends({}, _ref);
}

function a2(_ref2) {
  let {
    a1
  } = _ref2,
      b1 = _objectWithoutProperties(_ref2, ["a1"]);
}

function a3(_ref3) {
  let {
    a2,
    b2
  } = _ref3,
      c2 = _objectWithoutProperties(_ref3, ["a2", "b2"]);
}

function a4(_ref5, _ref4) {
  let {
    a3
  } = _ref5,
      c3 = _objectWithoutProperties(_ref5, ["a3"]);
  let {
    a5
  } = _ref4,
      c5 = _objectWithoutProperties(_ref4, ["a5"]);
}

function a5(_ref6) {
  let {
    a3,
    b2: {
      ba1
    }
  } = _ref6,
      ba2 = _objectWithoutProperties(_ref6.b2, ["ba1"]),
      c3 = _objectWithoutProperties(_ref6, ["a3", "b2"]);
}

function a6(_ref7) {
  let {
    a3,
    b2: {
      ba1
    }
  } = _ref7,
      ba2 = _objectWithoutProperties(_ref7.b2, ["ba1"]);
}

function a7(_ref8 = {}) {
  let {
    a1 = 1
  } = _ref8,
      b1 = _objectWithoutProperties(_ref8, ["a1"]);
}

function a8([_ref9]) {
  let a1 = _extends({}, _ref9);
}

function a9([_ref10]) {
  let {
    a1
  } = _ref10,
      a2 = _objectWithoutProperties(_ref10, ["a1"]);
}

function a10([a1, _ref11]) {
  let a2 = _extends({}, _ref11);
} // Unchanged


function b(a) {}

function b2(a, ...b) {}

function b3({
  b
}) {}"#
);

test_exec!(
  tr,
  rest_symbol_exec,
  r#"
const sym = Symbol("test");
const sym2 = Symbol("not enumerable");

const src = { a: "string" };
Object.defineProperty(src, "b", { value: "not enumerable" })
Object.defineProperty(src, sym, { enumerable: true, value: "symbol" });
Object.defineProperty(src, sym2, { value: "not enumerable" });

const {...rest} = src;

expect(rest[sym]).toBe("symbol");
expect(rest.a).toBe("string");
expect(Object.getOwnPropertyNames(rest)).toEqual(["a"]);
expect(Object.getOwnPropertySymbols(rest)).toEqual([sym]);

const { [sym]: dst, ...noSym } = src;

expect(dst).toBe("symbol");
expect(noSym.a).toBe("string");
expect(Object.getOwnPropertySymbols(noSym)).toEqual([]);"#
);

test!(
  tr(Default::default()),
  rest_symbol,
  r#"
let {
  [Symbol.for("foo")]: foo,
  ...rest
} = {};

({ [Symbol.for("foo")]: foo, ...rest } = {});

if ({ [Symbol.for("foo")]: foo, ...rest } = {}) {}
"#,
  r#"
var _ref3, _Symbol$for3;

let _ref = {},
    _Symbol$for = Symbol.for("foo"),
    {
  [_Symbol$for]: foo
} = _ref,
    rest = _objectWithoutProperties(_ref, [_Symbol$for].map(_toPropertyKey));

var _ref2 = {};

var _Symbol$for2 = Symbol.for("foo");

({
  [_Symbol$for2]: foo
} = _ref2);
rest = _objectWithoutProperties(_ref2, [_Symbol$for2].map(_toPropertyKey));
_ref2;

if (_ref3 = {}, _Symbol$for3 = Symbol.for("foo"), ({
  [_Symbol$for3]: foo
} = _ref3), rest = _objectWithoutProperties(_ref3, 
    [_Symbol$for3].map(_toPropertyKey)), _ref3) {}
"#
);

test!(
  tr(Default::default()),
  rest_variable_destructuring,
  r#"
var z = {};
var { ...x } = z;
var { ...a } = { a: 1 };
var { ...x } = a.b;
var { ...x } = a();
var {x1, ...y1} = z;
x1++;
var { [a]: b, ...c } = z;
var {x1, ...y1} = z;
let {x2, y2, ...z2} = z;
const {w3, x3, y3, ...z4} = z;

let {
  x: { a: xa, [d]: f, ...asdf },
  y: { ...d },
  ...g
} = complex;

let { x4: { ...y4 } } = z;
"#,
  r#"
var z = {};
var x = _extends({}, z);
var a = _extends({}, {
  a: 1
});
var x = _extends({}, a.b);
var x = _extends({}, a());
var {
  x1
} = z,
    y1 = _objectWithoutProperties(z, ["x1"]);
x1++;
var {
  [a]: b
} = z,
    c = _objectWithoutProperties(z, [a].map(_toPropertyKey));
var {
  x1
} = z,
    y1 = _objectWithoutProperties(z, ["x1"]);
let {
  x2,
  y2
} = z,
    z2 = _objectWithoutProperties(z, ["x2", "y2"]);
const {
  w3,
  x3,
  y3
} = z,
      z4 = _objectWithoutProperties(z, ["w3", "x3", "y3"]);
let {
  x: {
    a: xa,
    [d]: f
  }
} = complex,
    asdf = _objectWithoutProperties(complex.x, ["a", d].map(_toPropertyKey)),
    d = _extends({}, complex.y),
    g = _objectWithoutProperties(complex, ["x"]);
let {} = z,
    y4 = _extends({}, z.x4);
"#
);

test!(
  tr(Default::default()),
  rest_with_array_rest,
  r#"
let {
  a: [b, ...arrayRest],
  c = function(...functionRest){},
  ...objectRest
} = {
  a: [1, 2, 3, 4],
  d: "oyez"
};
"#,
  r#"
let _a$d = {
  a: [1, 2, 3, 4],
  d: "oyez"
},
    {
  a: [b, ...arrayRest],
  c = function (...functionRest) {}
} = _a$d,
    objectRest = _objectWithoutProperties(_a$d, ["a", "c"]);"#
);

test!(
  tr(Default::default()),
  spread_assignment,
  r#"
z = { x, ...y };

z = { x, w: { ...y } };
"#,
  r#"
z = _objectSpread({
  x
}, y);
z = {
  x,
  w: _objectSpread({}, y)
};
"#
);

test!(
  tr(Default::default()),
  spread_expression,
  r#"
({ x, ...y, a, ...b, c });

({ ...Object.prototype });

({ ...{ foo: 'bar' } });

({ ...{ get foo () { return 'foo' } } });
"#,
  r#"
(_objectSpread({
  x
}, y, {
  a
}, b, {
  c
}));

(_objectSpread({}, Object.prototype));

(_objectSpread({}, {
  foo: 'bar'
}));

(_objectSpread({}, {
  get foo() {
    return 'foo';
  }

}));
"#
);

test_exec!(
    tr,
    spread_no_object_assign_exec,
    r#"
Object.defineProperty(Object.prototype, 'NOSET', {
  set(value) {
    // noop
  },
});

Object.defineProperty(Object.prototype, 'NOWRITE', {
  writable: false,
  value: 'abc',
});

const obj = { NOSET: 123 };
// this wouldn't work as expected if transformed as Object.assign (or equivalent)
// because those trigger object setters (spread don't)
const objSpread = { ...obj };

const obj2 = { NOSET: 123, NOWRITE: 456 };
// this line would throw `TypeError: Cannot assign to read only property 'NOWRITE'`
// if transformed as Object.assign (or equivalent) because those use *assignment* for creating properties
// (spread defines them)
const obj2Spread = { ...obj2 };

expect(objSpread).toEqual(obj);
expect(obj2Spread).toEqual(obj2);

const KEY = Symbol('key');
const obj3Spread = { ...{ get foo () { return 'bar' } }, [KEY]: 'symbol' };
expect(Object.getOwnPropertyDescriptor(obj3Spread, 'foo').value).toBe('bar');
expect(Object.getOwnPropertyDescriptor(obj3Spread, KEY).value).toBe('symbol');

const obj4Spread = { ...Object.prototype };
expect(Object.getOwnPropertyDescriptor(obj4Spread, 'hasOwnProperty')).toBeUndefined();

expect(() => ({ ...null, ...undefined })).not.toThrow();

const o = Object.create(null);
o.a = 'foo';
o.__proto__ = [];
const o2 = { ...o };
expect(Array.isArray(Object.getPrototypeOf(o2))).toBe(false);
"#
);

test!(
  tr(Default::default()),
  spread_variable_declaration,
  r#"var z = { ...x };"#,
  r#"var z = _objectSpread({}, x);"#
);
