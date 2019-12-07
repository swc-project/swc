use super::*;
use crate::{
    compat::es2015::{arrow, destructuring, es2015, function_name, parameters},
    fixer::fixer,
};
use swc_common::chain;
use swc_ecma_parser::Syntax;

struct ParenRemover;
impl Fold<Expr> for ParenRemover {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);
        let span = expr.span();

        let expr = expr.fold_children(self);

        validate!(match expr {
            Expr::Paren(ParenExpr { expr, .. }) => match *expr {
                Expr::Member(e) => Expr::Member(MemberExpr { span, ..e }),
                Expr::New(e) => Expr::New(NewExpr { span, ..e }),
                _ => *expr,
            },
            _ => expr,
        })
    }
}

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr() -> impl Fold<Module> {
    chain!(
        ParenRemover,
        validating!(arrow()),
        validating!(parameters()),
        validating!(destructuring(destructuring::Config { loose: false })),
        validating!(function_name()),
        AsyncToGenerator {},
        fixer()
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
function _foo() {
    _foo = _asyncToGenerator(function*(bar) {
        bar && (yield bar());
    });
    return _foo.apply(this, arguments);
}
function foo(bar) {
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
     name: 'John Doe',
     testMethodFailure () {
        return new Promise((function(resolve) {
          var _ref = _asyncToGenerator((function*(resolve) {
            console.log(this);
            setTimeout(resolve, 1000);
          }).bind(this));
          return function() {
            return _ref.apply(this, arguments);
          };
        })().bind(this));
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
function _foo() {
    _foo = _asyncToGenerator(function*(param) {
        let a = param.a, _b = param.b, b = _b === void 0 ? mandatory('b') : _b;
        return Promise.resolve(b);
    });
    return _foo.apply(this, arguments);
}
function foo(param) {
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
_asyncToGenerator(function*() {
    yield 'ok';
});

_asyncToGenerator(function*() {
    yield 'ok';
});

(function() {
    var _notIIFE = _asyncToGenerator(function*() {
        yield 'ok';
    });
    return function notIIFE() {
        return _notIIFE.apply(this, arguments);
    };
})();

(function() {
    var _ref = _asyncToGenerator(function*() {
        yield 'not iife';
    });
    return function() {
        return _ref.apply(this, arguments);
    };
})();
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
    return _asyncToGenerator(function* () {
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
function _s() {
    _s = _asyncToGenerator((function*(x) {
        for(let _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        let t = (function(y, a) {
            var _ref = _asyncToGenerator((function*(y, a) {
                let r = (function(z, b) {
                    var _ref1 = _asyncToGenerator((function*(z, b) {
                        for(let _len1 = arguments.length, innerArgs = new Array(_len1 > 2 ? _len1 - 2 : 0), _key1 = 2; _key1 < _len1; _key1++){
                            innerArgs[_key1 - 2] = arguments[_key1];
                        }
                        yield z;
                        console.log(this, innerArgs, arguments);
                        return this.x;
                    }).bind(this));
                    return function() {
                        return _ref1.apply(this, arguments);
                    };
                })().bind(this);
                yield r();
                console.log(this, args, arguments);
                return this.g(r);
            }).bind(this));
            return function () {
                return _ref.apply(this, arguments);
            };
        })().bind(this);
        yield t();
        return this.h(t);
    }).bind(this));
    return _s.apply(this, arguments);
}
function s(x) {
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
    r#"
var foo = function () {
  var _foo = _asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo() {
    return _foo.apply(this, arguments);
  };
}();

var foo2 = function () {
  var _foo2 = _asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo2() {
    return _foo2.apply(this, arguments);
  };
}(),
    bar = function () {
  var _bar = _asyncToGenerator(function* () {
    var wat = yield foo();
  });

  return function bar() {
    return _bar.apply(this, arguments);
  };
}();"#
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
  var _bar = _asyncToGenerator(function*() {
    console.log(bar);
  });
  return function bar() {
    return _bar.apply(this, arguments);
  };
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
    r#"
foo(function() {
  var _ref = _asyncToGenerator(function*() {
  });
  return function() {
    return _ref.apply(this, arguments);
  };
}());
"#
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
class Class{
     method() {
        return _asyncToGenerator((function*() {
            this;
            (function() {
                return this;
            }).bind(this);
            (function() {
                this;
                (function() {
                    return this;
                }).bind(this);
                function x() {
                    this;
                    (function() {
                        this;
                    }).bind(this);
                    (function() {
                        var _ref = _asyncToGenerator((function*() {
                            this;
                        }).bind(this));
                        return function() {
                            return _ref.apply(this, arguments);
                        };
                    })().bind(this);
                }
            }).bind(this);
            function x() {
                this;
                (function() {
                    this;
                }).bind(this);
                (function() {
                    var _ref = _asyncToGenerator((function*() {
                        this;
                    }).bind(this));
                    return function() {
                        return _ref.apply(this, arguments);
                    };
                })().bind(this);
            }
        }).bind(this))();
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
        var _super_method = (..._args)=>super.method(..._args), _super_method1 = (..._args)=>super.method(..._args);
        return _asyncToGenerator(function*() {
            _super_method();
            var arrow = function arrow() {
                return _super_method1();
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
    return _asyncToGenerator(function* () {
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
function _foo() {
  _foo = _asyncToGenerator(function* (bar) {});
  return _foo.apply(this, arguments);
}
function foo(bar) {
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
function _foo() {
  _foo = _asyncToGenerator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

function foo() {
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
        return _asyncToGenerator(function*() {
            yield g();
        })();
    }
});
"
);

test_exec!(
    syntax(),
    |_| chain_at!(Module, tr(), es2015(Default::default())),
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
    |_| AsyncToGenerator,
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
    |_| chain_at!(Module, AsyncToGenerator, es2015(Default::default())),
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
//    |_| chain!(jsx(), jsc_constant_elements(), AsyncToGenerator {},),
//    regression_7178,
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
//  _action = _asyncToGenerator(function* () {
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
    |_| AsyncToGenerator {},
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
    |_| AsyncToGenerator {},
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
  _foo = _asyncToGenerator(function* () {});
  return _foo.apply(this, arguments);
}

"#
);

// bluebird_coroutines_arrow_function
test!(
    ignore,
    syntax(),
    |_| AsyncToGenerator {},
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
    syntax(),
    |_| chain!(AsyncToGenerator {}, arrow()),
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
  _asyncToGenerator(function* () {
    var _this = this;

    c(function () {
      return _this;
    });
  }));
}

/*#__PURE__*/
_asyncToGenerator(function* () {
  var _this2 = this;

  console.log('async wrapper:', this === 'foo');

  (function () {
    console.log('nested arrow:', _this2 === 'foo');
  })();
}).call('foo');

"#
);

// async_to_generator_shadowed_promise
test!(
    syntax(),
    |_| AsyncToGenerator {},
    async_to_generator_shadowed_promise,
    r#"
let Promise;
async function foo() {
  await new Promise(resolve => { resolve() });
}

"#,
    r#"
let _Promise;

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(function* () {
    yield new _Promise(resolve => {
      resolve();
    });
  });
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_object_method_with_arrows
test!(
    syntax(),
    |_| AsyncToGenerator {},
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

    return _asyncToGenerator(function* () {
      _this;

      () => _this;

      () => {
        _this;

        () => _this;

        function x() {
          var _this2 = this;

          this;

          () => {
            this;
          };

          /*#__PURE__*/
          _asyncToGenerator(function* () {
            _this2;
          });
        }
      };

      function x() {
        var _this3 = this;

        this;

        () => {
          this;
        };

        /*#__PURE__*/
        _asyncToGenerator(function* () {
          _this3;
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
    |_| AsyncToGenerator {},
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
    return _asyncToGenerator(function* () {
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
    |_| AsyncToGenerator {},
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
    // regenerator is not implemented yet.
    ignore,
    syntax(),
    |_| chain!(
        AsyncToGenerator {},
        //regenerator(),
        arrow(),
    ),
    async_to_generator_async_iife_with_regenerator,
    r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });

"#,
    r#"
_asyncToGenerator(
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
_asyncToGenerator(
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
  var _notIIFE = _asyncToGenerator(
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
_asyncToGenerator(
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
//  _foo = _asyncToGenerator(
//  /*#__PURE__*/
//  regeneratorRuntime.mark(function _callee2() {
//    return regeneratorRuntime.wrap(function _callee2$(_context2) {
//      while (1) switch (_context2.prev = _context2.next) {
//        case 0:
//          /*#__PURE__*/
//          (function () {
//            var _ref = _asyncToGenerator(
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
    |_| AsyncToGenerator {},
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
  var _bar = _asyncToGenerator(function* () {
    console.log(bar);
  });

  return function bar() {
    return _bar.apply(this, arguments);
  };

}();

"#
);

//// async_to_generator_async_iife_with_regenerator_spec
//test!(
//    syntax(),
//    |_| chain!(AsyncToGenerator {}, arrow(), regenerator(),),
//    async_to_generator_async_iife_with_regenerator_spec,
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
//_asyncToGenerator(
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
//_asyncToGenerator(
// /*#__PURE__*/
//regeneratorRuntime.mark(function _callee2() {
//  return regeneratorRuntime.wrap(function _callee2$(_context2) {
//    while (1) switch (_context2.prev = _context2.next) {
//      case 0:
//        _newArrowCheck(this, _this);
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
//  var _notIIFE = _asyncToGenerator(
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
//_asyncToGenerator(
// /*#__PURE__*/
//regeneratorRuntime.mark(function _callee4() {
//  return regeneratorRuntime.wrap(function _callee4$(_context4) {
//    while (1) switch (_context4.prev = _context4.next) {
//      case 0:
//        _newArrowCheck(this, _this);
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
    |_| AsyncToGenerator {},
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

  testMethodFailure() {
    var _this = this;

    return new Promise(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (resolve) {
        console.log(_this);
        setTimeout(resolve, 1000);
      });

      return function (_x) {
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
    |_| AsyncToGenerator {},
    bluebird_coroutines_statement,
    r#"
async function foo() {
  var wat = await bar();
}

"#,
    r#"
var _coroutine = require("bluebird").coroutine;

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _coroutine(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

"#
);

// regression_4943
test!(
    syntax(),
    |_| chain!(
        AsyncToGenerator {},
        parameters(),
        destructuring(destructuring::Config { loose: false }),
    ),
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

function foo(_x) {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(function* (_ref) {
    let a = _ref.a,
        _ref$b = _ref.b,
        b = _ref$b === void 0 ? mandatory("b") : _ref$b;
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
    |_| AsyncToGenerator {},
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
_asyncToGenerator(function* () {
  return yield foo();
});

exports.default = _default;

"#
);

// async_to_generator_function_arity
test!(
    syntax(),
    |_| AsyncToGenerator {},
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
function one(_x) {
  return _one.apply(this, arguments);
}

function _one() {
  _one = _asyncToGenerator(function* (a, b = 1) {});
  return _one.apply(this, arguments);
}

function two(_x2, _x3) {
  return _two.apply(this, arguments);
}

function _two() {
  _two = _asyncToGenerator(function* (a, b, ...c) {});
  return _two.apply(this, arguments);
}

function three(_x4) {
  return _three.apply(this, arguments);
}

function _three() {
  _three = _asyncToGenerator(function* (a, b = 1, c, d = 3) {});
  return _three.apply(this, arguments);
}

function four(_x5) {
  return _four.apply(this, arguments);
}

function _four() {
  _four = _asyncToGenerator(function* (a, b = 1, c, ...d) {});
  return _four.apply(this, arguments);
}

function five(_x6, _x7) {
  return _five.apply(this, arguments);
}

function _five() {
  _five = _asyncToGenerator(function* (a, {
    b
  }) {});
  return _five.apply(this, arguments);
}

function six(_x8) {
  return _six.apply(this, arguments);
}

function _six() {
  _six = _asyncToGenerator(function* (a, {
    b
  } = {}) {});
  return _six.apply(this, arguments);
}

"#
);

// async_to_generator_object_method_with_super
test!(
    syntax(),
    |_| AsyncToGenerator {},
    async_to_generator_object_method_with_super,
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
    var _superprop_getMethod = () => super.method,
        _this = this;

    return _asyncToGenerator(function* () {
      _superprop_getMethod().call(_this);

      var arrow = () => _superprop_getMethod().call(_this);
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
    |_| AsyncToGenerator {},
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
  _myFunc = _asyncToGenerator(function* () {});
  return _myFunc.apply(this, arguments);
}

"#
);

// async_to_generator_async
test!(
    syntax(),
    |_| AsyncToGenerator {},
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
    return _asyncToGenerator(function* () {
      var wat = yield bar();
    })();
  }

}

"#
);

// regression_8783
test!(
    syntax(),
    |_| AsyncToGenerator {},
    regression_8783,
    r#"
(async function poll() {
  console.log(await Promise.resolve('Hello'))
  setTimeout(poll, 1000);
})();
"#,
    r#"
(function () {
  var _poll = _asyncToGenerator(function* () {
    console.log((yield Promise.resolve('Hello')));
    setTimeout(poll, 1000);
  });

  return function poll() {
    return _poll.apply(this, arguments);
  }
})()();

"#
);

// async_to_generator_deeply_nested_asyncs
test!(
    syntax(),
    |_| AsyncToGenerator {},
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
function s(_x) {
  return _s.apply(this, arguments);
}

function _s() {
  _s = _asyncToGenerator(function* (x) {
    var _arguments = arguments,
        _this = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    let t =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (y, a) {
        let r =
        /*#__PURE__*/
        function () {
          var _ref2 = _asyncToGenerator(function* (z, b) {
            yield z;

            for (var _len2 = arguments.length, innerArgs = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              innerArgs[_key2 - 2] = arguments[_key2];
            }

            console.log(_this, innerArgs, _arguments);
            return _this.x;
          });

          return function r(_x4, _x5) {
            return _ref2.apply(this, arguments);
          };
        }();

        yield r();
        console.log(_this, args, _arguments);
        return _this.g(r);
      });

      return function t(_x2, _x3) {
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
    |_| AsyncToGenerator {},
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

var _bar = _interopRequireDefault(require("bar"));

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(function* () {});
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_shadowed_promise_nested
test!(
    syntax(),
    |_| AsyncToGenerator {},
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

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(function* () {
    let Promise;
    yield bar();

    function bar() {
      return _bar.apply(this, arguments);
    }

    function _bar() {
      _bar = _asyncToGenerator(function* () {
        return Promise.resolve();
      });
      return _bar.apply(this, arguments);
    }
  });
  return _foo.apply(this, arguments);
}

"#
);

// bluebird_coroutines

// export_async

// regression_4599
test!(
    syntax(),
    |_| AsyncToGenerator {},
    regression_4599,
    r#"
async () => await promise

async () => { await promise }

"#,
    r#"
/*#__PURE__*/
_asyncToGenerator(function* () {
  return yield promise;
});

/*#__PURE__*/
_asyncToGenerator(function* () {
  yield promise;
});

"#
);

// regression_4943_exec
test_exec!(
    syntax(),
    |_| AsyncToGenerator {},
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
    |_| AsyncToGenerator {},
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
    |_| AsyncToGenerator {},
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
    |_| AsyncToGenerator {},
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
  var _ref = _asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function () {
    return _ref.apply(this, arguments);
  };
}();

var foo2 =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function () {
    return _ref.apply(this, arguments);
  };
}(),
    bar =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    var wat = yield foo();
  });

  return function () {
    return _ref.apply(this, arguments);
  };
}();

"#
);

// async_to_generator_statement
test!(
    syntax(),
    |_| AsyncToGenerator {},
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
  _foo = _asyncToGenerator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_shadowed_promise_import
test!(
    syntax(),
    |_| AsyncToGenerator {},
    async_to_generator_shadowed_promise_import,
    r#"
import Promise from 'somewhere';

async function foo() {
  await Promise.resolve();
}

"#,
    r#"
import _Promise from 'somewhere';

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = _asyncToGenerator(function* () {
    yield _Promise.resolve();
  });
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_parameters
test!(
    syntax(),
    |_| AsyncToGenerator {},
    async_to_generator_parameters,
    r#"
async function foo(bar) {

}

"#,
    r#"
function _foo() {
  _foo = _asyncToGenerator(function* (bar) {});
  return _foo.apply(this, arguments);
}

function foo(bar) {
  return _foo.apply(this, arguments);
}
"#
);

// async_to_generator

// regression_t6882_exec
test_exec!(
    syntax(),
    |_| AsyncToGenerator {},
    regression_t6882_exec,
    r#"
foo();

async function foo() {}

"#
);
