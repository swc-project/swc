mod common;

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
use swc_ecma_transforms_testing::{compare_stdout, test_exec, test_fixture};
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

// export_async_lone_export

// bluebird_coroutines_arrow_function

// regression_t6882

// regression_t7194

// async_to_generator_shadowed_promise

// async_to_generator_object_method_with_arrows

// async_to_generator_object_method

// bluebird_coroutines_class

// async_to_generator_async_iife_with_regenerator

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

// bluebird_coroutines_statement

// regression_4943

// export_async_default_arrow_export

// async_to_generator_function_arity

// async_to_generator_object_method_with_super

// export_async_default_export

// async_to_generator_async

// regression_8783

// async_to_generator_deeply_nested_asyncs

// export_async_import_and_export

// async_to_generator_shadowed_promise_nested

// bluebird_coroutines

// export_async

// regression_4599

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

// async_to_generator_expression

// async_to_generator_statement

// async_to_generator_shadowed_promise_import

// async_to_generator_parameters

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

// Pipeline directories have their own runner; update this exclusion when adding
// one.
#[testing::fixture("tests/async-to-generator/**/input.js", exclude("/tests/async-to-generator/(async-to-generator|async-to-generator-arrow|async-to-generator-generator-fresh-mark|resolver-async-to-generator-parameters-destructuring|resolver-remove-parens-arrow-parameters-destructuring-function-name-async-fixer)/"))]
fn fixture(input: PathBuf) {
    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Default::default(), unresolved_mark),
                async_to_generator(Default::default(), unresolved_mark),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}

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

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(
        rename = "resolver-remove-parens-arrow-parameters-destructuring-function-name-async-fixer"
    )]
    ResolverRemoveParensArrowParametersDestructuringFunctionNameAsyncFixer,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/async-to-generator/\
     resolver-remove-parens-arrow-parameters-destructuring-function-name-async-fixer/**/input.js"
)]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
            CasePipeline::ResolverRemoveParensArrowParametersDestructuringFunctionNameAsyncFixer => Box::new(tr ()),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
