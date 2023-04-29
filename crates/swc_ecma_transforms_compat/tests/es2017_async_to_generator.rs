use std::{fs::read_to_string, path::PathBuf};

use swc_common::{chain, comments::SingleThreadedComments, Mark, Spanned};
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
use swc_ecma_visit::{Fold, FoldWith};

struct ParenRemover;
impl Fold for ParenRemover {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr;
        let span = expr.span();

        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Paren(ParenExpr { expr, .. }) => match *expr {
                Expr::Member(e) => Expr::Member(MemberExpr { span, ..e }),
                Expr::New(e) => Expr::New(NewExpr { span, ..e }),
                _ => *expr,
            },
            _ => expr,
        }
    }
}

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr() -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        ParenRemover,
        arrow(unresolved_mark),
        parameters(Default::default(), unresolved_mark),
        destructuring(destructuring::Config { loose: false }),
        function_name(),
        async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
        fixer(None)
    )
}

fn with_resolver() -> impl Fold {
    let unresolved = Mark::new();
    let top_level = Mark::new();
    chain!(
        resolver(unresolved, top_level, false),
        async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved)
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
"#,
    r#"
function foo(bar) {
  return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(bar) {
        bar && (yield bar());
    });
    return _foo.apply(this, arguments);
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
"#,
    r#"
let TestClass = {
     name: "John Doe",
     testMethodFailure () {
        var _this = this;
        return new Promise(function() {
          var _ref = _async_to_generator(function*(resolve) {
            console.log(_this);
            setTimeout(resolve, 1000);
          });
          return function(resolve) {
            return _ref.apply(this, arguments);
          };
        }());
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
"#,
    r#"
function mandatory(paramName) {
    throw new Error(`Missing parameter: ${paramName}`);
}
function foo(param) {
  return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(param) {
        let a = param.a, _param_b = param.b, b = _param_b === void 0 ? mandatory("b") : _param_b;
        return Promise.resolve(b);
    });
    return _foo.apply(this, arguments);
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
"#,
    r#"
_async_to_generator(function*() {
    yield 'ok';
})();

_async_to_generator(function*() {
    yield 'ok';
})();

(function() {
    var _notIIFE = _async_to_generator(function*() {
        yield 'ok';
    });
    function notIIFE() {
        return _notIIFE.apply(this, arguments);
    }
    return notIIFE;
})();

_async_to_generator(function*() {
    yield 'not iife';
})
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
"#,
    r#"
class Foo {
  foo() {
    return _async_to_generator(function* () {
      var wat = yield bar();
    })();
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
"#,
    r#"
    function s(x) {
    return _s.apply(this, arguments);
}
function _s() {
    _s = _async_to_generator(function*(x) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        var _this = this, _arguments = arguments;
        let t = function() {
            var _t = _async_to_generator(function*(y, a) {
                let r = function() {
                    var _r = _async_to_generator(function*(z, b) {
                        for(var _len = arguments.length, innerArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                            innerArgs[_key - 2] = arguments[_key];
                        }
                        yield z;
                        console.log(_this, innerArgs, _arguments);
                        return _this.x;
                    });
                    function r(z, b) {
                        return _r.apply(this, arguments);
                    }
                    return r;
                }();
                yield r();
                console.log(_this, args, _arguments);
                return _this.g(r);
            });
            function t(y, a) {
                return _t.apply(this, arguments);
            }
            return t;
        }();
        yield t();
        return this.h(t);
    });
    return _s.apply(this, arguments);
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
"#,
    "
var foo = function() {
    var _foo = _async_to_generator(function*() {
        var wat = yield bar();
    });
    function foo() {
        return _foo.apply(this, arguments);
    }
    return foo;
}();
var foo2 = function() {
    var _foo2 = _async_to_generator(function*() {
        var wat = yield bar();
    });
    function foo2() {
        return _foo2.apply(this, arguments);
    }
    return foo2;
}(), bar = function() {
    var _bar = _async_to_generator(function*() {
        var wat = yield foo();
    });
    function bar() {
        return _bar.apply(this, arguments);
    }
    return bar;
}();"
);

test!(
    syntax(),
    |_| tr(),
    named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};
"#,
    r#"
var foo = function() {
  var _bar = _async_to_generator(function*() {
    console.log(bar);
  });
  function bar() {
    return _bar.apply(this, arguments);
  }

  return bar;
}();
"#
);

test!(
    syntax(),
    |_| tr(),
    no_parameters_and_no_id,
    r#"
foo(async function () {
});"#,
    r#"foo(_async_to_generator(function*() {}));"#
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
"#,
    r#"
    class Class {
      method() {
          var _this = this;
          return _async_to_generator(function*() {
              var _this1 = _this;
              _this;
              (function() {
                  return _this1;
              });
              (function() {
                  _this1;
                  (function() {
                      return _this1;
                  });
                  function x() {
                      var _this = this;
                      this;
                      (function() {
                          _this;
                      });
                      _async_to_generator(function*() {
                          _this;
                    });
                  }
              });
              function x() {
                  var _this = this;
                  this;
                  (function() {
                      _this;
                  });
                  _async_to_generator(function*() {
                      _this;
                });
              }
          })();
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
}"#,
    r#"
class Foo extends class{
}{
     method() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            var _this1 = _this, _superprop_get_method1 = ()=>_superprop_get_method();
            _superprop_get_method().call(_this);
            var arrow = function arrow() {
                return _superprop_get_method1().call(_this1);
            };
        })();
    }
}
"#
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
}"#,
    r#"
let obj = {
  a: 123,

  foo(bar) {
    return _async_to_generator(function* () {
      return yield baz(bar);
    })();
  }

};"#
);

