use std::{fs::read_to_string, path::PathBuf};

use swc_common::{Mark, Spanned};
use swc_ecma_ast::*;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_transforms_compat::{
    es2015,
    es2015::{
        arrow, block_scoping, destructuring, function_name, generator::generator, parameters,
    },
    es2017::async_to_generator,
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec};
use swc_ecma_visit::{fold_pass, Fold, FoldWith};

struct ParenRemover;
impl Fold for ParenRemover {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr;
        let span = expr.span();

        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Paren(ParenExpr { expr, .. }) => match *expr {
                Expr::Member(e) => MemberExpr { span, ..e }.into(),
                Expr::New(e) => NewExpr { span, ..e }.into(),
                _ => *expr,
            },
            _ => expr,
        }
    }
}

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        fold_pass(ParenRemover),
        arrow(unresolved_mark),
        parameters(Default::default(), unresolved_mark),
        destructuring(destructuring::Config { loose: false }),
        function_name(),
        async_to_generator(Default::default(), unresolved_mark),
        fixer(None),
    )
}

fn with_resolver() -> impl Pass {
    let unresolved = Mark::new();
    let top_level = Mark::new();
    (
        resolver(unresolved, top_level, false),
        async_to_generator(Default::default(), unresolved),
    )
}

test!(
    syntax(),
    |_| tr(),
    issue_216,
    r#"
async function foo(bar) {
  bar && await bar();
}
"#
);

test!(
    syntax(),
    |_| tr(),
    async_arrow_in_method,
    r#"
let TestClass = {
  name: "John Doe",

  testMethodFailure() {
    return new Promise(async (resolve) => {
      console.log(this);
      setTimeout(resolve, 1000);
    });
  }
};
"#
);

test!(
    syntax(),
    |_| tr(),
    async_default_arguments,
    r#"
function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}

async function foo({ a, b = mandatory("b") }) {
  return Promise.resolve(b);
}
"#
);

test!(
    syntax(),
    |_| tr(),
    async_iife,
    r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });
"#
);

test!(
    syntax(),
    |_| tr(),
    r#async,
    r#"
class Foo {
  async foo() {
    var wat = await bar();
  }
}
"#
);

test!(
    syntax(),
    |_| tr(),
    deeply_nested_asyncs,
    r#"
async function s(x, ...args) {
  let t = async (y, a) => {
    let r = async (z, b, ...innerArgs) =>  {
      await z;
      console.log(this, innerArgs, arguments);
      return this.x;
    }
    await r();

    console.log(this, args, arguments);
    return this.g(r);
  }

  await t();
  return this.h(t);
}
"#
);

test!(
    syntax(),
    |_| tr(),
    expression,
    r#"
var foo = async function () {
  var wat = await bar();
};

var foo2 = async function () {
  var wat = await bar();
},
bar = async function () {
  var wat = await foo();
};
"#
);

test!(
    syntax(),
    |_| tr(),
    named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};
"#
);

test!(
    syntax(),
    |_| tr(),
    no_parameters_and_no_id,
    r#"
foo(async function () {
});"#
);

test!(
    syntax(),
    |_| tr(),
    object_method_with_arrows,
    r#"
class Class {
  async method() {
    this;
    () => this;
    () => {
      this;
      () => this;
      function x() {
        this;
        () => {this}
        async () => {this}
      }
    }
    function x() {
      this;
      () => {this}
      async () => {this}
    }
  }
}
"#
);

test!(
    syntax(),
    |_| tr(),
    object_method_with_super,
    r#"class Foo extends class {} {
  async method() {
    super.method();

    var arrow = () => super.method();
  }
}"#
);

