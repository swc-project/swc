use super::*;
use crate::{compat::es2015::Classes, resolver};

fn tr() -> impl Fold<Module> {
    chain!(
        resolver(),
        Params,
        crate::compat::es2015::destructuring(),
        crate::compat::es2015::block_scoping(),
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_254,
    "export const someFunction = (update = false, action = {}) => {}",
    "
export var someFunction = (param, param1)=>{
    var update = param === void 0 ? false : param, action = param1 === void 0 ? {} : param1;
};
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_227,
    "export default function fn1(...args) {
  fn2(...args);
}",
    "
export default function fn1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    fn2(...args);
}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_169,
    r#"
class Foo {
	func(a, b = Date.now()) {
		return {a};
	}
}
"#,
    r#"
class Foo{
     func(a, param) {
        var b = param === void 0 ? Date.now() : param
        return {
            a
        };
    }
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    babel_6057_simple,
    r#"const a = 'bar';
function foo(...a) {
  return a;
}"#,
    r#"var a = 'bar';
function foo() {
    for(var _len = arguments.length, a1 = new Array(_len), _key = 0; _key < _len; _key++){
        a1[_key] = arguments[_key];
    }
    return a1;
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_before_last,
    r#"function foo(a = "foo", b) {}"#,
    r#"function foo(param, b) {
    var a = param === void 0 ? 'foo' : param;
}"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_destructuring,
    r#"function required(msg) {
  throw new Error(msg);
}

function sum(
  { arr = required('arr is required') } = { arr: arr = [] },
  length = arr.length
) {
  let i = 0;
  let acc = 0;
  for (let item of arr) {
    if (i >= length) return acc;
    acc += item;
    i++;
  }
  return acc;
}

expect(sum({arr:[1,2]})).toBe(3);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_earlier_params,
    r#"function f(a, b = a, c = b) { return c; }

expect(3).toBe(f(3));"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_eval,
    r#"let x = "outside";
function outer(a = () => eval("x")) {
  let x = "inside";
  return a();
}
outer();"#,
    r#"var x = "outside";

function outer() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return eval("x");
  };
  return function () {
    var x = "inside";
    return a();
  }();
}

outer();"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_iife_1128,
    r#"const bar = true;

function foo(a = bar, ...b) {
  const bar = false;
  expect(b[0]).toBe(2);
  expect(b[1]).toBe(3);
}

foo(1, 2, 3);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(Classes, tr()),
    default_iife_4253,
    r#"class Ref {
  constructor(id = ++Ref.nextID) {
    this.id = id
  }
}
Ref.nextID = 0"#,
    r#"var Ref = function Ref(param) {
        var id = param === void 0 ? ++Ref.nextID : param;
        _classCallCheck(this, Ref);
        this.id = id;
    };
Ref.nextID = 0;"#
);

test_exec!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    // Stage0
    |_| tr(),
    default_iife_4253_exec,
    r#"class Ref {
  static nextId = 0
  constructor(id = ++Ref.nextId, n = id) {
    this.id = n
  }
}

expect(new Ref().id).toBe(1);
expect(new Ref().id).toBe(2);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(Classes, tr()),
    default_iife_self,
    r#"class Ref {
  constructor(ref = Ref) {
    this.ref = ref
  }
}

class X {
  constructor(x = foo) {
    this.x = x
  }
}"#,
    r#"var Ref = function Ref(param) {
        var ref = param === void 0 ? Ref : param;
        _classCallCheck(this, Ref);
        this.ref = ref;
    }
var X = function X(param) {
        var x = param === void 0 ? foo : param;
        _classCallCheck(this, X);
        this.x = x;
    };
"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_iife_self_exec,
    r#"class Ref {
  constructor(ref = Ref) {
    this.ref = ref
  }
}

expect(new Ref().ref).toBe(Ref);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_multiple,
    r#"var t = function (e = "foo", f = 5) {
  return e + " bar " + f;
};