test!(
    syntax(),
    |_| tr(),
    babel_parameters,
    r#"
async function foo(bar) {

}
"#,
    r#"
function foo(bar) {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function* (bar) {});
  return _foo.apply(this, arguments);
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
"#,
    r#"
function foo() {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
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
});",
    "export default obj({
    f () {
        return _async_to_generator(function*() {
            yield g();
        })();
    }
});
"
);

test_exec!(
    syntax(),
    |t| chain!(
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
        chain!(
            async_to_generator(
                Default::default(),
                Some(t.comments.clone()),
                unresolved_mark
            ),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default()
            )
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
//    |_| chain!(jsx(), jsc_constant_elements(),
// async_to_generator(Default::default()),),    regression_7178,
//    r#"
//const title = "Neem contact op";
//
//async function action() {
//  return <Contact title={title} />;
//}
//
//"#,
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    bluebird_coroutines_named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

var foo =
/*#__PURE__*/
function () {
  var _bar = _coroutine(function* () {
    console.log(bar);
  });

  function bar() {
    return _bar.apply(this, arguments);
  }

  return bar;
}();

"#
);

// export_async_lone_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_async_lone_export,
    r#"
export async function foo () { }

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _async_to_generator(function* () {});
  return _foo.apply(this, arguments);
}

"#
);

// bluebird_coroutines_arrow_function
test!(
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    bluebird_coroutines_arrow_function,
    r#"
(async () => { await foo(); })()

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

_coroutine(function* () {
  yield foo();
})();

"#
);

// regression_t6882

// regression_t7194
test!(
    // Optimization
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            arrow(unresolved_mark)
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

"#,
    r#"
function f() {
  g(
  /*#__PURE__*/
  _async_to_generator(function* () {
    var _this = this;

    c(function () {
      return _this;
    });
  }));
}

/*#__PURE__*/
_async_to_generator(function* () {
  var _this = this;

  console.log('async wrapper:', this === 'foo');

  (function () {
    console.log('nested arrow:', _this === 'foo');
  })();
}).call('foo');

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

"#,
    r#"
let _Promise;

function _foo() {
  _foo = _async_to_generator(function* () {
    yield new _Promise(resolve => {
      resolve();
    });
  });
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_object_method_with_arrows
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
"#,
    r#"
    class Class {
      method() {
        var _this = this;
        return _async_to_generator(function*() {
            _this;
            ()=>_this
            ;
            ()=>{
                _this;
                ()=>_this
                ;
                function x() {
                    this;
                    ()=>{
                        this;
                    };
                    var _this = this;
                    _async_to_generator(function*() {
                        _this;
                    });
                }
            };
            function x() {
                this;
                ()=>{
                    this;
                };
                var _this = this;
                _async_to_generator(function*() {
                    _this;
                });
            }
        })();
      }
    }
    "#
);

// async_to_generator_object_method
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_object_method,
    r#"
let obj = {
  a: 123,
  async foo(bar) {
    return await baz(bar);
  }
}

"#,
    r#"
let obj = {
  a: 123,

  foo(bar) {
    return _async_to_generator(function* () {
      return yield baz(bar);
    })();
  }

};

"#
);