test_exec!(
    syntax(),
    |_| tr(),
    class_method_this,
    r#"
class Foo {
  async foo() {
    this.x = 1;
    return () => this;
  }
}

let foo = new Foo();
return foo.foo().then(cur => {
  expect(cur().x).toBe(1);
});
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    class_method_super,
    r#"
class Foo {
  async foo() {
    this.x = 1;
    return () => this;
  }
}
class Bar extends Foo {
  async bar() {
    return await super.foo();
  }
}

let bar = new Bar();
return bar.bar().then(cur => {
  expect(cur().x).toBe(1);
});
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    class_getter_super,
    r#"
let called = false;
class Foo {
  get foo() {
    called = true;
    return 1
  }
}
class Bar extends Foo {
  async bar() {
    return super.foo;
  }
}

let bar = new Bar();
return bar.bar().then(foo => {
  expect(called).toBe(true);
  expect(foo).toBe(1);
});
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    class_setter_super,
    r#"
let called = false;
class Foo {
  set foo(v) {
    this.v = v;
    called = true;
  }
}
class Bar extends Foo {
  async bar() {
    super.foo = 1;
    return this;
  }
}

let bar = new Bar();
return bar.bar().then(bar => {
  expect(called).toBe(true);
  expect(bar.v).toBe(1);
});
"#
);

test_exec!(
    syntax(),
    |_| tr(),
    class_method_this_complex,
    r#"
class Class {
  async method() {
    console.log(this);
    expect(this.x).toBe(1);
    (() => expect(this.x).toBe(1))();
    (() => {
      expect(this.x).toBe(1);
      (() => expect(this.x).toBe(1))();
      function x() {
        this;
        () => {this}
        async () => {this}
      }
    })()
    function x() {
      this;
      () => {this}
      async () => {this}
    }
  }
}

let c = new Class();
c.x = 1;
return c.method();
"#
);

test!(
    syntax(),
    |_| tr(),
    object_method,
    r#"
let obj = {
  a: 123,
  async foo(bar) {
    return await baz(bar);
  }
}"#
);

test!(
    syntax(),
    |_| tr(),
    babel_parameters,
    r#"
async function foo(bar) {

}
"#
);

test!(
    syntax(),
    |_| tr(),
    statement,
    r#"
async function foo() {
  var wat = await bar();
}
"#
);

test!(
    syntax(),
    |_| tr(),
    issue_319,
    "export default obj({
    async f() {
        await g();
    }
});"
);

test_exec!(
    syntax(),
    |t| (
        tr(),
        es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        )
    ),
    issue_400_1,
    "class A {
    constructor() {
        this.a_num = 10;
    }

    async print() {
        expect(this.a_num).toBe(10);
    }
}

class B extends A {
    constructor(num) {
        super();
        this.b_num = num;
    }

    async print() {
        expect(this.b_num).toBe(20);
        await super.print();
    }
}

return (new B(20)).print().then(() => console.log('Done'));"
);

test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_400_2,
    "class A {
    constructor() {
        this.a_num = 10;
    }

    async print() {
        expect(this.a_num).toBe(10);
    }
}


class B extends A {
    constructor(num) {
        super();
        this.b_num = num;
    }

    async print() {
        expect(this.b_num).toBe(20);
        await super.print();
    }
}

return (new B(20)).print().then(() => console.log('Done'));"
);

test_exec!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        (
            async_to_generator(Default::default(), unresolved_mark),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default(),
            ),
        )
    },
    issue_400_3,
    "class A {
    constructor() {
        this.a_num = 10;
    }

    async print() {
        expect(this.a_num).toBe(10);
    }
}

return (new A()).print();"
);

//// regression_7178
//test!(
//    syntax(),
//    |_| (jsx(), jsc_constant_elements(),
// async_to_generator(Default::default()),),    regression_7178,
//    r#"
//const title = "Neem contact op";
//
//async function action() {
//  return <Contact title={title} />;
//}
//
//"#
//    r#"
//const title = "Neem contact op";
//
//function action() {
//  return _action.apply(this, arguments);
//}
//
//var _ref =
// /*#__PURE__*/
//React.createElement(Contact, {
//  title: title
//});
//
//function _action() {
//  _action = _async_to_generator(function* () {
//    return _ref;
//  });
//  return _action.apply(this, arguments);
//}
//
//"#
//);

// bluebird_coroutines_named_expression
test!(
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    bluebird_coroutines_named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};

"#
);

// export_async_lone_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_async_lone_export,
    r#"
export async function foo () { }

"#
);

// bluebird_coroutines_arrow_function
test!(
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    bluebird_coroutines_arrow_function,
    r#"
(async () => { await foo(); })()

"#
);

// regression_t6882

// regression_t7194
test!(
    // Optimization
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            async_to_generator(Default::default(), unresolved_mark),
            arrow(unresolved_mark),
        )
    },
    regression_t7194,
    r#"
