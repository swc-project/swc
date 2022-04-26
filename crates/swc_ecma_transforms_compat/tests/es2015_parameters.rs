use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{
        arrow, block_scoping, classes, destructuring, parameters, parameters::Config, spread,
    },
    es2017::async_to_generator,
};
use swc_ecma_transforms_testing::{test, test_exec};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn tr(c: Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        parameters(c),
        destructuring(destructuring::Config { loose: false }),
        block_scoping(),
    )
}

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_254,
    "export const someFunction = (update = false, action = {}) => {}",
    "
export var someFunction = function () {
    var update = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, action = \
     arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    };
};
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
     func(a) {
        var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Date.now();
        return {
            a
        };
    }
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
    default_before_last,
    r#"function foo({x,y} = "foo", b) {}"#,
    r#"function foo() {
      var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "foo", x = ref.x, y = ref.y, b = arguments.length > 1 ? arguments[1] : void 0;
}"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
    default_earlier_params,
    r#"function f(a, b = a, c = b) { return c; }

expect(3).toBe(f(3));"#
);

test!(
    ignore,
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        tr(Default::default())
    ),
    default_iife_4253,
    r#"class Ref {
  constructor(id = ++Ref.nextID) {
    this.id = id
  }
}
Ref.nextID = 0"#,
    r#"var Ref = function Ref1() {
        "use strict";
        var id = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ++Ref1.nextID;
        _classCallCheck(this, Ref1);
        this.id = id;
    };
Ref.nextID = 0;"#
);

test_exec!(
    ignore,
    syntax(),
    // Stage0
    |_| tr(Default::default()),
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
    syntax(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        tr(Default::default())
    ),
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
    r#"var Ref = function Ref1() {
      "use strict";
      var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ref1;
      _classCallCheck(this, Ref1);
      this.ref = ref;
  }
var X = function X1() {
      "use strict";
      var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : foo;
      _classCallCheck(this, X1);
        this.x = x;
    };
"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    default_iife_self_exec,
    r#"class Ref {
  constructor(ref = Ref) {
    this.ref = ref
  }
}

expect(new Ref().ref).toBe(Ref);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_multiple,
    r#"var t = function (e = "foo", f = 5) {
  return e + " bar " + f;
};

var a = function (e, f = 5) {
  return e + " bar " + f;
};"#,
    "var t = function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : \"foo\", f = \
     arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
    return e + \" bar \" + f;
};
var a = function(e) {
    var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
    return e + \" bar \" + f;
};
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_mix,
    r#"function fn(
  a1,
  a2 = 4,
  {a3, a4},
  a5,
  {a6, a7} = {}) {}"#,
    "function fn(a1) {
    var a2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 4, ref = \
     arguments.length > 2 ? arguments[2] : void 0, a3 = ref.a3, a4 = ref.a4, a5 = \
     arguments.length > 3 ? arguments[3] : void 0, ref1 = arguments.length > 4 && arguments[4] \
     !== void 0 ? arguments[4] : {}, a6 = ref1.a6, a7 = ref1.a7;
}
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_1,
    r#"const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)"#,
    r#"var a = 1;
function rest() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(b).toBe(1);
}
rest(undefined, 2);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_2,
    r#"const a = 1;
  function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
}
rest2(undefined, 2);"#,
    r#"var a = 1;
function rest2() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(a1[0]).toBe(2);
}
rest2(undefined, 2);"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_3,
    r#"const a = 1;
    function rest3(b = a, ...a) {
  expect(a).toHaveLength(1);
}
rest3(undefined, 2)"#,
    r#"var a = 1;
function rest3() {
    var b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : a;
    for(var _len = arguments.length, a1 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        a1[_key - 1] = arguments[_key];
    }
    expect(a1).toHaveLength(1);
}
rest3(undefined, 2);"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
    default_setter_noexec,
    r#"const obj = {
  set field(num = 1) {
    this.num = num;
  }
};"#,
    "var obj = {
    set field (num){
        if (num === void 0) num = 1;
        this.num = num;
    }
};
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_setter_complex,
    r#"const obj = {