// bluebird_coroutines_class
test!(
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    bluebird_coroutines_class,
    r#"
class Foo {
  async foo() {
    var wat = await bar();
  }
}

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

class Foo {
  foo() {
    return _coroutine(function* () {
      var wat = yield bar();
    })();
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
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
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

"#,
    r#"
_async_to_generator(
 /*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 'ok';

      case 2:
      case "end":
        return _context.stop();
    }
  }, _callee);
}))();
_async_to_generator(
 /*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        _context2.next = 2;
        return 'ok';

      case 2:
      case "end":
        return _context2.stop();
    }
  }, _callee2);
}))();

 /*#__PURE__*/
(function () {
  var _notIIFE = _async_to_generator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return 'ok';

        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));

  function notIIFE() {
    return _notIIFE.apply(this, arguments);
  }

  return notIIFE;
})();

 /*#__PURE__*/
_async_to_generator(
 /*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.next = 2;
        return 'not iife';

      case 2:
      case "end":
        return _context4.stop();
    }
  }, _callee4);
}));

"#
);

//// regression_gh_6923
//test!(syntax(),|_| tr("{
//  "presets": [
//    [
//      "env",
//      {
//        "targets": {
//          "chrome": "62",
//          "edge": "15",
//          "firefox": "52",
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
//"#, r#"
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_named_expression,
    r#"
var foo = async function bar() {
  console.log(bar);
};

"#,
    r#"
var foo =
/*#__PURE__*/
function () {
  var _bar = _async_to_generator(function* () {
    console.log(bar);
  });

  function bar() {
    return _bar.apply(this, arguments);
  }

  return bar;
}();

"#
);

//// async_to_generator_async_iife_with_regenerator_spec
//test!(
//    syntax(),
//    |_| chain!(async_to_generator(Default::default()), arrow(),
// regenerator(),),    async_to_generator_async_iife_with_regenerator_spec,
//    r#"
//(async function() { await 'ok' })();
//(async () => { await 'ok' })();
//(async function notIIFE() { await 'ok' });
//(async () => { await 'not iife' });
//
//"#,
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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

"#,
    r#"
let TestClass = {
    name: "John Doe",
    testMethodFailure () {
        var _this = this;
        return new Promise(function() {
            var _ref = _async_to_generator(function*(resolve) {
                console.log(_this);
                setTimeout(resolve, 1000);
            });
            return function(resolve) {
                return _ref.apply(this, arguments);
            };
        }());
    }
};

"#
);

// bluebird_coroutines_statement
test!(
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    bluebird_coroutines_statement,
    r#"
async function foo() {
  var wat = await bar();
}

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

function _foo() {
  _foo = _coroutine(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}
"#
);

// regression_4943
test!(
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        chain!(
            resolver(unresolved_mark, top_level_mark, false),
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
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

"#,
    r#"
"use strict";

function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}

function foo(_) {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _async_to_generator(function* (param) {
    let a = param.a,
        _param_b = param.b,
        b = _param_b === void 0 ? mandatory("b") : _param_b;
    return Promise.resolve(b);
  });
  return _foo.apply(this, arguments);
}

"#
);

// export_async_default_arrow_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_async_default_arrow_export,
    r#"
export default async () => { return await foo(); }

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default =
/*#__PURE__*/
_async_to_generator(function* () {
  return yield foo();
});

exports.default = _default;

"#
);

// async_to_generator_function_arity
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_function_arity,
    r#"
async function one(a, b = 1) {}
async function two(a, b, ...c) {}
async function three(a, b = 1, c, d = 3) {}
async function four(a, b = 1, c, ...d) {}
async function five(a, {b}){}
async function six(a, {b} = {}){}

"#,
    r#"

function one(a) {
  return _one.apply(this, arguments);
}
function _one() {
  _one = _async_to_generator(function*(a, b = 1) {
  });
  return _one.apply(this, arguments);
}
function two(a, b) {
  return _two.apply(this, arguments);
}
function _two() {
  _two = _async_to_generator(function*(a, b, ...c) {
  });
  return _two.apply(this, arguments);
}
function three(a) {
  return _three.apply(this, arguments);
}
function _three() {
  _three = _async_to_generator(function*(a, b = 1, c, d = 3) {
  });
  return _three.apply(this, arguments);
}
function four(a) {
  return _four.apply(this, arguments);
}
function _four() {
  _four = _async_to_generator(function*(a, b = 1, c, ...d) {
  });
  return _four.apply(this, arguments);
}
function five(a, _) {
  return _five.apply(this, arguments);
}
function _five() {
  _five = _async_to_generator(function*(a, { b  }) {
  });
  return _five.apply(this, arguments);
}
function six(a) {
  return _six.apply(this, arguments);
}
function _six() {
  _six = _async_to_generator(function*(a, { b  } = {
  }) {
  });
  return _six.apply(this, arguments);
}


"#
);

// async_to_generator_object_method_with_super
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_object_method_with_super_caching,
    r#"
class Foo extends class {} {
  async method() {
    super.method();

    var arrow = () => super.method();
  }
}