var a = function (e, f = 5) {
  return e + " bar " + f;
};"#,
    "var t = function(param, param1) {
    var e = param === void 0 ? 'foo' : param, f = param1 === void 0 ? 5 : param1;
    return e + ' bar ' + f;
};
var a = function(e, param) {
    var f = param === void 0 ? 5 : param;
    return e + ' bar ' + f;
};
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_rest_mix,
    r#"function fn(
  a1,
  a2 = 4,
  {a3, a4},
  a5,
  {a6, a7} = {}) {}"#,
    "function fn(a1, param, param1, a5, param2) {
    var a2 = param === void 0 ? 4 : param, ref = param1 ? param1 : _throw(new TypeError(\"Cannot \
     destructure 'undefined' or 'null'\")), a3 = ref.a3, a4 = ref.a4, ref1 = param2 === void 0 ? {
    } : param2, ref2 = ref1 ? ref1 : _throw(new TypeError(\"Cannot destructure 'undefined' or \
     'null'\")), a6 = ref2.a6, a7 = ref2.a7;
}
"
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  default_rest_1,
  r#"const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)"#,
  r#"var a = 1;
function rest(param) {
    var b = param === void 0 ? a : param;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(b).toBe(1);
}
rest(undefined, 2);"#
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  default_rest_2,
  r#"const a = 1;
  function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
}
rest2(undefined, 2);"#,
  r#"var a = 1;
function rest2(param) {
    var b = param === void 0 ? a : param;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(a1[0]).toBe(2);
}
rest2(undefined, 2);"#
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  default_rest_3,
  r#"const a = 1;
    function rest3(b = a, ...a) {
  expect(a).toHaveLength(1);
}
rest3(undefined, 2)"#,
  r#"var a = 1;
function rest3(param) {
    var b = param === void 0 ? a : param;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(a1).toHaveLength(1);
}
rest3(undefined, 2);"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_rest_exec,
    r#"const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)

function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
}
rest2(undefined, 2)

function rest3(b = a, ...a) {
  expect(a).toHaveLength(1);
}
rest3(undefined, 2)"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_setter_noexec,
    r#"const obj = {
  set field(num = 1) {
    this.num = num;
  }
};"#,
    "var obj = {
    set field (param){
        var num = param === void 0 ? 1 : param;
        this.num = num;
    }
};
"
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_setter_exec,
    r#"const defaultValue = 1;
const obj = {
  set field(num = defaultValue) {
    this.num = num;
  }
};
obj.field = void 0;

expect(obj.num).toBe(defaultValue);"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    default_single,
    r#"var t = function (f = "foo") {
  return f + " bar";
};"#,
    r#"var t = function(param) {
    var f = param === void 0 ? 'foo' : param;
    return f + ' bar';
};"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    destructuring_rest,
    r#"// #3861
function t(x = "default", { a, b }, ...args) {
  console.log(x, a, b, args);
}"#,
    "// #3861
function t(param, param1) {
    var x = param === void 0 ? 'default' : param, ref = param1 ? param1 : _throw(new \
     TypeError(\"Cannot destructure 'undefined' or 'null'\")), a = ref.a, b = ref.b;
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < \
     _len; _key++){
        args[_key - 2] = arguments[_key];
    }
    console.log(x, a, b, args);
}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    regression_4333,
    r#"const args = 'bar';
function foo(...args) {
  return args;
}"#,
    r#"var args = 'bar';
function foo() {
    for(var _len = arguments.length, args1 = new Array(_len), _key = 0; _key < _len; _key++){
        args1[_key] = arguments[_key];
    }
    return args1;
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    regression_4348,
    r#"function first(...values) {
  var index = 0;
  return values[index++];
}"#,
    r#"function first() {
    for(var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++){
        values[_key] = arguments[_key];
    }
    var index = 0;
    return values[index++];
}"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    // type
    |_| tr(),
    regression_4634,
    r#"let oneOf = (...nodes) => {
  if (nodes.length === 1) {
    return nodes[0];
  }
  return ((new OneOfNode(nodes)): any)
}"#,
    r#"
let oneOf = function () {
  for (var _len = arguments.length, nodes = new Array(_len), _key = 0; _key < _len; _key++) {
    nodes[_key] = arguments[_key];
  }

  if (nodes.length === 1) {
    return nodes[0];
  }

  return new OneOfNode(nodes);
};"#
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  regression_5787,
  r#"function f(a, ...rest) {
  let b = rest[rest.length - 3];
  let c = rest[rest.length - 2];
  let d = rest[rest.length - 1];
  return [a, b, c, d];
}

function f(a, ...rest) {
  return rest[-1];
}"#,
  r#"function f(a) {
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    var b = rest[rest.length - 3];
    var c = rest[rest.length - 2];
    var d = rest[rest.length - 1];
    return [a, b, c, d];
}
function f(a) {
    for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        rest[_key - 1] = arguments[_key];
    }
    return rest[-1];
}"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    regression_5787_exec,
    r#"function f1(a, ...rest) {
  let b = rest[rest.length - 3];
  let c = rest[rest.length - 2];
  let d = rest[rest.length - 1];
  return [a, b, c, d];
}
expect(f1(1, 2)).toEqual([1, undefined, undefined, 2]);