function f() {
  g(async function() {
    c(() => this);
  });
}

(async function () {
  console.log('async wrapper:', this === 'foo')

  ;(() => {
    console.log('nested arrow:', this === 'foo')
  })()
}).call('foo')

"#
);

// async_to_generator_shadowed_promise
test!(
    // TODO: Unignore this
    ignore,
    syntax(),
    |_| with_resolver(),
    async_to_generator_shadowed_promise,
    r#"
let Promise;
async function foo() {
  await new Promise(resolve => { resolve() });
}

"#
);

// async_to_generator_object_method_with_arrows
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_object_method_with_arrows,
    r#"
class Class {
  async method() {
    this;
    () => this;
    () => {
      this;
      () => this;
      function x() {
        this;
        () => {this}
        async () => {this}
      }
    }
    function x() {
      this;
      () => {this}
      async () => {this}
    }
  }
}
"#
);

// async_to_generator_object_method
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_object_method,
    r#"
let obj = {
  a: 123,
  async foo(bar) {
    return await baz(bar);
  }
}

"#
);

// bluebird_coroutines_class
test!(
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    bluebird_coroutines_class,
    r#"
class Foo {
  async foo() {
    var wat = await bar();
  }
}

"#
);

// async_to_generator_async_iife_with_regenerator
test!(
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        (
            async_to_generator(Default::default(), unresolved_mark),
            //regenerator(),
            arrow(unresolved_mark),
        )
    },
    async_to_generator_async_iife_with_regenerator,
    r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });

"#
);

//// regression_gh_6923
//test!(syntax(),|_| tr("{
//  "presets": [
//    [
//      "env"
//      {
//        "targets": {
//          "chrome": "62"
//          "edge": "15"
//          "firefox": "52"
//          "safari": "11"
//        }
//      }
//    ]
//  ]
//}
//"), regression_gh_6923, r#"
//async function foo() {
//	(async function (number) {
//		const tmp = number
//	})
//}
//"# r#"
//function foo() {
//  return _foo.apply(this, arguments);
//}
//
//function _foo() {
//  _foo = _async_to_generator(
//  /*#__PURE__*/
//  regeneratorRuntime.mark(function _callee2() {
//    return regeneratorRuntime.wrap(function _callee2$(_context2) {
//      while (1) switch (_context2.prev = _context2.next) {
//        case 0:
//          /*#__PURE__*/
//          (function () {
//            var _ref = _async_to_generator(
//            /*#__PURE__*/
//            regeneratorRuntime.mark(function _callee(number) {
//              var tmp;
//              return regeneratorRuntime.wrap(function _callee$(_context) {
//                while (1) switch (_context.prev = _context.next) {
//                  case 0:
//                    tmp = number;
//
//                  case 1:
//                  case "end":
//                    return _context.stop();
//                }
//              }, _callee);
//            }));
//
//            return function (_x) {
//              return _ref.apply(this, arguments);
//            };
//          })();
//
//        case 1:
//        case "end":
//          return _context2.stop();
//      }
//    }, _callee2);
//  }));
//  return _foo.apply(this, arguments);
//}
//
//"#);

// async_to_generator_named_expression
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};

"#
);