"#,
    r#"
class Foo extends class {} {
  method() {
    var _this = this, _superprop_get_method = () => super.method,;

    return _async_to_generator(function* () {
      _superprop_get_method().call(_this);

      var arrow = () => _superprop_get_method().call(_this);
    })();
  }

}

"#
);

// export_async_default_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_async_default_export,
    r#"
export default async function myFunc() {}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = myFunc;

function myFunc() {
  return _myFunc.apply(this, arguments);
}

function _myFunc() {
  _myFunc = _async_to_generator(function* () {});
  return _myFunc.apply(this, arguments);
}

"#
);

// async_to_generator_async
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_async,
    r#"
class Foo {
  async foo() {
    var wat = await bar();
  }
}

"#,
    r#"
class Foo {
  foo() {
    return _async_to_generator(function* () {
      var wat = yield bar();
    })();
  }

}

"#
);

// regression_8783
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    regression_8783,
    r#"
(async function poll() {
  console.log(await Promise.resolve('Hello'))
  setTimeout(poll, 1000);
})();
"#,
    r#"
(function () {
  var _poll = _async_to_generator(function* () {
    console.log((yield Promise.resolve('Hello')));
    setTimeout(poll, 1000);
  });

  function poll() {
    return _poll.apply(this, arguments);
  }

  return poll;
})()();

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

"#,
    r#"
function s(x) {
  return _s.apply(this, arguments);
}
function _s() {
  _s = _async_to_generator(function* (x, ...args) {
      var _this = this, _arguments = arguments;
      let t = function () {
          var _ref = _async_to_generator(
              function* (y, a) {
                  let r = function () {
                      var _ref = _async_to_generator(
                          function* (z, b, ...innerArgs) {
                              yield z;
                              console.log(_this, innerArgs, _arguments);
                              return _this.x;
                          }
                      );
                      return function r(z, b) {
                          return _ref.apply(this, arguments);
                      };
                  }();
                  yield r();
                  console.log(_this, args, _arguments);
                  return _this.g(r);
              }
          );
          return function t(y, a) {
              return _ref.apply(this, arguments);
          };
      }();
      yield t();
      return this.h(t);
  });
  return _s.apply(this, arguments);
}
"#
);

// export_async_import_and_export
test!(
    // TODO: Enable this test after implementing es6 module pass.
    ignore,
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_async_import_and_export,
    r#"
import bar from 'bar';

export async function foo () { }

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = _interop_require_default(require("bar"));

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _async_to_generator(function* () {});
  return _foo.apply(this, arguments);
}

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

"#,
    r#"
let _Promise;

function _foo() {
  _foo = _async_to_generator(function* () {
    let Promise;
    yield bar();

    function _bar() {
      _bar = _async_to_generator(function* () {
        return Promise.resolve();
      });
      return _bar.apply(this, arguments);
    }

    function bar() {
      return _bar.apply(this, arguments);
    }
  });
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}

"#
);

// bluebird_coroutines

// export_async

// regression_4599
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    regression_4599,
    r#"
async () => await promise

async () => { await promise }

"#,
    r#"
/*#__PURE__*/
_async_to_generator(function* () {
  return yield promise;
});

/*#__PURE__*/
_async_to_generator(function* () {
  yield promise;
});

"#
);

// regression_4943_exec
test_exec!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    bluebird_coroutines_expression,
    r#"
var foo = async function () {
  var wat = await bar();
};

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

var foo =
/*#__PURE__*/
function () {
  var _ref = _coroutine(function* () {
    var wat = yield bar();
  });

  return function foo() {
    return _ref.apply(this, arguments);
  };
}();

"#
);

// async_to_generator_expression
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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

"#,
    r#"
var foo =
/*#__PURE__*/
function () {
  var _ref = _async_to_generator(function* () {
    var wat = yield bar();
  });

  return function foo() {
    return _ref.apply(this, arguments);
  };
}();

var foo2 =
/*#__PURE__*/
function () {
  var _ref = _async_to_generator(function* () {
    var wat = yield bar();
  });

  return function foo2() {
    return _ref.apply(this, arguments);
  };
}(),
    bar =
/*#__PURE__*/
function () {
  var _ref = _async_to_generator(function* () {
    var wat = yield foo();
  });

  return function bar() {
    return _ref.apply(this, arguments);
  };
}();

"#
);

// async_to_generator_statement
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_statement,
    r#"
async function foo() {
  var wat = await bar();
}

"#,
    r#"