function f2(a, ...rest) {
  return rest[-1];
}
expect(f2(1, 2)).toBeUndefined();"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_args_deoptimiazation,
    r#"function x (...rest) {
  arguments;
}"#,
    r#"
function x() {
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  arguments;
}"#
);

test!(
    // Stage 0
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_arrow_fn,
    r#"var concat = (...arrs) => {
  var x = arrs[0];
  var y = arrs[1];
};

var somefun = function () {
  let get2ndArg = (a, b, ...args1) => {
    var _b = args1[0];
    let somef = (x, y, z, ...args2) => {
      var _a = args2[0];
    };
    let somefg = (c, d, e, f, ...args3) => {
      var _a = args3[0];
    };
    var _d = args1[1];
  };
  let get3rdArg = (...args) => args[2];
}

function demo1(...args) {
  return (i) => {
    return args[i+0];
  };
}

var x = (...rest) => {
  if (noNeedToWork) return 0;
  return rest;
};

var innerclassproperties = (...args) => (
  class {
    static args = args;
    args = args;
  }
);"#,
    r#"var concat = function () {
  var x = arguments.length <= 0 ? undefined : arguments[0];
  var y = arguments.length <= 1 ? undefined : arguments[1];
};

var somefun = function () {
  var get2ndArg = function (a, b) {
    var _b = arguments.length <= 2 ? undefined : arguments[2];

    var somef = function (x, y, z) {
      var _a = arguments.length <= 3 ? undefined : arguments[3];
    };

    var somefg = function (c, d, e, f) {
      var _a = arguments.length <= 4 ? undefined : arguments[4];
    };

    var _d = arguments.length <= 3 ? undefined : arguments[3];
  };

  var get3rdArg = function () {
    return arguments.length <= 2 ? undefined : arguments[2];
  };
};

function demo1() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (i) {
    return args[i + 0];
  };
}

var x = function () {
  if (noNeedToWork) return 0;

  for (var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    rest[_key2] = arguments[_key2];
  }

  return rest;
};

var innerclassproperties = function () {
  var _class, _temp;

  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return _temp = _class = function _class() {
    "use strict";

    babelHelpers.classCallCheck(this, _class);
    this.args = args;
  }, _class.args = args, _temp;
};"#
);

test!(
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_async_arrow_fn,
    r#"var concat = async (...arrs) => {
  var x = arrs[0];
  var y = arrs[1];
};

var x = async (...rest) => {
  if (noNeedToWork) return 0;
  return rest;
};"#,
    r#"var concat =
/*#__PURE__*/
function () {
  var _ref = babelHelpers.asyncToGenerator(function* () {
    var x = arguments.length <= 0 ? undefined : arguments[0];
    var y = arguments.length <= 1 ? undefined : arguments[1];
  });

  return function concat() {
    return _ref.apply(this, arguments);
  };
}();

var x =
/*#__PURE__*/
function () {
  var _ref2 = babelHelpers.asyncToGenerator(function* () {
    if (noNeedToWork) return 0;

    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return rest;
  });

  return function x() {
    return _ref2.apply(this, arguments);
  };
}();"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(crate::compat::es2015::arrow(), tr()),
    rest_binding_deoptimisation,
    r#"const deepAssign = (...args) => args = [];
"#,
    r#"var deepAssign = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args = [];
};"#
);

test!(
  // optimiation is not implemented
  ignore,
  ::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  rest_deepest_common_ancestor_earliest_child,
  r#"// single reference
function r(...rest){
  if (noNeedToWork) return 0;
  return rest;
}

// multiple references
function r(...rest){
  if (noNeedToWork) return 0;

  rest;
  rest;
}

// multiple nested references
function r(...rest){
  if (noNeedToWork) return 0;

  if (true) {
    return rest;
  } else {
    return rest;
  }
}

// deeply nested
function r(...rest){
  if (true) {
    if (true) {
      return rest;
    } else {
      return rest;
    }
  }
}

// nested reference with root reference
function r(...rest){
  if (noNeedToWork) return 0;

  if (lol) rest;
  rest;
}

// nested functions
function a(...args) {
  return function() {
    function b() {}

    console.log("Shouldn't args be from a's scope?", args);
  };
}

// loop
function runQueue(queue, ...args) {
  for (let i = 0; i < queue.length; i++) {
    queue[i](...args)
  }
}

// nested loop
function runQueue(queue, ...args) {
  if (foo) {
    for (let i = 0; i < queue.length; i++) {
      queue[i](...args)
    }
  }
}

function r(...rest){
  if (noNeedToWork) return 0;
  [rest[0]] = x;
  return rest;
}"#,
  r#"// single reference
function r() {
  if (noNeedToWork) return 0;

  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  return rest;
} // multiple references


function r() {
  if (noNeedToWork) return 0;

  for (var _len2 = arguments.length, rest = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    rest[_key2] = arguments[_key2];
  }

  rest;
  rest;
} // multiple nested references


function r() {
  if (noNeedToWork) return 0;

  for (var _len3 = arguments.length, rest = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    rest[_key3] = arguments[_key3];
  }

  if (true) {
    return rest;
  } else {
    return rest;
  }
} // deeply nested


function r() {
  if (true) {
    for (var _len4 = arguments.length, rest = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      rest[_key4] = arguments[_key4];
    }

    if (true) {
      return rest;
    } else {
      return rest;
    }
  }
} // nested reference with root reference


function r() {
  if (noNeedToWork) return 0;

  for (var _len5 = arguments.length, rest = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    rest[_key5] = arguments[_key5];
  }

  if (lol) rest;
  rest;
} // nested functions


function a() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return function () {
    function b() {}

    console.log("Shouldn't args be from a's scope?", args);
  };
} // loop