//// async_to_generator_async_iife_with_regenerator_spec
//test!(
//    syntax(),
//    |_| (async_to_generator(Default::default()), arrow(),
// regenerator(),),    async_to_generator_async_iife_with_regenerator_spec,
//    r#"
//(async function() { await 'ok' })();
//(async () => { await 'ok' })();
//(async function notIIFE() { await 'ok' });
//(async () => { await 'not iife' });
//
//"#
//    r#"
//var _this = this;
//
//_async_to_generator(
// /*#__PURE__*/
//regeneratorRuntime.mark(function _callee() {
//  return regeneratorRuntime.wrap(function _callee$(_context) {
//    while (1) switch (_context.prev = _context.next) {
//      case 0:
//        _context.next = 2;
//        return 'ok';
//
//      case 2:
//      case "end":
//        return _context.stop();
//    }
//  }, _callee);
//}))();
//_async_to_generator(
// /*#__PURE__*/
//regeneratorRuntime.mark(function _callee2() {
//  return regeneratorRuntime.wrap(function _callee2$(_context2) {
//    while (1) switch (_context2.prev = _context2.next) {
//      case 0:
//        _new_arrow_check(this, _this);
//        _context2.next = 3;
//        return 'ok';
//
//      case 3:
//      case "end":
//        return _context2.stop();
//    }
//  }, _callee2, this);
//})).bind(this)();
//
// /*#__PURE__*/
//(function () {
//  var _notIIFE = _async_to_generator(
//  /*#__PURE__*/
//  regeneratorRuntime.mark(function _callee3() {
//    return regeneratorRuntime.wrap(function _callee3$(_context3) {
//      while (1) switch (_context3.prev = _context3.next) {
//        case 0:
//          _context3.next = 2;
//          return 'ok';
//
//        case 2:
//        case "end":
//          return _context3.stop();
//      }
//    }, _callee3);
//  }));
//
//  function notIIFE() {
//    return _notIIFE.apply(this, arguments);
//  }
//
//  return notIIFE;
//})();
//
// /*#__PURE__*/
//_async_to_generator(
// /*#__PURE__*/
//regeneratorRuntime.mark(function _callee4() {
//  return regeneratorRuntime.wrap(function _callee4$(_context4) {
//    while (1) switch (_context4.prev = _context4.next) {
//      case 0:
//        _new_arrow_check(this, _this);
//        _context4.next = 3;
//        return 'not iife';
//
//      case 3:
//      case "end":
//        return _context4.stop();
//    }
//  }, _callee4, this);
//})).bind(this);
//
//"#
//);

// async_to_generator_async_arrow_in_method
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_async_arrow_in_method,
    r#"
let TestClass = {
  name: "John Doe",

  testMethodFailure() {
    return new Promise(async (resolve) => {
      console.log(this);
      setTimeout(resolve, 1000);
    });
  }
};

"#
);

// bluebird_coroutines_statement
test!(
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    bluebird_coroutines_statement,
    r#"
async function foo() {
  var wat = await bar();
}

"#
);

// regression_4943
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            async_to_generator(Default::default(), unresolved_mark),
            parameters(Default::default(), unresolved_mark),
            destructuring(destructuring::Config { loose: false }),
        )
    },
    regression_4943,
    r#"
"use strict";

function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}

async function foo({ a, b = mandatory("b") }) {
  return Promise.resolve(b);
}

"#
);

// export_async_default_arrow_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_async_default_arrow_export,
    r#"
export default async () => { return await foo(); }

"#
);

// async_to_generator_function_arity
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_function_arity,
    r#"
async function one(a, b = 1) {}
async function two(a, b, ...c) {}
async function three(a, b = 1, c, d = 3) {}
async function four(a, b = 1, c, ...d) {}
async function five(a, {b}){}
async function six(a, {b} = {}){}

"#
);

// async_to_generator_object_method_with_super
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_object_method_with_super_caching,
    r#"
class Foo extends class {} {
  async method() {
    super.method();

    var arrow = () => super.method();
  }
}

"#
);

// export_async_default_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_async_default_export,
    r#"
export default async function myFunc() {}

"#
);

// async_to_generator_async
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_async,
    r#"
class Foo {
  async foo() {
    var wat = await bar();
  }
}

"#
);

// regression_8783
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    regression_8783,
    r#"
(async function poll() {
  console.log(await Promise.resolve('Hello'))
  setTimeout(poll, 1000);
})();
"#
);

// async_to_generator_deeply_nested_asyncs
test!(
    syntax(),
    |_| with_resolver(),
    async_to_generator_deeply_nested_asyncs,
    r#"
async function s(x, ...args) {
  let t = async (y, a) => {
    let r = async (z, b, ...innerArgs) =>  {
      await z;
      console.log(this, innerArgs, arguments);
      return this.x;
    }
    await r();

    console.log(this, args, arguments);
    return this.g(r);
  }

  await t();
  return this.h(t);
}

"#
);

// export_async_import_and_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_async_import_and_export,
    r#"
import bar from 'bar';

export async function foo () { }

"#
);

// async_to_generator_shadowed_promise_nested
test!(
    // TODO: Unignore this
    ignore,
    syntax(),
    |_| with_resolver(),
    async_to_generator_shadowed_promise_nested,
    r#"
let Promise;

async function foo() {
  let Promise;

  await bar();

  async function bar() {
    return Promise.resolve();
  }
}

"#
);