function foo() {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
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

"#,
    r#"
import _Promise from 'somewhere';

function _foo() {
  _foo = _async_to_generator(function* () {
    yield _Promise.resolve();
  });
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_parameters
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_to_generator_parameters,
    r#"
async function foo(bar) {

}

"#,
    r#"
function foo(bar) {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function* (bar) {});
  return _foo.apply(this, arguments);
}
"#
);

// async_to_generator

// regression_t6882_exec
test_exec!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    regression_t6882_exec,
    r#"
foo();

async function foo() {}

"#
);

// async_to_generator_parameters
test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_600,
    r#"
async function foo() {
for (let a of b) {
}
}
"#,
    "function foo() {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function*() {
      for (let a of b){
      }
  });
  return _foo.apply(this, arguments);
}
"
);

test!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_1036_1,
    "
    const x = async function() {
      console.log(
          await Promise.all([[1], [2], [3]].map(
              async ([a]) => Promise.resolve().then(() => a * 2))
          )
      );
    }
    ",
    "
    const x = function() {
        var _ref = _async_to_generator(function*() {
            console.log((yield Promise.all([
                [
                    1
                ],
                [
                    2
                ],
                [
                    3
                ]
            ].map(function() {
                var _ref = _async_to_generator(function*([a]) {
                    return Promise.resolve().then(()=>a * 2
                    );
                });
                return function(_) {
                    return _ref.apply(this, arguments);
                };
            }()))));
        });
        return function x() {
            return _ref.apply(this, arguments);
        };
    }();
"
);

test_exec!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    ",
    "
    const source = Math.random() < 2 ? 'matilda' : 'fred';
    const details = {
        _id: '1'
    };
    function request(path) {
      return _request.apply(this, arguments);
    }
    function _request() {
      _request = _async_to_generator(function*(path) {
          return `success:${path}`;
      });
      return _request.apply(this, arguments);
    }
    _async_to_generator(function*() {
      const obj = source === 'matilda' ? details : yield \
     request(`/${details._id}?source=${source}`);
      console.log({
          obj
      });
  })();
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
",
    "
  function test() {
    return _test.apply(this, arguments);
  }
  function _test() {
    _test = _async_to_generator(function* () {
      try {
        yield 1;
      } finally {
        console.log(2);
      }
    });
    return _test.apply(this, arguments);
  }
  test();

  "
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    ",
    "
    class A {
        val = '1';
        foo() {
            var _this = this;
            return _async_to_generator(function*() {
                try {
                    return yield (function() {
                        var _ref = _async_to_generator(function*(x) {
                            return x + _this.val;
                        });
                        return function(x) {
                            return _ref.apply(this, arguments);
                        };
                    })()('a');
                } catch (e) {
                    throw e;
                }
            })();
          }
    }
"
);

test_exec!(
    Syntax::default(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default(), Some(t.comments.clone()), Mark::new())
    ),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_1341_2,
    "
  class A {
    val = '1';
    async foo() {
      return await (async (x) => x + this.val)('a');
    }
  }
  ",
    "
    class A {
        val = '1';
        foo() {
            var _this = this;
            return _async_to_generator(function*() {
                return yield (function() {
                    var _ref = _async_to_generator(function*(x) {
                        return x + _this.val;
                    });
                    return function(x) {
                        return _ref.apply(this, arguments);
                    };
                })()('a');
            })();
        }
    }
"
);