function runQueue(queue) {
  for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    args[_key7 - 1] = arguments[_key7];
  }

  for (var i = 0; i < queue.length; i++) {
    queue[i].apply(queue, args);
  }
} // nested loop


function runQueue(queue) {
  if (foo) {
    for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      args[_key8 - 1] = arguments[_key8];
    }

    for (var i = 0; i < queue.length; i++) {
      queue[i].apply(queue, args);
    }
  }
}

function r() {
  if (noNeedToWork) return 0;

  for (var _len9 = arguments.length, rest = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    rest[_key9] = arguments[_key9];
  }

  var _x = x;

  var _x2 = babelHelpers.slicedToArray(_x, 1);

  rest[0] = _x2[0];
  return rest;
}"#
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  rest_length,
  r#"var t = function (f, ...items) {
  items[0];
  items[items.length - 1];
};

function t(f, ...items) {
  items;
  items[0];
  items[items.length - 1];
}"#,
  r#"var t = function(f) {
    for(var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        items[_key - 1] = arguments[_key];
    }
    items[0];
    items[items.length - 1];
};
function t(f) {
    for(var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        items[_key - 1] = arguments[_key];
    }
    items;
    items[0];
    items[items.length - 1];
}"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_length_exec,
    r#"var length = function (a, b, ...items) {
  return items.length;
};

expect(length()).toBe(0);
expect(length(1)).toBe(0);
expect(length(1, 2)).toBe(0);
expect(length(1, 2, 3)).toBe(1);"#
);

test!(
    // optimisation is not implemented
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_member_expression_deoptimisation,
    r#"var t = function (...items) {
  var x = items[0];
  var y = items[1];
}

function t(...items) {
  var x = items[0];
  var y = items[1];
}

function t(...items) {
  var a = [];
  for (var i = 0; i < items.length; i++) {
    a.push(i);
  }
  return a;
}

// https://github.com/babel/babel/pull/2833#issuecomment-166039291
function t(...items) {
  for (let i = 0; i < items.length; i++) {
    return items[i];
  }
}"#,
    r#"var t = function () {
  var x = arguments.length <= 0 ? undefined : arguments[0];
  var y = arguments.length <= 1 ? undefined : arguments[1];
};

function t() {
  var x = arguments.length <= 0 ? undefined : arguments[0];
  var y = arguments.length <= 1 ? undefined : arguments[1];
}

function t() {
  var a = [];

  for (var i = 0; i < arguments.length; i++) {
    a.push(i);
  }

  return a;
} // https://github.com/babel/babel/pull/2833#issuecomment-166039291


function t() {
  for (var i = 0; i < arguments.length; i++) {
    return i < 0 || arguments.length <= i ? undefined : arguments[i];
  }
}"#
);

test!(
    // optimisation is not implemented
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_member_expression_optimisation,
    r#"var t = function (...items) {
  var x = items[0];
  var y = items[1];
}

function t(...items) {
  var x = items[0];
  var y = items[1];
}

function t(...items) {
  var a = [];
  for (var i = 0; i < items.length; i++) {
    a.push(i);
  }
  return a;
}

// https://github.com/babel/babel/pull/2833#issuecomment-166039291
function t(...items) {
  for (let i = 0; i < items.length; i++) {
    return items[i];
  }
}"#,
    r#"var t = function () {
  var x = arguments.length <= 0 ? undefined : arguments[0];
  var y = arguments.length <= 1 ? undefined : arguments[1];
};

