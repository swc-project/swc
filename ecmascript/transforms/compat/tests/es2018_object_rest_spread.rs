use swc_common::chain;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::spread;
use swc_ecma_transforms_compat::es2018::object_rest_spread;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr() -> impl Fold {
    object_rest_spread()
}

test!(
    syntax(),
    |_| tr(),
    issue_233,
    "const foo = () => ({ x, ...y }) => y",
    "const foo = ()=>(_param)=>{
        var { x } = _param, y = _objectWithoutProperties(_param, ['x']);
        return y;
    };"
);

test!(
    syntax(),
    |_| tr(),
    issue_239,
    "class Foo {
  constructor ({ ...bar }) {}
}",
    "class Foo{
    constructor(_param){
        var bar = _extends({
        }, _param);
    }
}"
);

// object rest spread pass should not touch rest in parameters and spread in
// args.
test!(
    syntax(),
    |_| tr(),
    issue_227,
    "export default function fn1(...args) {
  fn2(...args);
}",
    r#"export default function fn1(...args) {
  fn2(...args);
}"#
);

test!(
    syntax(),
    |_| tr(),
    issue_162,
    r#"
export const good = {
  a(bad1) {
    (...bad2) => { };
  }
};
"#,
    r#"
export const good = {
    a (bad1) {
        (...bad2)=>{
        };
    }
};
"#
);

test!(
    syntax(),
    |_| tr(),
    issue_181,
    r#"
const fn = ({ a, ...otherProps }) => otherProps;
"#,
    r#"
const fn = (_param)=>{
  var { a  } = _param, otherProps = _objectWithoutProperties(_param, ['a']);
  return otherProps;
};
"#
);

test!(
    syntax(),
    |_| tr(),
    rest_function_array,
    r#"
function foo([{...bar}]) {
}
"#,
    r#"
function foo([_param]) {
  var bar = _extends({}, _param);
}

"#
);

test!(
    syntax(),
    |_| tr(),
    rest_var_basic,
    r#"
var { a , ...b } = _ref;
"#,
    r#"
var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);
"#
);