test_exec!(
    Syntax::default(),
    |t| chain!(
        class_properties(Some(t.comments.clone()), Default::default()),
        async_to_generator(Default::default(), Some(t.comments.clone()), Mark::new())
    ),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    ",
    "
    const obj = {
      find ({ platform  }) {
          return {
              platform
          };
      },
      byPlatform: function() {
          var _ref = _async_to_generator(function*(platform) {
              const result = yield this.find({
                  platform: {
                      $eq: platform
                  }
              });
              return result;
          });
          return function(platform) {
              return _ref.apply(this, arguments);
          };
      }()
    };
    obj.byPlatform('foo').then((v)=>console.log(v)
    );
    "
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, mark),
            generator(mark, t.comments.clone())
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_1722_1,
    "
    (async function main() {
      console.log(1)
    })(foo);
    ",
    "
    (function () {
      var _main = _async_to_generator(function* () {
        console.log(1);
      });

      function main() {
        return _main.apply(this, arguments);
      }

      return main;
    })()(foo);
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_1721_1,
    "
    async function main() {
      for await (const x of lol()) {
        console.log(x);
      }
    }
    ",
    "
    function main() {
      return _main.apply(this, arguments);
    }
    function _main() {
      _main = _async_to_generator(function*() {
          {
              var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
              try {
                  for(var _iterator = _async_iterator(lol()), _step; _iteratorAbruptCompletion = \
     !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                        let _value = _step.value;
                        const x = _value;
                        console.log(x);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (_iteratorAbruptCompletion && _iterator.return != null) {
                            yield _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        });
        return _main.apply(this, arguments);
    }
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_1721_2_async_generator,
    "
    async function* lol() {
      yield 1;
      yield 2;
    }
    ",
    "
    function lol() {
      return _lol.apply(this, arguments);
    }
    function _lol() {
      _lol = _wrap_async_generator(function* () {
        yield 1;
        yield 2;
      });
      return _lol.apply(this, arguments);
    }
    "
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    ",
    "
    const cache = {
    };
    function getThing(key) {
      return _getThing.apply(this, arguments);
    }
    function _getThing() {
        _getThing = _async_to_generator(function*(key) {
            const it = cache[key] || (yield fetchThing(key));
            return it;
        });
        return _getThing.apply(this, arguments);
    }
    function fetchThing(key) {
      return Promise.resolve(key.toUpperCase()).then((val)=>cache[key] = val
      );
    }
    "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            generator(unresolved_mark, t.comments.clone())
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
    ",
    "
    const cache = {};
    function getThing(key) {
        return _getThing.apply(this, arguments);
    }
    function _getThing() {
        _getThing = _async_to_generator(function(key) {
            var it, _tmp;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _tmp = cache[key];
                        if (_tmp) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            fetchThing(key)
                        ];
                    case 1:
                        _tmp = _state.sent();
                        _state.label = 2;
                    case 2:
                        it = _tmp;
                        return [
                            2,
                            it
                        ];
                }
            });
        });
        return _getThing.apply(this, arguments);
    }
    function fetchThing(key) {
        return Promise.resolve(key.toUpperCase()).then((val)=>cache[key] = val);
    }
    "
);

test_exec!(
    syntax(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            generator(unresolved_mark, t.comments.clone())
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
",
    "
    function MyClass(item) {
      this.item = item;
      console.log('Constructor | this.item', this.item);
    }
    MyClass.prototype.fun = function() {
        var _fun = _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                console.log('fun | this.item', this.item);
                return [
                    2,
                    this.item
                ];
            });
        });
        function fun() {
            return _fun.apply(this, arguments);
        }
        return fun;
    }();
    const tmp = new MyClass({
        foo: 'bar'
    });
    tmp.fun().then((res)=>{
        console.log('fun result | item', res);
    });
"
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            generator(unresolved_mark, t.comments.clone())
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
  ",
    "
    
    function MyClass() {}
    MyClass.prototype.handle = function() {
        console.log('this is MyClass handle');
    };
    MyClass.prototype.init = function() {
        var _ref = _async_to_generator(function(param1) {
            var a;
            return _ts_generator(this, function(_state) {
                a = 1;
                if (!param1) {
                    console.log(this);
                    this.handle();
                }
                if (param1 === a) {
                    return [
                        2,
                        false
                    ];
                }
                return [
                    2,
                    true
                ];
            });
        });
        return function(param1) {
            return _ref.apply(this, arguments);
        };
    }();
    const myclass = new MyClass();
    myclass.handle();
  "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            generator(unresolved_mark, t.comments.clone())
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
  ",
    "
    function region() {
      return _region.apply(this, arguments);
  }
  function _region() {
      _region = _async_to_generator(function() {
          return _ts_generator(this, function(_state) {
              return [
                  2
              ];
          });
      });
      return _region.apply(this, arguments);
  }
  export function otherCall() {
      return _otherCall.apply(this, arguments);
  }
  function _otherCall() {
      _otherCall = _async_to_generator(function() {
          return _ts_generator(this, function(_state) {
              switch(_state.label){
                  case 0:
                      return [
                          4,
                          region()
                      ];
                  case 1:
                      _state.sent();
                      return [
                          2
                      ];
              }
          });
      });
      return _otherCall.apply(this, arguments);
  }
  export default function someCall() {
      return _someCall.apply(this, arguments);
  }
  function _someCall() {
      _someCall = _async_to_generator(function() {
          return _ts_generator(this, function(_state) {
              switch(_state.label){
                  case 0:
                      return [
                          4,
                          region()
                      ];
                  case 1:
                      _state.sent();
                      return [
                          2
                      ];
              }
          });
      });
      return _someCall.apply(this, arguments);
  }
  "
);

test!(
    Syntax::default(),
    |t| {
        let unresolved_mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator::<SingleThreadedComments>(Default::default(), None, unresolved_mark),
            generator(unresolved_mark, t.comments.clone())
        )
    },
    issue_2677_2,
    "
async function region() {
}