set obj({ a, b } = {}) {
  this.num = { a, b };
},
set arr([x, y] = []) {
  this.num = { x, y }
}
};"#,
    "var obj = {
      set obj (param){
        var ref = param === void 0 ? {} : param, a = ref.a, b = ref.b;
        this.num = {
            a,
            b
        };
    },
    set arr (param){
        var ref1 = _slicedToArray(param === void 0 ? [] : param, 2), x = ref1[0], y = ref1[1];
        this.num = {
            x,
            y
        };
      }
};
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
    default_single,
    r#"var t = function (f = "foo") {
  return f + " bar";
};"#,
    r#"var t = function() {
    var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "foo";
    return f + " bar";
};"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    destructuring_rest,
    r#"// #3861
function t(x = "default", { a, b }, ...args) {
  console.log(x, a, b, args);
}"#,
    r#"// #3861
function t() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "default", ref = arguments.length > 1 ? arguments[1] : void 0, a = ref.a, b = ref.b;
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        args[_key - 2] = arguments[_key];
    }
    console.log(x, a, b, args);
}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    // type
    |_| tr(Default::default()),
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

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
    rest_arrow_fn,
    r#"var concat = (...arrs) => {
  var x = arrs[0];
  var y = arrs[1];
};

var somefun = function () {
  let get2ndArg = (a, b, ...args) => {
    var _b = args[0];
    let somef = (x, y, z, ...args2) => {
      var _a = args2[0];
    };
    let somefg = (c, d, e, f, ...args3) => {
      var _a = args3[0];
    };
    var _d = args[1];
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

    _classCallCheck(this, _class);
    this.args = args;
  }, _class.args = args, _temp;
};"#
);