// bluebird_coroutines

// export_async

// regression_4599
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    regression_4599,
    r#"
async () => await promise

async () => { await promise }

"#
);

// regression_4943_exec
test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    regression_4943_exec,
    r#"
"use strict";

function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}

async function foo({ a, b = mandatory("b") } = {}) {
  return Promise.resolve(b);
}

return foo().then(() => {
  throw new Error('should not occur');
}, () => true);

"#
);

// regression_8783_exec
test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    regression_8783_exec,
    r#"
let log = [];

let resolve;
const main = new Promise(r => { resolve = r });

(async function poll(count) {
  log.push(await Promise.resolve(count))
  if (count < 3) setTimeout(poll, 10, count + 1);
  else resolve();
})(0)

return main.then(() => {
  expect(log).toEqual([0, 1, 2, 3]);
});

"#
);

// bluebird_coroutines_expression
test!(
    ignore,
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    bluebird_coroutines_expression,
    r#"
var foo = async function () {
  var wat = await bar();
};

"#
);

// async_to_generator_expression
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_expression,
    r#"
var foo = async function () {
  var wat = await bar();
};

var foo2 = async function () {
  var wat = await bar();
},
bar = async function () {
  var wat = await foo();
};

"#
);

// async_to_generator_statement
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_statement,
    r#"
async function foo() {
  var wat = await bar();
}

"#
);

// async_to_generator_shadowed_promise_import
test!(
    // TODO: Unignore this
    ignore,
    syntax(),
    |_| with_resolver(),
    async_to_generator_shadowed_promise_import,
    r#"
import Promise from 'somewhere';

async function foo() {
  await Promise.resolve();
}

"#
);

// async_to_generator_parameters
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_to_generator_parameters,
    r#"
async function foo(bar) {

}

"#
);

// async_to_generator

// regression_t6882_exec
test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    regression_t6882_exec,
    r#"
foo();

async function foo() {}

"#
);

// async_to_generator_parameters
test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_600,
    r#"
async function foo() {
for (let a of b) {
}
}
"#
);

test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1036_1,
    "
    const x = async function() {
      console.log(
          await Promise.all([[1], [2], [3]].map(
              async ([a]) => Promise.resolve().then(() => a * 2))
          )
      );
    }
    "
);

test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1036_2,
    "
    const x = async function() {
      return await Promise.all([[1], [2], [3]].map(
          async ([a]) => Promise.resolve().then(() => a * 2))
      )
    };
    return x().then(x => {
      expect(x).toEqual([2, 4, 6])
    })
  "
);

test!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1216_1,
    "
    const source = Math.random() < 2 ? 'matilda' : 'fred';
    const details = {
        _id: '1',
    };
    async function request(path) {
        return `success:${path}`;
    }

    (async function () {
        const obj = source === 'matilda'
            ? details
            : await request(
                `/${details._id}?source=${source}`
            );

        console.log({ obj });
    })();
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1125_1,
    "
async function test() {
    try {
        await 1
    } finally {
        console.log(2)
    }
}
test()
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1341_1,
    "
    class A {
      val = '1';
      async foo() {
          try {
              return await (async (x) => x + this.val)('a');
          } catch (e) {
              throw e;
          }
      }
    }
    "
);

test_exec!(
    Syntax::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    issue_1341_1_exec,
    "
    class A {
      val = '1';
      async foo() {
          try {
              return await (async (x) => x + this.val)('a');
          } catch (e) {
              throw e;
          }
      }
    }

    const a = new A();
    expect(a.foo()).resolves.toEqual('a1')
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1341_2,
    "
  class A {
    val = '1';
    async foo() {
      return await (async (x) => x + this.val)('a');
    }
  }
  "
);

test_exec!(
    Syntax::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            class_properties(Default::default(), unresolved_mark),
            async_to_generator(Default::default(), Mark::new()),
        )
    },
    issue_1341_2_exec,
    "
  class A {
    val = '1';
    async foo() {
      return await (async (x) => x + this.val)('a');
    }
  }

  const a = new A();
  expect(a.foo()).resolves.toEqual('a1')
  "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1455_1,
    "
    const obj = {
      find({ platform }) {
          return { platform }
      },
      byPlatform: async function (platform) {
          const result = await this.find({ platform: { $eq: platform } });
          return result;
      },
    };

    obj.byPlatform('foo').then(v => console.log(v))
    "
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1575_1,
    "
  const obj = {
    foo: 5,
    async method() {
        return this.foo;
    }
  }
  return obj.method().then((res) => expect(res).toBe(5))