export default async function() {
  await region();
}
",
    "
    function region() {
      return _region.apply(this, arguments);
    }
    function _region() {
        _region = _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        });
        return _region.apply(this, arguments);
    }
    export default function() {
        return _ref.apply(this, arguments);
    }
    function _ref() {
        _ref = _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            region()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        });
        return _ref.apply(this, arguments);
    }
"
);

test_exec!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_1,
    r#"
async function foo(x, y, ...z) {
    return 42;
}
"#,
    r#"
function foo(x, y) {
  return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(x, y, ...z) {
        return 42;
    });
    return _foo.apply(this, arguments);
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_2,
    r#"
async function* foo(x, y, ...z) {
    return 42;
}
"#,
    r#"
function foo(x, y) {
  return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _wrap_async_generator(function*(x, y, ...z) {
        return 42;
    });
    return _foo.apply(this, arguments);
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_3,
    r#"
const foo = async function (x, y, ...z) {
    return 42;
}
"#,
    r#"
const foo = /*#__PURE__*/ function () {
  var _ref = _async_to_generator(function* (x, y, ...z) {
      return 42;
  });
  return function foo(x, y) {
      return _ref.apply(this, arguments);
  };
}();
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_4,
    r#"
const foo = async function* (x, y, ...z) {
    return 42;
}
"#,
    r#"
const foo = /*#__PURE__*/ function () {
    var _ref = _wrap_async_generator(function* (x, y, ...z) {
        return 42;
    });
    return function foo(x, y) {
        return _ref.apply(this, arguments);
    };
}();
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_5,
    r#"
const foo = async function foo(x, y, ...z) {
    if (x) {
        return foo(0, y);
    }
    return 0;
};
"#,
    r#"
const foo = function () {
  var _foo = _async_to_generator(function* (x, y, ...z) {
      if (x) {
          return foo(0, y);
      }
      return 0;
  });
  function foo(x, y) {
      return _foo.apply(this, arguments);
  }
  return foo;
}();
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_6,
    r#"
const foo = async function* foo(x, y, ...z) {
  if (x) {
      return foo(0, y);
  }
  return 0;
};
"#,
    r#"
const foo = function () {
  var _foo = _wrap_async_generator(function* (x, y, ...z) {
      if (x) {
          return foo(0, y);
      }
      return 0;
  });
  function foo(x, y) {
      return _foo.apply(this, arguments);
  }
  return foo;
}();
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    function_length_issue_3135_7,
    r#"
const foo = async (x, y, ...z) => {
    return this;
};
"#,
    r#"
var _this = this;
const foo = /*#__PURE__*/ function () {
    var _ref = _async_to_generator(function* (x, y, ...z) {
        return _this;
    });

    return function foo(x, y) {
        return _ref.apply(this, arguments);
    };
}();
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_wrap_this,
    r#"
const foo = async (x, y, ...z) => {
    return this;
};
"#,
    r#"
var _this = this;

const foo = /*#__PURE__*/ function () {
  var _ref = _async_to_generator(function* (x, y, ...z) {
      return _this;
  });
  return function foo(x, y) {
      return _ref.apply(this, arguments);
  };
}();
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
"#,
    r#"
function foo() {
  var _arguments = arguments;

  const bar = /*#__PURE__*/ function () {
      var _ref = _async_to_generator(function* () {
          return _arguments;
      });

      return function bar() {
          return _ref.apply(this, arguments);
      };
  }();
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
"#,
    r#"
class Foo {
    constractur() {
        var _newtarget = new.target;

        const foo = /*#__PURE__*/ function () {
            var _ref = _async_to_generator(function* () {
                return _newtarget;
            });

            return function foo() {
                return _ref.apply(this, arguments);
            };
        }();
    }

    hello() {
        var _this = this, _superprop_get_hello = () => super.hello;

        const world = /*#__PURE__*/ function () {
            var _ref = _async_to_generator(function* () {
                return _superprop_get_hello().call(_this);
            });

            return function world() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_default_async_nested_1,
    "
export default async function foo(x) {
    async function bar(y){
        y(x);
    }
}
",
    "
export default function foo(x) {
  return _foo.apply(this, arguments);
}
function _foo() {
  _foo = _async_to_generator(function*(x) {
      function bar(y) {
          return _bar.apply(this, arguments);
      }
      function _bar() {
          _bar = _async_to_generator(function*(y) {
              y(x);
          });
          return _bar.apply(this, arguments);
      }
  });
  return _foo.apply(this, arguments);
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    export_default_async_nested_2,
    "
export default async function (x) {
    async function bar(y) {
        (async (z) => x(y)(z))();
    }
}
",
    "
export default function(x) {
    return _ref.apply(this, arguments);
}
function _ref() {
    _ref = _async_to_generator(function*(x) {
        function bar(y) {
            return _bar.apply(this, arguments);
        }
        function _bar() {
            _bar = _async_to_generator(function*(y) {
                (function() {
                    var _ref = _async_to_generator(function*(z) {
                        return x(y)(z);
                    });
                    return function(z) {
                        return _ref.apply(this, arguments);
                    };
                })()();
            });
            return _bar.apply(this, arguments);
        }
    });
    return _ref.apply(this, arguments);
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_with_optional_params,
    "
(async function (a = 10, ...rest) {})();
(async (a = 10, ...rest) => {})()
",
    "
_async_to_generator(function*(a = 10, ...rest) {})();
_async_to_generator(function*(a = 10, ...rest) {})();
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
",
    "
export class Quirk {
  doStuff() {
    var _arguments = arguments;
    return _async_to_generator(function*() {
      const args = _arguments;
      console.log(args);
      return {
        foo: null,
        ...args[0]
      };
    })();
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    super_field_update,
    "
class Foo {
  async doStuff() {
    super.foo += 123;
    super['abc'] *= 456;
  }
}
",
    "
class Foo {
  doStuff() {
    var _superprop_get_foo = ()=>super.foo
    , _superprop_get = (_prop)=>super[_prop]
    , _superprop_set_foo = (_value)=>super.foo = _value
    , _superprop_set = (_prop, _value)=>super[_prop] = _value
    ;
    return _async_to_generator(function*() {
        var tmp;
        _superprop_set_foo(_superprop_get_foo() + 123);
        _superprop_set(tmp = 'abc', _superprop_get(tmp) * 456);
    })()
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    microbundle_835,
    "
class A extends B {
  a() {
    (async () => {
      super.b();
    })();
  }
}
",
    "
class A extends B {
  a() {
    var _this = this, _superprop_get_b = ()=>super.b;
    _async_to_generator(function*() {
      _superprop_get_b().call(_this);
    })();
  }
}
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
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
",
    r#"
class A extends B {
  foo() {
      var _superprop_update_foo = { get _() { return _superprop_get_foo(); }, set _(v) { _superprop_set_foo(v); } },
          _superprop_update_bar = { get _() { return _superprop_get_bar(); }, set _(v) { _superprop_set_bar(v); } },
          _superprop_update = (_prop) => ({ get _() { return _superprop_get(_prop); }, set _(v) { return _superprop_set(_prop, v); } }),
          _superprop_get_foo = () => super.foo,
          _superprop_get_bar = () => super.bar,
          _superprop_get = (_prop) => super[_prop],
          _superprop_set_foo = (_value) => super.foo = _value,
          _superprop_set_bar = (_value) => super.bar = _value,
          _superprop_set = (_prop, _value) => super[_prop] = _value;

      return _async_to_generator(function* () {
          _superprop_update_foo._++;
          --_superprop_update_bar._;
          _superprop_update('foo')._++;
          --_superprop_update('bar')._;
      })();
  }
}
"#
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    async_with_optional_params_2,
    "
const Z = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));

const p = Z(
    (f) =>
        async (n = 0) =>
            n <= 1 ? 1 : n * (await f(n - 1))
)(5);
",
    "
const Z = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));

const p = Z((f)=>_async_to_generator(function*(n = 0) {
        return n <= 1 ? 1 : n * (yield f(n - 1));
    })
)(5);
"
);

test!(
    Syntax::default(),
    |_| async_to_generator::<SingleThreadedComments>(Default::default(), None, Mark::new()),
    issue_4208,
    "
    function foo() {
        const bar = async (baz = this.baz) => {
            console.log(this);
        }
    }
    ",
    "
    function foo() {
        var _this = this;
        const bar = function() {
            var _ref = _async_to_generator(function*(baz = _this.baz) {
                console.log(_this);
            });
            return function bar() {
                return _ref.apply(this, arguments);
            };
        }();
    }
    "
);

#[testing::fixture("tests/async-to-generator/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(input).unwrap();
    compare_stdout(
        Default::default(),
        |t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Some(t.comments.clone()), Default::default()),
                async_to_generator(
                    Default::default(),
                    Some(t.comments.clone()),
                    unresolved_mark
                )
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

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                class_properties(Some(t.comments.clone()), Default::default()),
                async_to_generator(
                    Default::default(),
                    Some(t.comments.clone()),
                    unresolved_mark
                ),
                es2015::for_of(Default::default()),
                block_scoping(unresolved_mark),
                generator(unresolved_mark, t.comments.clone())
            )
        },
        &input,
    );
}