test!(
    ignore,
    syntax(),
    |_| tr(Default::default()),
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
  var _ref = _asyncToGenerator(function* () {
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
  var _ref2 = _asyncToGenerator(function* () {
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
    syntax(),
    |_| chain!(arrow(), tr(Default::default())),
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
    // optimization is not implemented
    ignore,
    syntax(),
    |_| tr(Default::default()),
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

  var _x2 = _slicedToArray(_x, 1);

  rest[0] = _x2[0];
  return rest;
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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

test!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |t| chain!(
        tr(Default::default()),
        classes(Some(t.comments.clone()), Default::default()),
        spread(Default::default())
    ),
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
        let Foo = function(Bar) {
            "use strict";
            _inherits(Foo, Bar);
            var _super = _createSuper(Foo);
            function Foo() {
                _classCallCheck(this, Foo);
                return _super.apply(this, arguments);
            }
            return Foo;
        }(Bar);
        return hello.apply(void 0, _toConsumableArray(foo));
    }
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    rest_patterns,
    r#"function foo(...[a]) {}"#,
    r#"function foo() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = _slicedToArray(_tmp, 1), a = __tmp[0];
}"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
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
    syntax(),
    |_| tr(Default::default()),
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

//// regression_6057_expanded
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "presets": ["env"],
//  "plugins": ["proposal-class-properties"]
//}
//"#),
//    regression_6057_expanded,
//    r#"
//import args from 'utils/url/args';
//
//export default class App extends Component {
//  exportType = ''
//
//  componentDidMount() {
//    this.exportType = args.get('type', window.location.href);
//  }
//}
//
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports["default"] = void 0;
//
//var _args = _interopRequireDefault(require("utils/url/args"));
//
//function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {
// "default": obj }; }
//
//function _typeof(obj) { if (typeof Symbol === "function" && typeof
// Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return
// typeof obj; }; } else { _typeof = function _typeof(obj) { return obj &&
// typeof Symbol === "function" && obj.constructor === Symbol && obj !==
// Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
//
//function _classCallCheck(instance, Constructor) { if (!(instance instanceof
// Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
//function _defineProperties(target, props) { for (var i = 0; i < props.length;
// i++) { var descriptor = props[i]; descriptor.enumerable =
// descriptor.enumerable || false; descriptor.configurable = true; if ("value"
// in descriptor) descriptor.writable = true; Object.defineProperty(target,
// descriptor.key, descriptor); } }
//
//function _createClass(Constructor, protoProps, staticProps) { if (protoProps)
// _defineProperties(Constructor.prototype, protoProps); if (staticProps)
// _defineProperties(Constructor, staticProps); return Constructor; }
//
//function _possibleConstructorReturn(self, call) { if (call && (_typeof(call)
// === "object" || typeof call === "function")) { return call; } return
// _assertThisInitialized(self); }
//
//function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ?
// Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ ||
// Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
//
//function _assertThisInitialized(self) { if (self === void 0) { throw new
// ReferenceError("this hasn't been initialised - super() hasn't been called");
// } return self; }
//
//function _inherits(subClass, superClass) { if (typeof superClass !==
// "function" && superClass !== null) { throw new TypeError("Super expression
// must either be null or a function"); } subClass.prototype =
// Object.create(superClass && superClass.prototype, { constructor: { value:
// subClass, writable: true, configurable: true } }); if (superClass)
// _setPrototypeOf(subClass, superClass); }
//
//function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ||
// function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return
// _setPrototypeOf(o, p); }
//
//function _defineProperty(obj, key, value) { if (key in obj) {
// Object.defineProperty(obj, key, { value: value, enumerable: true,
// configurable: true, writable: true }); } else { obj[key] = value; } return
// obj; }
//
//var App =
// /*#__PURE__*/
//function (_Component) {
//  _inherits(App, _Component);
//
//  function App() {
//    var _getPrototypeOf2;
//
//    var _this;
//
//    _classCallCheck(this, App);
//
//    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key <
// _len; _key++) {      args[_key] = arguments[_key];
//    }
//
//    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 =
// _getPrototypeOf(App)).call.apply(_getPrototypeOf2, [this].concat(args)));
//
//    _defineProperty(_assertThisInitialized(_this), "exportType", '');
//
//    return _this;
//  }
//
//  _createClass(App, [{
//    key: "componentDidMount",
//    value: function componentDidMount() {
//      this.exportType = _args["default"].get('type', window.location.href);
//    }
//  }]);
//
//  return App;
//}(Component);
//
//exports["default"] = App;
//
//"#
//);

//// parameters_iife_this_9385
//test!(
//    syntax(),
//    |_| tr(r#"{
//  "plugins": ["transform-typescript"],
//  "presets": ["env"]
//}
//"#),
//    parameters_iife_this_9385,
//    r#"
//export class Test {
//  invite(options: { privacy: string } = {}) {
//    const privacy = options.privacy || "Private"
//    console.log(this)
//  }
//}
//"#,
//    r#"
//"use strict";
//
//Object.defineProperty(exports, "__esModule", {
//  value: true
//});
//exports.Test = void 0;
//
//function _classCallCheck(instance, Constructor) { if (!(instance instanceof
// Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//
//function _defineProperties(target, props) { for (var i = 0; i < props.length;
// i++) { var descriptor = props[i]; descriptor.enumerable =
// descriptor.enumerable || false; descriptor.configurable = true; if ("value"
// in descriptor) descriptor.writable = true; Object.defineProperty(target,
// descriptor.key, descriptor); } }
//
//function _createClass(Constructor, protoProps, staticProps) { if (protoProps)
// _defineProperties(Constructor.prototype, protoProps); if (staticProps)
// _defineProperties(Constructor, staticProps); return Constructor; }
//
//var Test =
// /*#__PURE__*/
//function () {
//  function Test() {
//    _classCallCheck(this, Test);
//  }
//
//  _createClass(Test, [{
//    key: "invite",
//    value: function invite() {
//      var options = arguments.length > 0 && arguments[0] !== undefined ?
// arguments[0] : {};      var privacy = options.privacy || "Private";
//      console.log(this);
//    }
//  }]);
//
//  return Test;
//}();
//
//exports.Test = Test;
//
//"#
//);

// parameters_rest_async_arrow_functions
test!(
    // See https://github.com/swc-project/swc/issues/490
    ignore,
    syntax(),
    |_| chain!(
        async_to_generator(Default::default()),
        arrow(),
        parameters(Default::default()),
    ),
    parameters_rest_async_arrow_functions_1,
    r#"
var concat = async (...arrs) => {
  var x = arrs[0];
  var y = arrs[1];
};
"#,
    r#"
var concat = function () {
  var _ref = _asyncToGenerator(function* () {
    var x = arguments.length <= 0 ? undefined : arguments[0];
    var y = arguments.length <= 1 ? undefined : arguments[1];
  });

  return function concat() {
    return _ref.apply(this, arguments);
  };
}();
"#
);

// parameters_rest_async_arrow_functions
test!(
    // See https://github.com/swc-project/swc/issues/490
    ignore,
    syntax(),
    |_| chain!(
        async_to_generator(Default::default()),
        arrow(),
        parameters(Default::default()),
    ),
    parameters_rest_async_arrow_functions_2,
    r#"
var x = async (...rest) => {
  if (noNeedToWork) return 0;
  return rest;
};

"#,
    r#"
var x = function () {
  var _ref = _asyncToGenerator(function* () {
    if (noNeedToWork) return 0;

    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return rest;
  });

  return function x() {
    return _ref.apply(this, arguments);
  };
}();

"#
);

// regression_6057_simple
test!(
    syntax(),
    |_| parameters(Default::default()),
    regression_6057_simple,
    r#"
const a = 'bar';
function foo(...a) {
  return a;
}


"#,
    r#"
const a = 'bar';

function foo() {
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }

  return a;
}

"#
);

// parameters_regression_4333
test!(
    syntax(),
    |_| chain!(parameters(Default::default()), block_scoping(),),
    parameters_regression_4333,
    r#"
const args = 'bar';
function foo(...args) {
  return args;
}

"#,
    r#"
var args = 'bar';

function foo() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
}

"#
);

test!(
    syntax(),
    |_| chain!(
        parameters(Default::default()),
        destructuring(Default::default())
    ),
    issue_760,
    "const initialState = 'foo'
export default function reducer(state = initialState, action = {}) {
}",
    "const initialState = 'foo';
  export default function reducer() {
      let state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : initialState, \
     action = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  }"
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    rest_in_top_level_arrow_1,
    "
    const arrow = (...args) => {
      console.log(args);
    }
    ",
    "
    const arrow = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        console.log(args);
    };
    "
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    rest_in_top_level_arrow_2,
    "
    const arrow = () => (...args) => {
      console.log(args);
    }
    ",
    "
    const arrow = ()=>function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        console.log(args);
    };
    "
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    rest_in_top_level_arrow_3,
    "
    const arrow = () => (...args) => {
      console.log(this, args);
    }
    ",
    "
    const arrow = ()=>{
        var _this = this;
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; \
     _key++){
                args[_key] = arguments[_key];
            }
            console.log(_this, args);
        };
    };
    "
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    rest_in_top_level_arrow_4,
    "
    const arrow = () => (this, (...args) => {
      console.log(this, args);
    })
    ",
    "
    const arrow = ()=>{
      var _this = this;
      return this, function() {
          for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
              args[_key] = arguments[_key];
          }
          console.log(_this, args);
      };
    };
    "
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    rest_in_top_level_arrow_nested_1,
    "
    const arrow = (...args) => (this, () => (...args) => {
      console.log(this, args);
    })
    ",
    "
    var _this = this;
    const arrow = function() {
        for(var _len1 = arguments.length, args = new Array(_len1), _key1 = 0; _key1 < _len1; \
     _key1++){
            args[_key1] = arguments[_key1];
        }
        return _this, ()=>{
            var _this1 = _this;
            return function() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; \
     _key++){
                    args[_key] = arguments[_key];
                }
                console.log(_this1, args);
            };
        };
    };
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_2825,
    "