test_exec!(
    syntax(),
    |_| tr(),
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

test_exec!(
    syntax(),
    |_| tr(),
    rest_catch_exec,
    r#"
try {
  throw {
    a2: 1,
    b2: 2,
    c2: {
      c3: 'c3',
      extras: 3,
    }
  };
} catch({a2, b2, c2: { c3, ...c4 }}) {
  expect(a2).toBe(1);
  expect(b2).toBe(2);
  expect(c3).toBe('c3');
  expect(c4).toEqual({extras: 3});
}"#
);

test!(
    syntax(),
    |_| tr(),
    rest_assignment_expression,
    r#"({ a1 } = c1);
({ a2, ...b2 } = c2);

console.log({ a3, ...b3 } = c3);"#,
    r#"
({ a1  } = c1);
var _c2;
_c2 = c2, b2 = _objectWithoutProperties(_c2, ['a2']), ({ a2  } = _c2), _c2;
var _c3;
console.log(( _c3 = c3, b3 = _objectWithoutProperties(_c3, ['a3']), { a3  } = _c3, _c3));
"#
);

test!(
    syntax(),
    |_| tr(),
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
try {
} catch (_param) {
    var a34 = _extends({
    }, _param);
}
try {
} catch (_param) {
    var { a1  } = _param, b1 = _objectWithoutProperties(_param, ['a1']);
}
try {
} catch (_param) {
    var { a2 , b2  } = _param, c2 = _objectWithoutProperties(_param, ['a2', 'b2']);
}
try {
} catch (_param) {
    var { a2 , b2 , c2: { c3  }  } = _param, c4 = _objectWithoutProperties(_param.c2, ['c3']);
}
try {
} catch (a) {
}
try {
} catch ({ b  }) {
}"#
);

test!(
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| chain!(
        tr(),
        spread(spread::Config {
            ..Default::default()
        })
    ),
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

for (var _ref1 of []) {
  var {
    a
  } = _ref1,
      b = _objectWithoutProperties(_ref1, ["a"]);
}

async function a() {
  for await (var _ref2 of []) {
    var {
      a
    } = _ref2,
        b = _objectWithoutProperties(_ref2, ["a"]);
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
    ignore,
    syntax(),
    |_| tr(),
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
    ignore,
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
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
var _tmp;
const _ref = {
}, key = (_param)=>{
    var rest = _extends({
    }, _param);
    let b = _extends({
    }, {
    });
}, key1 = (_tmp = {
}, d = _extends({
}, _tmp), _tmp), { [key]: a , [key1]: c  } = _ref;

"#
);

test_exec!(
    syntax(),
    |_| tr(),
    rest_nested_default_value_exec,
    r#"
const {
  a = ({ ...rest }) => {
    expect(rest).toEqual({})
    let { ...b } = {};
  },
  c = ({ ...d } = {}),
} = {};
a()
expect(c).toEqual({})
expect(d).toEqual({})
"#
);

test!(
    syntax(),
    |_| tr(),
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
var _tmp;
const _ref = {
}, { a =(_param)=>{
    var rest = _extends({
    }, _param);
    let b = _extends({
    }, {
    });
} , c =(_tmp = {
}, d = _extends({
}, _tmp), _tmp)  } = _ref;

"#
);

test_exec!(
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
    rest_nested_order,
    r#"
const { a: { ...bar }, b: { ...baz }, ...foo } = obj;
"#,
    r#"
const bar = _extends({}, obj.a), baz = _extends({}, obj.b), foo =
    _objectWithoutProperties(obj, ['a', 'b']);
"#
);

test!(
    syntax(),
    |_| tr(),
    rest_nested_1,
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
    ignore,
    syntax(),
    |_| tr(),
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
    ignore,
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
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
function a(_param) {
  var a34 = _extends({}, _param);
}

function a2(_param) {
  var {
    a1
  } = _param,
      b1 = _objectWithoutProperties(_param, ["a1"]);
}

function a3(_param) {
  var {
    a2,
    b2
  } = _param,
      c2 = _objectWithoutProperties(_param, ["a2", "b2"]);
}

function a4(_param, _param1) {
  var { a3 } = _param, c3 = _objectWithoutProperties(_param, ['a3']),
    { a5  } = _param1, c5 = _objectWithoutProperties(_param1, ['a5']);

}

function a5(_param) {
  var {
    a3,
    b2: {
      ba1
    }
  } = _param,
      ba2 = _objectWithoutProperties(_param.b2, ["ba1"]),
      c3 = _objectWithoutProperties(_param, ["a3", "b2"]);
}

function a6(_param) {
  var {
    a3,
    b2: {
      ba1
    }
  } = _param,
      ba2 = _objectWithoutProperties(_param.b2, ["ba1"]);
}

function a7(_param = {
}) {
    var { a1 =1  } = _param, b1 = _objectWithoutProperties(_param, ['a1']);
}

function a8([_param]) {
    var a1 = _extends({
    }, _param);
}

function a9([_param]) {
  var { a1 } = _param, a2 = _objectWithoutProperties(_param, ["a1"]);
}

function a10([a1, _param]) {
  var a2 = _extends({}, _param);
}

// Unchanged
function b(a) {}

function b2(a, ...b) {}

function b3({
  b
}) {}"#
);

test_exec!(
    syntax(),
    |_| tr(),
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
    ignore,
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
    rest_variable_destructuring_1,
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
"#,
    r#"
var z = {};
var x = _extends({}, z);
var a = _extends({
}, {
    a: 1
});
var x = _extends({
}, a.b);
var x = _extends({
}, a());
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
"#
);

test!(
    syntax(),
    |_| tr(),
    rest_variable_destructuring_2,
    r#"
let {
  x: { a: xa, [d]: f, ...asdf },
  y: { ...d },
  ...g
} = complex;
"#,
    r#"
let {
  x: {
    a: xa,
    [d]: f
  }
} = complex,
    asdf = _objectWithoutProperties(complex.x, ["a", d].map(_toPropertyKey)),
    d = _extends({}, complex.y),
    g = _objectWithoutProperties(complex, ["x", "y"]);
"#
);

test!(
    syntax(),
    |_| tr(),
    rest_variable_destructuring_3,
    r#"
let { x4: { ...y4 } } = z;
"#,
    r#"
let y4 = _extends({}, z.x4);
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    rest_with_array_rest_exec,
    r#"
let [{ a, ...foo}, ...bar] = [{ a: 1, b:2 }, 2, 3, 4];
expect(a).toBe(1)
expect(foo).toEqual({b: 2});
expect(bar).toEqual([2, 3, 4]);
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    rest_with_array_rest_exec_2,
    r#"
let {
  a: [b, ...arrayRest],
  c = function(...functionRest){},
  ...objectRest
} = {
  a: [1, 2, 3, 4],
  d: "oyez"
};

expect(b).toBe(1);
expect(arrayRest).toEqual([2, 3, 4]);
expect(objectRest).toEqual({d: 'oyez'})
"#
);

test!(
    syntax(),
    |_| tr(),
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
let _ref = {
     a: [1, 2, 3, 4], d: 'oyez'
}, { a: [b, ...arrayRest] , c =function(...functionRest) {
}  } = _ref, objectRest = _objectWithoutProperties(_ref, ['a', 'c']);
"#
);

test!(
    syntax(),
    |_| tr(),
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
    syntax(),
    |_| tr(),
    object_spread_expression,
    r#"
({ x, ...y, a, ...b, c });

({ ...Object.prototype });

({ ...{ foo: 'bar' } });

({ ...{ get foo () { return 'foo' } } });
"#,
    r#"
_objectSpread({
  x
}, y, {
  a
}, b, {
  c
});

_objectSpread({}, Object.prototype);

_objectSpread({}, {
  foo: 'bar'
});

_objectSpread({}, {
  get foo() {
    return 'foo';
  }

});
"#
);

test_exec!(
    syntax(),
    |_| tr(),
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
// if transformed as Object.assign (or equivalent) because
// those use *assignment* for creating properties
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
    syntax(),
    |_| tr(),
    spread_variable_declaration,
    r#"var z = { ...x };"#,
    r#"var z = _objectSpread({}, x);"#
);

// object_spread_assignment
test!(
    syntax(),
    |_| tr(),
    object_spread_assignment,
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

//// regression_gh_7304
//test!(syntax(),|_| tr("{
//  "presets": [
//    [
//      "env",
//      {
//        "shippedProposals": true,
//        "targets": {
//          "node": 8
//        },
//        "useBuiltIns": "usage",
//        "corejs": 3
//      }
//    ]
//  ],
//  "plugins": []
//}
//"), regression_gh_7304, r#"
//export default class {
//  method ({ ...object }) {}
//}
//"#, r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports.default = void 0;
//
//class _default {
//  method(_ref) {
//    let object = Object.assign({}, _ref);
//  }
//
//}
//
//exports.default = _default;
//
//"#);

//// object_rest_symbol
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_symbol, r#"
//let {
//  [Symbol.for("foo")]: foo,
//  ...rest
//} = {};
//
//({ [Symbol.for("foo")]: foo, ...rest } = {});
//
//if ({ [Symbol.for("foo")]: foo, ...rest } = {}) {}
//
//"#, r#"
//var _ref3, _Symbol$for3;
//
//let _ref = {},
//    _Symbol$for = Symbol.for("foo"),
//    {
//  [_Symbol$for]: foo
//} = _ref,
//    rest = _objectWithoutProperties(_ref,
// [_Symbol$for].map(_toPropertyKey));
//
//var _ref2 = {};
//
//var _Symbol$for2 = Symbol.for("foo");
//
//({
//  [_Symbol$for2]: foo
//} = _ref2);
//rest = _objectWithoutProperties(_ref2,
// [_Symbol$for2].map(_toPropertyKey));
//_ref2;
//
//if (_ref3 = {}, _Symbol$for3 = Symbol.for("foo"), ({
//  [_Symbol$for3]: foo
//} = _ref3), rest = _objectWithoutProperties(_ref3,
//} [_Symbol$for3].map(_toPropertyKey)), _ref3) {}
//
//"#);

// object_rest_symbol_exec_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_rest_symbol_exec_exec,
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
expect(Object.getOwnPropertySymbols(noSym)).toEqual([]);

"#
);

//// object_rest_impure_computed
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_impure_computed, r#"
//var key, x, y, z;
//// impure
//key = 1;
//var { [key++]: y, ...x } = { 1: 1, a: 1 };
//expect(x).toEqual({ a: 1 });
//expect(key).toBe(2);
//expect(y).toBe(1);
//
//// takes care of the order
//
//key = 1;
//var { [++key]: y, [++key]: z, ...rest} = {2: 2, 3: 3};
//expect(y).toBe(2);
//expect(z).toBe(3);
//
//// pure, computed property should remain as-is
//key = 2;
//({ [key]: y, z, ...x } = {2: "two", z: "zee"});
//expect(y).toBe("two");
//expect(x).toEqual({});
//expect(z).toBe("zee");
//
//"#, r#"
//var key, x, y, z; // impure
//
//key = 1;
//
//var _$a = {
//  1: 1,
//  a: 1
//},
//    _ref = key++,
//    {
//  [_ref]: y
//} = _$a,
//    x = _objectWithoutProperties(_$a,
// [_ref].map(_toPropertyKey));
//
//expect(x).toEqual({
//  a: 1
//});
//expect(key).toBe(2);
//expect(y).toBe(1); // takes care of the order
//
//key = 1;
//
//var _$ = {
//  2: 2,
//  3: 3
//},
//    _ref2 = ++key,
//    _ref3 = ++key,
//    {
//  [_ref2]: y,
//  [_ref3]: z
//} = _$,
//    rest = _objectWithoutProperties(_$, [_ref2,
// _ref3].map(_toPropertyKey));
//
//expect(y).toBe(2);
//expect(z).toBe(3); // pure, computed property should remain as-is
//
//key = 2;
//var _$z = {
//  2: "two",
//  z: "zee"
//};
//({
//  [key]: y,
//  z
//} = _$z);
//x = _objectWithoutProperties(_$z, [key,
// "z"].map(_toPropertyKey));
//_$z;
//expect(y).toBe("two");
//expect(x).toEqual({});
//expect(z).toBe("zee");
//
//"#);

//// object_rest_catch_clause
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_catch_clause, r#"
//try {} catch({ ...a34 }) {}
//try {} catch({a1, ...b1}) {}
//try {} catch({a2, b2, ...c2}) {}
//try {} catch({a2, b2, c2: { c3, ...c4 }}) {}
//
//// Unchanged
//try {} catch(a) {}
//try {} catch({ b }) {}
//
//"#, r#"
//try {} catch (_ref) {
//  let a34 = _extends({}, _ref);
//}
//
//try {} catch (_ref2) {
//  let {
//    a1
//  } = _ref2,
//      b1 = _objectWithoutProperties(_ref2, ["a1"]);
//}
//
//try {} catch (_ref3) {
//  let {
//    a2,
//    b2
//  } = _ref3,
//      c2 = _objectWithoutProperties(_ref3, ["a2", "b2"]);
//}
//
//try {} catch (_ref4) {
//  let {
//    a2,
//    b2,
//    c2: {
//      c3
//    }
//  } = _ref4,
//      c4 = _objectWithoutProperties(_ref4.c2, ["c3"]);
//} // Unchanged
//
//
//try {} catch (a) {}
//
//try {} catch ({
//  b
//}) {}
//
//"#);

//// object_rest_variable_destructuring
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_variable_destructuring, r#"
//var z = {};
//var { ...x } = z;
//var { ...a } = { a: 1 };
//var { ...x } = a.b;
//var { ...x } = a();
//var {x1, ...y1} = z;
//x1++;
//var { [a]: b, ...c } = z;
//var {x1, ...y1} = z;
//let {x2, y2, ...z2} = z;
//const {w3, x3, y3, ...z4} = z;
//
//let {
//  x: { a: xa, [d]: f, ...asdf },
//  y: { ...d },
//  ...g
//} = complex;
//
//let { x4: { ...y4 } } = z;
//
//"#, r#"
//var z = {};
//var x = _extends({}, z);
//var a = _extends({}, {
//  a: 1
//});
//var x = _extends({}, a.b);
//var x = _extends({}, a());
//var {
//  x1
//} = z,
//    y1 = _objectWithoutProperties(z, ["x1"]);
//x1++;
//var {
//  [a]: b
//} = z,
//    c = _objectWithoutProperties(z,
// [a].map(_toPropertyKey)); var {
//  x1
//} = z,
//    y1 = _objectWithoutProperties(z, ["x1"]);
//let {
//  x2,
//  y2
//} = z,
//    z2 = _objectWithoutProperties(z, ["x2", "y2"]);
//const {
//  w3,
//  x3,
//  y3
//} = z,
//      z4 = _objectWithoutProperties(z, ["w3", "x3", "y3"]);
//let {
//  x: {
//    a: xa,
//    [d]: f
//  }
//} = complex,
//    asdf = _objectWithoutProperties(complex.x, ["a",
// d].map(_toPropertyKey)),    d = _extends({},
// complex.y),    g = _objectWithoutProperties(complex, ["x"]);
//let {} = z,
//    y4 = _extends({}, z.x4);
//
//"#);

// object_rest_non_string_computed_exec

//// regression_gh_8323
//test!(syntax(),|_| tr("{
//  "presets": [["env", { "targets": { "node": "8" } }]],
//  "plugins": [["proposal-object-rest-spread", { "loose": true }]]
//}
//"), regression_gh_8323, r#"
//const get = () => {
//  fireTheMissiles();
//  return 3;
//};
//
//const f = ({ a = get(), b, c, ...z }) => {
//  const v = b + 3;
//};
//
//"#, r#"
//const get = () => {
//  fireTheMissiles();
//  return 3;
//};
//
//const f = (_ref) => {
//  let {
//    a = get(),
//    b
//  } = _ref,
//      z = _objectWithoutPropertiesLoose(_ref, ["a", "b", "c"]);
//
//  const v = b + 3;
//};
//
//"#);

// regression_gh_5151
test!(
    syntax(),
    |_| tr(),
    regression_gh_5151,
    r#"
const { x, ...y } = a,
  z = foo(y);

const { ...s } = r,
  t = foo(s);

// ordering is preserved
var l = foo(),
    { m: { n, ...o }, ...p } = bar(),
    q = baz();

"#,
    r#"
const {
  x
} = a,
      y = _objectWithoutProperties(a, ["x"]),
      z = foo(y);
const s = _extends({}, r),
      t = foo(s); // ordering is preserved

var l = foo(),
    _ref = bar(),
    {
  m: {
    n
  }
} = _ref,
    o = _objectWithoutProperties(_ref.m, ["n"]),
    p = _objectWithoutProperties(_ref, ["m"]),
    q = baz();

"#
);

// object_rest_parameters
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_parameters, r#"
//function a({ ...a34 }) {}
//function a2({a1, ...b1}) {}
//function a3({a2, b2, ...c2}) {}
//function a4({a3, ...c3}, {a5, ...c5}) {}
//function a5({a3, b2: { ba1, ...ba2 }, ...c3}) {}
//function a6({a3, b2: { ba1, ...ba2 } }) {}
//function a7({a1 = 1, ...b1} = {}) {}
//function a8([{...a1}]) {}
//function a9([{a1, ...a2}]) {}
//function a10([a1, {...a2}]) {}
//// Unchanged
//function b(a) {}
//function b2(a, ...b) {}
//function b3({ b }) {}
//
//"#, r#"
//function a(_ref) {
//  let a34 = _extends({}, _ref);
//}
//
//function a2(_ref2) {
//  let {
//    a1
//  } = _ref2,
//      b1 = _objectWithoutProperties(_ref2, ["a1"]);
//}
//
//function a3(_ref3) {
//  let {
//    a2,
//    b2
//  } = _ref3,
//      c2 = _objectWithoutProperties(_ref3, ["a2", "b2"]);
//}
//
//function a4(_ref5, _ref4) {
//  let {
//    a3
//  } = _ref5,
//      c3 = _objectWithoutProperties(_ref5, ["a3"]);
//  let {
//    a5
//  } = _ref4,
//      c5 = _objectWithoutProperties(_ref4, ["a5"]);
//}
//
//function a5(_ref6) {
//  let {
//    a3,
//    b2: {
//      ba1
//    }
//  } = _ref6,
//      ba2 = _objectWithoutProperties(_ref6.b2, ["ba1"]),
//      c3 = _objectWithoutProperties(_ref6, ["a3", "b2"]);
//}
//
//function a6(_ref7) {
//  let {
//    a3,
//    b2: {
//      ba1
//    }
//  } = _ref7,
//      ba2 = _objectWithoutProperties(_ref7.b2, ["ba1"]);
//}
//
//function a7(_ref8 = {}) {
//  let {
//    a1 = 1
//  } = _ref8,
//      b1 = _objectWithoutProperties(_ref8, ["a1"]);
//}
//
//function a8([_ref9]) {
//  let a1 = _extends({}, _ref9);
//}
//
//function a9([_ref10]) {
//  let {
//    a1
//  } = _ref10,
//      a2 = _objectWithoutProperties(_ref10, ["a1"]);
//}
//
//function a10([a1, _ref11]) {
//  let a2 = _extends({}, _ref11);
//} // Unchanged
//
//
//function b(a) {}
//
//function b2(a, ...b) {}
//
//function b3({
//  b
//}) {}
//
//"#);

//// object_rest_for_x_array_pattern
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_for_x_array_pattern, r#"
//// ForXStatement
//for (const [{a, ...b}] of []) {}
//for ([{a, ...b}] of []) {}
//async function a() {
//  for await ([{a, ...b}] of []) {}
//}
//
//// skip
//for ([{a}] in {}) {}
//for ([{a}] of []) {}
//async function a() {
//  for await ([{a}] of []) {}
//}
//
//for ([a, ...b] in {}) {}
//for ([a, ...b] of []) {}
//async function a() {
//  for await ([a, ...b] of []) {}
//}
//
//"#, r#"
//// ForXStatement
//for (const _ref of []) {
//  const [_ref2] = _ref;
//  const {
//    a
//  } = _ref2,
//        b = _objectWithoutProperties(_ref2, ["a"]);
//}
//
//for (var _ref3 of []) {
//  [_ref4] = _ref3;
//  var {
//    a
//  } = _ref4,
//      b = _objectWithoutProperties(_ref4, ["a"]);
//}
//
//async function a() {
//  for await (var _ref5 of []) {
//    [_ref6] = _ref5;
//    var {
//      a
//    } = _ref6,
//        b = _objectWithoutProperties(_ref6, ["a"]);
//  }
//} // skip
//
//
//for ([{
//  a
//}] in {}) {}
//
//for ([{
//  a
//}] of []) {}
//
//async function a() {
//  for await ([{
//    a
//  }] of []) {}
//}
//
//for ([a, ...b] in {}) {}
//
//for ([a, ...b] of []) {}
//
//async function a() {
//  for await ([a, ...b] of []) {}
//}
//
//"#);

//// object_rest_nested_computed_key
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested_computed_key, r#"
//const {
//  [({ ...rest }) => {
//    let { ...b } = {};
//  }]: a,
//  [({ ...d } = {})]: c,
//} = {};
//"#, r#"
//var _ref2;
//
//const {
//  [(_ref) => {
//    let rest = _extends({}, _ref);
//    let b = _extends({}, {});
//  }]: a,
//  [(_ref2 = {}, ({} = _ref2), d = _extends({}, _ref2), _ref2)]: c
//} = {};
//
//"#);

// regression_gh_7388
test!(
    syntax(),
    |_| tr(),
    regression_gh_7388,
    r#"
function fn0(obj0) {
  const {
    fn1 = (obj1 = {}) => {
      const {
        fn2 = (obj2 = {}) => {
          const {a, ...rest} = obj2;
          console.log(rest);
        }
      } = obj1;
    }
  } = obj0;
}

"#,
    r#"
function fn0(obj0) {
  const {
    fn1 = (obj1 = {}) => {
      const {
        fn2 = (obj2 = {}) => {
          const {
            a
          } = obj2,
                rest = _objectWithoutProperties(obj2, ["a"]);
          console.log(rest);
        }
      } = obj1;
    }
  } = obj0;
}

"#
);

// object_rest_impure_computed_exec

//// object_rest_nested
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested, r#"
//const defunct = {
//  outer: {
//    inner: {
//      three: 'three',
//      four: 'four'
//    }
//  }
//}
//
//const { outer: { inner: { three, ...other } } } = defunct
//
//"#, r#"
//const defunct = {
//  outer: {
//    inner: {
//      three: 'three',
//      four: 'four'
//    }
//  }
//};
//const {
//  outer: {
//    inner: {
//      three
//    }
//  }
//} = defunct,
//      other = _objectWithoutProperties(defunct.outer.inner,
// ["three"]);
//
//"#);

//// object_rest_with_array_rest
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_with_array_rest, r#"
//let {
//  a: [b, ...arrayRest],
//  c = function(...functionRest){},
//  ...objectRest
//} = {
//  a: [1, 2, 3, 4],
//  d: "oyez"
//};
//
//"#, r#"
//let _a$d = {
//  a: [1, 2, 3, 4],
//  d: "oyez"
//},
//    {
//  a: [b, ...arrayRest],
//  c = function (...functionRest) {}
//} = _a$d,
//    objectRest = _objectWithoutProperties(_a$d, ["a", "c"]);
//
//"#);

//// object_rest_nested_array_2
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested_array_2, r#"
//const [a, [{b, ...c}], {d, ...e}, [{ f, ...g}, {h: [i, {j, ...k}] }]] = x;
//
//"#, r#"
//const [a, [_ref], _ref2, [_ref3, {
//  h: [i, _ref4]
//}]] = x;
//const {
//  b
//} = _ref,
//      c = _objectWithoutProperties(_ref, ["b"]),
//      {
//  d
//} = _ref2,
//      e = _objectWithoutProperties(_ref2, ["d"]),
//      {
//  f
//} = _ref3,
//      g = _objectWithoutProperties(_ref3, ["f"]),
//      {
//  j
//} = _ref4,
//      k = _objectWithoutProperties(_ref4, ["j"]);
//
//"#);

// object_rest_impure_computed_exec_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_rest_impure_computed_exec_exec,
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

//// object_rest_duplicate_decl_bug
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "./plugin-clear-scope",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_duplicate_decl_bug, r#"
//it("es7.objectRestSpread", () => {
//  let original = { a: 1, b: 2 };
//  let { ...copy } = original;
//});
//
//"#, r#"
//it("es7.objectRestSpread", () => {
//  let original = {
//    a: 1,
//    b: 2
//  };
//  let copy = _extends({}, original);
//});
//
//"#);

// object_spread_expression_exec
test_exec!(
    // WTF? babel's output is wrong
    ignore,
    syntax(),
    |_| tr(),
    object_spread_expression_exec,
    r#"
var log = [];

var a = {
  ...{ get foo() { log.push(1); } },
  get bar() { log.push(2); }
};

expect(log).toEqual([1]);

"#
);

// object_rest_nested_default_value
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested_default_value, r#"
//const {
//  a = ({ ...rest }) => {
//    let { ...b } = {};
//  },
//  c = ({ ...d } = {}),
//} = {};
//"#, r#"
//var _ref2;
//
//const {
//  a = (_ref) => {
//    let rest = _extends({}, _ref);
//    let b = _extends({}, {});
//  },
//  c = (_ref2 = {}, ({} = _ref2), d = _extends({}, _ref2), _ref2)
//} = {};
//
//"#);

//// object_rest_export
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_export, r#"
//// ExportNamedDeclaration
//export var { b, ...c } = asdf2;
//// Skip
//export var { bb, cc } = ads;
//export var [ dd, ee ] = ads;
//
//"#, r#"
//// ExportNamedDeclaration
//var {
//  b
//} = asdf2,
//    c = _objectWithoutProperties(asdf2, ["b"]); // Skip
//
//export { b, c };
//export var {
//  bb,
//  cc
//} = ads;
//export var [dd, ee] = ads;
//
//"#);

//// object_rest_non_string_computed
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_non_string_computed, r#"
//const a = {
//  "3": "three",
//  "foo": "bar"
//}
//
//const {
//  [3]: omit,
//  ...rest
//} = a;
//
//expect(rest).toEqual({"foo": "bar"});
//expect(omit).toBe("three");
//
//const [k1, k2, k3, k4, k5] = [null, undefined, true, false, {toString() {
// return "warrior"; }}]; const c = {
//  [k1]: "1",
//  [k2]: "2",
//  [k3]: "3",
//  [k4]: "4",
//  [k5]: "5"
//};
//
//const {
//  [k1]: v1,
//  [k2]: v2,
//  [k3]: v3,
//  [k4]: v4,
//  [k5]: v5,
//  ...vrest
//} = c;
//
//expect(v1).toBe("1");
//expect(v2).toBe("2");
//expect(v3).toBe("3");
//expect(v4).toBe("4");
//expect(v5).toBe("5");
//expect(vrest).toEqual({});
//
//// shouldn't convert symbols to strings
//const sx = Symbol();
//const sy = Symbol();
//
//const d = {
//  [sx]: "sx",
//  [sy]: "sy"
//}
//
//const {
//  [sx]: dx,
//  [sy]: dy
//} = d;
//
//expect(dx).toBe("sx");
//expect(dy).toBe("sy");
//
//"#, r#"
//const a = {
//  "3": "three",
//  "foo": "bar"
//};
//const {
//  [3]: omit
//} = a,
//      rest = _objectWithoutProperties(a, ["3"]);
//expect(rest).toEqual({
//  "foo": "bar"
//});
//expect(omit).toBe("three");
//const [k1, k2, k3, k4, k5] = [null, undefined, true, false, {
//  toString() {
//    return "warrior";
//  }
//
//}];
//const c = {
//  [k1]: "1",
//  [k2]: "2",
//  [k3]: "3",
//  [k4]: "4",
//  [k5]: "5"
//};
//const {
//  [k1]: v1,
//  [k2]: v2,
//  [k3]: v3,
//  [k4]: v4,
//  [k5]: v5
//} = c,
//      vrest = _objectWithoutProperties(c, [k1, k2, k3, k4,
// k5].map(_toPropertyKey)); expect(v1).toBe("1");
//expect(v2).toBe("2");
//expect(v3).toBe("3");
//expect(v4).toBe("4");
//expect(v5).toBe("5");
//expect(vrest).toEqual({}); // shouldn't convert symbols to strings
//
//const sx = Symbol();
//const sy = Symbol();
//const d = {
//  [sx]: "sx",
//  [sy]: "sy"
//};
//const {
//  [sx]: dx,
//  [sy]: dy
//} = d;
//expect(dx).toBe("sx");
//expect(dy).toBe("sy");
//
//"#);

// object_spread_variable_declaration
test!(
    syntax(),
    |_| tr(),
    object_spread_variable_declaration,
    r#"
var z = { ...x };

"#,
    r#"
var z = _objectSpread({}, x);

"#
);

//// object_rest_nested_array
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested_array, r#"
//const [a, {b, ...c}] = x;
//
//let [d, {e, ...f}] = x;
//
//[g, {h, ...i}] = x;
//
//
//"#, r#"
//const [a, _ref] = x;
//const {
//  b
//} = _ref,
//      c = _objectWithoutProperties(_ref, ["b"]);
//let [d, _ref2] = x;
//let {
//  e
//} = _ref2,
//    f = _objectWithoutProperties(_ref2, ["e"]);
//[g, _ref3] = x;
//var {
//  h
//} = _ref3,
//    i = _objectWithoutProperties(_ref3, ["h"]);
//
//"#);

// object_spread_no_object_assign_exec_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_spread_no_object_assign_exec_exec,
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

// object_rest_non_string_computed_exec_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_rest_non_string_computed_exec_exec,
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

// object_rest_variable_exec

// object_rest_variable_exec_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_rest_variable_exec_exec,
    r#"
// var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };

// expect(x).toBe(1);
// expect(y).toBe(2);
// expect(z).toEqual({ a: 3, b: 4 });

// var complex = {
//   x: { a: 1, b: 2, c: 3 },
// };

// var {
//   x: { a: xa, ...xbc }
// } = complex;

// expect(xa).toBe(1);
// expect(xbc).toEqual({ b: 2, c: 3});

// // own properties
// function ownX({ ...properties }) {
//   return properties.x;
// }
// expect(ownX(Object.create({ x: 1 }))).toBeUndefined();

"#
);

//// object_rest_nested_2
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_nested_2, r#"
//const test = {
//  foo: {
//    bar: {
//      baz: {
//        a: {
//          x: 1,
//          y: 2,
//          z: 3,
//        },
//      },
//    },
//  },
//};
//
//const { foo: { bar: { baz: { a: { x, ...other } } } } } = test;
//
//"#, r#"
//const test = {
//  foo: {
//    bar: {
//      baz: {
//        a: {
//          x: 1,
//          y: 2,
//          z: 3
//        }
//      }
//    }
//  }
//};
//const {
//  foo: {
//    bar: {
//      baz: {
//        a: {
//          x
//        }
//      }
//    }
//  }
//} = test,
//      other = _objectWithoutProperties(test.foo.bar.baz.a, ["x"]);
//
//"#);

// object_spread_no_getOwnPropertyDescriptors_exec
test_exec!(
    syntax(),
    |_| tr(),
    object_spread_no_get_own_property_descriptors_exec,
    r#"
const oldGOPDs = Object.getOwnPropertyDescriptors;
Object.getOwnPropertyDescriptors = null;

({ ...{ a: 1 }, b: 1, ...{} });

Object.getOwnPropertyDescriptors = oldGOPDs;

"#
);

//// object_rest_for_x
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_for_x, r#"
//// ForXStatement
//for (var {a, ...b} of []) {}
//for ({a, ...b} of []) {}
//async function a() {
//  for await ({a, ...b} of []) {}
//}
//
//// skip
//for ({a} in {}) {}
//for ({a} of []) {}
//async function a() {
//  for await ({a} of []) {}
//}
//
//for (a in {}) {}
//for (a of []) {}
//async function a() {
//  for await (a of []) {}
//}
//
//"#, r#"
//// ForXStatement
//for (var _ref of []) {
//  var {
//    a
//  } = _ref,
//      b = _objectWithoutProperties(_ref, ["a"]);
//}
//
//for (var _ref2 of []) {
//  var _ref3 = _ref2;
//  ({
//    a
//  } = _ref3);
//  b = _objectWithoutProperties(_ref3, ["a"]);
//  _ref3;
//}
//
//async function a() {
//  for await (var _ref4 of []) {
//    var _ref5 = _ref4;
//    ({
//      a
//    } = _ref5);
//    b = _objectWithoutProperties(_ref5, ["a"]);
//    _ref5;
//  }
//} // skip
//
//
//for ({
//  a
//} in {}) {}
//
//for ({
//  a
//} of []) {}
//
//async function a() {
//  for await ({
//    a
//  } of []) {}
//}
//
//for (a in {}) {}
//
//for (a of []) {}
//
//async function a() {
//  for await (a of []) {}
//}
//
//"#);

//// object_rest_template_literal_property_allLiterals_false
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_template_literal_property_allLiterals_false, r#"
//const input = {};
//
//const {
//  given_name: givenName,
//  'last_name': lastName,
//  [`country`]: country,
//  [prefix + 'state']: state,
//  [`${prefix}consents`]: consents,
//  ...rest
//} = input;
//
//"#, r#"
//const input = {};
//
//const _ref = prefix + 'state',
//      _ref2 = `${prefix}consents`,
//      {
//  given_name: givenName,
//  'last_name': lastName,
//  [`country`]: country,
//  [_ref]: state,
//  [_ref2]: consents
//} = input,
//      rest = _objectWithoutProperties(input, ["given_name",
// "last_name", `country`, _ref, _ref2].map(_toPropertyKey));
//
//"#);

//// object_rest_for_x_completion_record
//test!(syntax(),|_| tr("{
//  "plugins": [
//    "syntax-async-generators",
//    "proposal-object-rest-spread",
//
//  ]
//}
//"), object_rest_for_x_completion_record, r#"
//for ({a, ...b} of []) {}
//
//"#, r#"
//for (var _ref of []) {
//  var _ref2 = _ref;
//  ({
//    a
//  } = _ref2);
//  b = _objectWithoutProperties(_ref2, ["a"]);
//  _ref2;
//  void 0;
//}
//
//"#);

// regression_gh_4904
test!(
    syntax(),
    |_| tr(),
    regression_gh_4904,
    r#"
const { s, ...t } = foo();

const { s: { q1, ...q2 }, ...q3 } = bar();

const { a } = foo(({ b, ...c }) => {
  console.log(b, c);
});

"#,
    r#"
const _ref = foo(), { s  } = _ref, t = _objectWithoutProperties(_ref, ['s']);
const _ref1 = bar(), { s: { q1  }  } = _ref1, q2 = _objectWithoutProperties(_ref1.s, ['q1']), q3 = _objectWithoutProperties(_ref1, ['s']);
const _ref2 = foo((_param)=>{
    var { b  } = _param, c = _objectWithoutProperties(_param, ['b']);
    console.log(b, c);
}), { a  } = _ref2;


"#
);