function t() {
  var x = arguments.length <= 0 ? undefined : arguments[0];
  var y = arguments.length <= 1 ? undefined : arguments[1];
}

function t() {
  var a = [];

  for (var i = 0; i < arguments.length; i++) {
    a.push(i);
  }

  return a;
} // https://github.com/babel/babel/pull/2833#issuecomment-166039291


function t() {
  for (var i = 0; i < arguments.length; i++) {
    return i < 0 || arguments.length <= i ? undefined : arguments[i];
  }
}"#
);

test!(::swc_ecma_parser::Syntax::default(),
  |_| tr(),
  rest_multiple,
  r#"var t = function (f, ...items) {
    var x = f;
    x = items[0];
    x = items[1];
};

function t(f, ...items) {
    var x = f;
    x = items[0];
    x = items[1];
}

function u(f, g, ...items) {
    var x = f;
    var y = g;
    x[12] = items[0];
    y.prop = items[1];
    var z = items[2] | 0 || 12;
}"#,
  r#"var t = function(f) {
    for(var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        items[_key - 1] = arguments[_key];
    }
    var x = f;
    x = items[0];
    x = items[1];
};
function t(f) {
    for(var _len = arguments.length, items = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        items[_key - 1] = arguments[_key];
    }
    var x = f;
    x = items[0];
    x = items[1];
}
function u(f, g) {
    for(var _len = arguments.length, items = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        items[_key - 2] = arguments[_key];
    }
    var x = f;
    var y = g;
    x[12] = items[0];
    y.prop = items[1];
    var z = items[2] | 0 || 12;
}"#
);

test!(
    // optimisation is not implemented
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_nested_5656,
    r#"function a(...args) {
  const foo = (...list) => bar(...list);
  foo(...args);
}

function b(...args) {
  const foo = (...args) => bar(...args);
  foo(...args);
}

function c(...args) {
  const foo = (...args) => bar(...args);
  foo([]);
}

function d(thing, ...args) {
  const foo = (...args) => bar(...args);
  {
    let args = thing;
    foo(thing);
  }
}"#,
    r#"function a() {
  var foo = function () {
    return bar.apply(void 0, arguments);
  };

  foo.apply(void 0, arguments);
}

function b() {
  var foo = function () {
    return bar.apply(void 0, arguments);
  };

  foo.apply(void 0, arguments);
}

function c() {
  var foo = function () {
    return bar.apply(void 0, arguments);
  };

  foo([]);
}

function d(thing) {
  var foo = function () {
    return bar.apply(void 0, arguments);
  };

  {
    var args = thing;
    foo(thing);
  }
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| chain!(Classes, tr(), crate::compat::es2015::spread()),
    rest_nested_iife,
    r#"function broken(x, ...foo) {
  if (true) {
    class Foo extends Bar { }
    return hello(...foo)
  }
}"#,
    r#"function broken(x) {
    for(var _len = arguments.length, foo = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1; _key < _len; _key++){
        foo[_key - 1] = arguments[_key];
    }
    if (true) {
        var Foo = function(_Bar) {
            _inherits(Foo, _Bar);
            function Foo() {
                _classCallCheck(this, Foo);
                return _possibleConstructorReturn(this,
                    _getPrototypeOf(Foo).apply(this, arguments));
            }
            return Foo;
        }(Bar);
        return hello.apply(void 0, foo);
    }
}"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_patterns,
    r#"function foo(...[a]) {}"#,
    r#"function foo() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var a = _tmp[0];
}"#
);

test_exec!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_patterns_exec,
    r#"
function foo(...{ length }) {
  return length;
}

expect(foo(1, 2, 3)).toEqual(3);"#
);

test!(
    // optimisation is not implemented
    ignore,
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    rest_spread_optimisation,
    r#"// optimisation

function foo(...bar) {
  foo(...bar);
}

// deoptimisation

function foo(a, ...b) {
  foo(...b);
}

function foo(...b) {
  foo(1, ...b);
}

function foo(...args){
  args.pop()
  foo(...args);
}"#,
    r#"// optimisation
function foo() {
  foo.apply(void 0, arguments);
} // deoptimisation


function foo(a) {
  for (var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0),
   _key = 1; _key < _len; _key++) {
    b[_key - 1] = arguments[_key];
  }

  foo.apply(void 0, b);
}

function foo() {
  for (var _len2 = arguments.length, b = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    b[_key2] = arguments[_key2];
  }

  foo.apply(void 0, [1].concat(b));
}

function foo() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  args.pop();
  foo.apply(void 0, args);
}"#
);
