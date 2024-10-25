use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{
        arrow, block_scoping, classes, destructuring, parameters, parameters::Config, spread,
    },
    es2017::async_to_generator,
};
use swc_ecma_transforms_testing::{test, test_exec, test_fixture};

fn syntax() -> Syntax {
    Default::default()
}

fn tr(c: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        parameters(c, unresolved_mark),
        destructuring(destructuring::Config { loose: false }),
        block_scoping(unresolved_mark),
    )
}

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_254,
    "export const someFunction = (update = false, action = {}) => {}"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_227,
    "export default function fn1(...args) {
  fn2(...args);
}"
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
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    babel_6057_simple,
    r#"const a = 'bar';
function foo(...a) {
  return a;
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_before_last,
    r#"function foo({x,y} = "foo", b) {}"#
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
    |_| (classes(Default::default()), tr(Default::default())),
    default_iife_4253,
    r#"class Ref {
  constructor(id = ++Ref.nextID) {
    this.id = id
  }
}
Ref.nextID = 0"#
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
    |_| (classes(Default::default()), tr(Default::default())),
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
}"#
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
};"#
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
  {a6, a7} = {}) {}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_1,
    r#"const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    default_rest_2,
    r#"const a = 1;
  function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
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
rest3(undefined, 2)"#
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
};"#
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
};"#
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
};"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    destructuring_rest,
    r#"// #3861
function t(x = "default", { a, b }, ...args) {
  console.log(x, a, b, args);
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    regression_4333,
    r#"const args = 'bar';
function foo(...args) {
  return args;
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    regression_4348,
    r#"function first(...values) {
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
}"#
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
);"#
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
};"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            arrow(unresolved_mark),
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
            destructuring(destructuring::Config { loose: false }),
            block_scoping(unresolved_mark),
        )
    },
    rest_binding_deoptimisation,
    r#"const deepAssign = (...args) => args = [];
"#
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

    console.log("Shouldn't args be from a's scope?" args);
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
}"#
);

test!(
    syntax(),
    |_| (
        tr(Default::default()),
        classes(Default::default()),
        spread(Default::default())
    ),
    rest_nested_iife,
    r#"function broken(x, ...foo) {
  if (true) {
    class Foo extends Bar { }
    return hello(...foo)
  }
}"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    rest_patterns,
    r#"function foo(...[a]) {}"#
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
}"#
);

// parameters_rest_async_arrow_functions
test!(
    // See https://github.com/swc-project/swc/issues/490
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            async_to_generator(Default::default(), unresolved_mark),
            arrow(unresolved_mark),
            parameters(Default::default(), unresolved_mark),
        )
    },
    parameters_rest_async_arrow_functions_1,
    r#"
var concat = async (...arrs) => {
  var x = arrs[0];
  var y = arrs[1];
};
"#
);

// parameters_rest_async_arrow_functions
test!(
    // See https://github.com/swc-project/swc/issues/490
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            async_to_generator(Default::default(), unresolved_mark),
            arrow(unresolved_mark),
            parameters(Default::default(), unresolved_mark),
        )
    },
    parameters_rest_async_arrow_functions_2,
    r#"
var x = async (...rest) => {
  if (noNeedToWork) return 0;
  return rest;
};

"#
);

// regression_6057_simple
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    regression_6057_simple,
    r#"
const a = 'bar';
function foo(...a) {
  return a;
}


"#
);

// parameters_regression_4333
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
            block_scoping(unresolved_mark),
        )
    },
    parameters_regression_4333,
    r#"
const args = 'bar';
function foo(...args) {
  return args;
}

"#
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
            destructuring(Default::default()),
        )
    },
    issue_760,
    "const initialState = 'foo'
export default function reducer(state = initialState, action = {}) {
}"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    rest_in_top_level_arrow_1,
    "
    const arrow = (...args) => {
      console.log(args);
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    rest_in_top_level_arrow_2,
    "
    const arrow = () => (...args) => {
      console.log(args);
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    rest_in_top_level_arrow_3,
    "
    const arrow = () => (...args) => {
      console.log(this, args);
    }
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    rest_in_top_level_arrow_4,
    "
    const arrow = () => (this, (...args) => {
      console.log(this, args);
    })
    "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    rest_in_top_level_arrow_nested_1,
    "
    const arrow = (...args) => (this, () => (...args) => {
      console.log(this, args);
    })
    "
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_2825,
    "
const foo = (...rest) => console.log(this, rest)
const bar = () => this
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
"
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
    issue_3471,
    "
class A {
  a = 1 + ((...a) => a)
  b = (...b) => b + this
  static c = (c = 123) => c + this
}
  "
);

test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
        )
    },
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
"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_complex_assign,
    "function test({a: b} = {}) {}"
);

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    fn_len_default_array_destructuring,
    "function t([,,a] = [1,2,3]) { return a }"
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
    };"#
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

    }"#
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

test!(
    syntax(),
    |_| tr(Config {
        ignore_function_length: true
    }),
    issue_5030,
    r#"
    let v0 = (Array, Int8Array, ...Int32Array) => (NaN + Infinity) * Int32Array.length;
    console.log(v0(1, 2, 'hello', true, 7));
  "#
);

#[testing::fixture("tests/parameters/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                parameters(Default::default(), unresolved_mark),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