const foo = (...rest) => console.log(this, rest)
const bar = () => this
  ",
    "
var _this = this;

var foo = function () {
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  return console.log(_this, rest);
};

var bar = () => this;
  "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_2811,
    "
class Foo extends (function(){}) {
constructor(){
  var foo = (...rest) => [rest, this];

  if (true){
      console.log(super(), foo());
  } else {
      super();
      console.log(foo());
  }
}
}
",
    "
class Foo extends function () {} {
constructor() {
  var _this;

  var foo = function() {
    for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return [rest, _this];
  };

  if (true) {
    console.log((super(), _this = this), foo());
  } else {
    super(), _this = this;
    console.log(foo());
  }
}

}
"
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    issue_3471,
    "
class A {
  a = 1 + ((...a) => a)
  b = (...b) => b + this
  static c = (c = 123) => c + this
}
  ",
    "
var _this = this;

class A {
  a = 1 + function () {
    for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return a;
  };
  b = (() => {
    var _this1 = this;

    return function () {
      for (var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++) {
        b[_key] = arguments[_key];
      }

      return b + _this1;
    };
  })();
  static c = function () {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 123;
    return c + _this;
  };
}
  "
);

test!(
    syntax(),
    |_| parameters(Default::default()),
    issue_3569,
    "
export class TableView extends React.Component {
  constructor(props){
    super(props);
    this.getSearchForm = (innerWidth = 0)=>{
      this.getProps();
    };
  }
}
",
    "
export class TableView extends React.Component {
  constructor(props){
    var _this;
    super(props), _this = this;
    this.getSearchForm = function () {
      let innerWidth = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      _this.getProps();
    };
  }
}
"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_complex_assign,
    "function test({a: b} = {}) {}",
    "function test(param) {
      var ref = param === void 0 ? {} : param,
          b = ref.a;
    }"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_array_destructuring,
    "function t([,,a] = [1,2,3]) { return a }",
    "function t(param) {
      var ref = _slicedToArray(param === void 0 ? [1, 2, 3] : param, 3),
          a = ref[2];

      return a;
    }"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_array_destructuring_exec,
    "function t([,,a] = [1,2,3]) { return a }

  expect(t()).toBe(3);
  expect(t([4,5,6])).toBe(6);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_earlier_params,
    "function f(a, b = a, c = b) { return c; }

    expect(f(3)).toBe(3);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_1128,
    "const bar = true;

  function foo(a = bar, ...b) {
    const bar = false;
    expect(b[0]).toBe(2);
    expect(b[1]).toBe(3);
  }

  foo(1, 2, 3);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_4253,
    "class Ref {
      static nextId = 0
      constructor(id = ++Ref.nextId, n = id) {
        this.id = n
      }
    }

    expect(new Ref().id).toBe(1);
    expect(new Ref().id).toBe(2);"
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_iife_self,
    "class Ref {
      constructor(ref = Ref) {
        this.ref = ref
      }
    }

    expect(new Ref().ref).toBe(Ref);"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_multiple,
    r#"
    var t = function (e = "foo", f = 5) {
      return e + " bar " + f;
    };

    var a = function (e, f = 5) {
      return e + " bar " + f;
    };"#,
    r#"var t = function (e, f) {
      if (e === void 0) e = "foo";

      if (f === void 0) f = 5;

      return e + " bar " + f;
    };

    var a = function (e, f) {
      if (f === void 0) f = 5;

      return e + " bar " + f;
    };