"
);

test_exec!(
    Syntax::default(),
    |t| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            generator(mark, t.comments.clone()),
        )
    },
    issue_1575_2,
    "
  const obj = {
    foo: 5,
    async method() {
        return this.foo;
    }
  }
  return obj.method().then((res) => expect(res).toBe(5))
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1722_1,
    "
    (async function main() {
      console.log(1)
    })(foo);
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1721_1,
    "
    async function main() {
      for await (const x of lol()) {
        console.log(x);
      }
    }
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1721_2_async_generator,
    "
    async function* lol() {
      yield 1;
      yield 2;
    }
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1684_1,
    "
    const cache = {}

    async function getThing(key) {
      const it = cache[key] || (await fetchThing(key))
      return it
    }

    function fetchThing(key) {
      return Promise.resolve(key.toUpperCase()).then(val => (cache[key] = val))
    }
    "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), unresolved_mark),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_1684_2,
    "
    const cache = {}

    async function getThing(key) {
      const it = cache[key] || (await fetchThing(key))
      return it
    }

    function fetchThing(key) {
      return Promise.resolve(key.toUpperCase()).then(val => (cache[key] = val))
    }
    "
);

test_exec!(
    syntax(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1752_1,
    "
    async function* generate() {
      const results = await Promise.all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ])
      for (const result of results) {
        console.log(`yield ${result}`)
        yield result
      }
    }

    async function printValues() {
      const iterator = generate()
      for await (const value of iterator) {
        console.log(`iterator value: ${value}`)
      }
    }

    printValues()
    "
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_1918_1,
    "
    let counter = 0;
    let resolve;
    let promise = new Promise((r) => (resolve = r));
    let iterable = {
		[Symbol.asyncIterator]() {
			return {
				next() {
					return promise;
				},
			};
		},
    };

    const res = (async () => {
		for await (let value of iterable) {
			counter++;
			console.log(value);
		}

		expect(counter).toBe(2);
	})();


	for (let v of [0, 1]) {
		await null;
		let oldresolve = resolve;
		promise = new Promise((r) => (resolve = r));
		oldresolve({ value: v, done: false });
	}
	resolve({ value: undefined, done: true });

	await res;
    "
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_2402_1,
    "
function MyClass(item) {
  this.item = item;
  console.log('Constructor | this.item', this.item);
}

MyClass.prototype.fun = async function fun() {
  console.log('fun | this.item', this.item);
  return this.item;
};

const tmp = new MyClass({ foo: 'bar' });

expect(tmp.fun()).resolves.toEqual({ foo: 'bar' });
"
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), unresolved_mark),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_2402_2,
    "
  function MyClass(item) {
    this.item = item;
    console.log('Constructor | this.item', this.item);
  }

  MyClass.prototype.fun = async function fun() {
    console.log('fun | this.item', this.item);
    return this.item;
  };

  const tmp = new MyClass({ foo: 'bar' });

  tmp.fun().then((res) => {
    console.log('fun result | item', res);
  });
"
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_2305_1,
    "
    function MyClass () {}

MyClass.prototype.handle = function () {
    console.log('this is MyClass handle')
}

MyClass.prototype.init = async function(param1) {
    const a = 1;

    if (!param1) {
        console.log(this)
        this.handle()
    }

    if (param1 === a) {
        return false
    }

    return true
}

const myclass = new MyClass()
myclass.handle()
expect(myclass.init(2)).resolves.toEqual(true);
"
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), unresolved_mark),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_2305_2,
    "
    function MyClass () {}

    MyClass.prototype.handle = function () {
        console.log('this is MyClass handle')
    }

    MyClass.prototype.init = async function(param1) {
        const a = 1;

        if (!param1) {
            console.log(this)
            this.handle()
        }

        if (param1 === a) {
            return false
        }

        return true
    }

    const myclass = new MyClass()
    myclass.handle()
  "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), unresolved_mark),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_2677_1,
    "
async function region() {
}

export async function otherCall() {
  await region();
}

export default async function someCall() {
  await region();
}
  "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), unresolved_mark),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_2677_2,
    "
async function region() {
}

export default async function() {
  await region();
}
"
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_parameters,
    "
class A {
  waitForinit = () => Promise.resolve(3);

  doTest() {
    throw new Error('should not be called');
  }
}

A.prototype.doTest = async function() {
  const ret = await this.waitForinit();
  return ret;
}

const a = new A();
expect(a.doTest()).resolves.toEqual(3);
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_1,
    r#"
async function foo(x, y, ...z) {
    return 42;
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_2,
    r#"
async function* foo(x, y, ...z) {
    return 42;
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_3,
    r#"
const foo = async function (x, y, ...z) {
    return 42;
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_4,
    r#"
const foo = async function* (x, y, ...z) {
    return 42;
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_5,
    r#"
const foo = async function foo(x, y, ...z) {
    if (x) {
        return foo(0, y);
    }
    return 0;
};
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_6,
    r#"
const foo = async function* foo(x, y, ...z) {
  if (x) {
      return foo(0, y);
  }
  return 0;
};
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    function_length_issue_3135_7,
    r#"
const foo = async (x, y, ...z) => {
    return this;
};
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_wrap_this,
    r#"
const foo = async (x, y, ...z) => {
    return this;
};
"#
);

test!(
    Syntax::default(),
    |_| with_resolver(),
    async_wrap_arguments,
    r#"
function foo() {
    const bar = async () => {
        return arguments;
    };
}
"#
);

test!(
    Syntax::default(),
    |_| with_resolver(),
    async_wrap_super_and_new_target,
    r#"
class Foo {
    constractur() {
        const foo = async () => {
            return new.target;
        };
    }

    hello() {
        const world = async () => {
            return super.hello();
        };
    }
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_default_async_nested_1,
    "
export default async function foo(x) {
    async function bar(y){
        y(x);
    }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    export_default_async_nested_2,
    "
export default async function (x) {
    async function bar(y) {
        (async (z) => x(y)(z))();
    }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_with_optional_params,
    "
(async function (a = 10, ...rest) {})();
(async (a = 10, ...rest) => {})()
"
);

test!(
    Syntax::default(),
    |_| with_resolver(),
    issue_2895,
    "
export class Quirk {
  async doStuff() {
    const args = arguments;
    console.log(args);
    return { foo: null, ...args[0] };
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    super_field_update,
    "
class Foo {
  async doStuff() {
    super.foo += 123;
    super['abc'] *= 456;
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    microbundle_835,
    "
class A extends B {
  a() {
    (async () => {
      super.b();
    })();
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    super_update,
    "
class A extends B {
  async foo() {
    super.foo ++;
    -- super.bar;
    super['foo'] ++;
    -- super['bar'];
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    async_with_optional_params_2,
    "
const Z = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));

const p = Z(
    (f) =>
        async (n = 0) =>
            n <= 1 ? 1 : n * (await f(n - 1))
)(5);
"
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_4208,
    "
    function foo() {
        const bar = async (baz = this.baz) => {
            console.log(this);
        }
    }
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator(Default::default(), Mark::new()),
    issue_8452,
    r#"
class Test0 {}

class Test extends Test0 {
    constructor() {
        super(),
            console.log(async (e) => {
                await this.test();
            });
    }
}

"#
);

test!(
    Syntax::default(),
    |_| with_resolver(),
    issue_9432,
    r#"
class Foo extends Bar {
  constructor(options) {
    super(
      {
        callA: async () => {
          this.callA();
        },
      }
    );
  }
}
"#
);

#[testing::fixture("tests/async-to-generator/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Default::default(), unresolved_mark),
                async_to_generator(Default::default(), unresolved_mark),
            )
        },
        &input,
    );
}

#[testing::fixture("tests/async-to-generator/**/exec.js")]
fn exec_regenerator(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Default::default(), unresolved_mark),
                async_to_generator(Default::default(), unresolved_mark),
                es2015::for_of(Default::default()),
                block_scoping(unresolved_mark),
                generator(unresolved_mark, t.comments.clone()),
            )
        },
        &input,
    );
}