"#
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_object_destructuring,
    "function required(msg) {
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

    expect(sum({arr:[1,2]})).toBe(3);"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_rest_mix,
    r#"
    function fn(
      a1,
      a2 = 4,
      {a3, a4},
      a5,
      {a6, a7} = {}) {

    }"#,
    r#"function fn(a1, a2, param, a5, param1) {
      if (a2 === void 0) a2 = 4;

      var a3 = param.a3,
          a4 = param.a4;

      var ref = param1 === void 0 ? {} : param1,
          a6 = ref.a6,
          a7 = ref.a7;
    }
"#
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_rest,
    "const a = 1;
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
    rest3(undefined, 2)"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_single,
    r#"
    var t = function (f = "foo") {
      return f + " bar";
    };"#,
    r#"var t = function (f) {
      if (f === void 0) f = "foo";

      return f + " bar";
    };"#
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_destructing_rest,
    r#"
    function t(x = "default", { a, b }, ...args) {
      console.log(x, a, b, args);
    }"#,
    r#"function t(x, param) {
      if (x === void 0) x = "default";

      var a = param.a, b = param.b;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      console.log(x, a, b, args);
    }"#
);

test_exec!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_overwrite_undefined,
    "function t(undefined = 17, a = 3) {
      return a;
    }

    expect(t()).toBe(3);"
);
