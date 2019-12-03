// regression_7178
test!(
    syntax(),
    |_| chain!(jsx(), jsc_constant_elements(), AsyncToGenerator {},),
    regression_7178,
    r#"
const title = "Neem contact op";

async function action() {
  return <Contact title={title} />;
}

"#,
    r#"
const title = "Neem contact op";

function action() {
  return _action.apply(this, arguments);
}

var _ref =
/*#__PURE__*/
React.createElement(Contact, {
  title: title
});

function _action() {
  _action = babelHelpers.asyncToGenerator(function* () {
    return _ref;
  });
  return _action.apply(this, arguments);
}

"#
);

// bluebird_coroutines_named_expression
test!(
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
  _foo = babelHelpers.asyncToGenerator(function* () {});
  return _foo.apply(this, arguments);
}

"#
);

// bluebird_coroutines_arrow_function
test!(
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

// regression_T6882

// regression_T7194
test!(
    syntax(),
    |_| chain!(AsyncToGenerator {}, Arrow),
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
  babelHelpers.asyncToGenerator(function* () {
    var _this = this;

    c(function () {
      return _this;
    });
  }));
}

/*#__PURE__*/
babelHelpers.asyncToGenerator(function* () {
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
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

    return babelHelpers.asyncToGenerator(function* () {
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
          babelHelpers.asyncToGenerator(function* () {
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
        babelHelpers.asyncToGenerator(function* () {
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
    return babelHelpers.asyncToGenerator(function* () {
      return yield baz(bar);
    })();
  }

};

"#
);

// bluebird_coroutines_class
test!(
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
    syntax(),
    |_| chain!(AsyncToGenerator {}, regenerator(), arrow(),),
    async_to_generator_async_iife_with_regenerator,
    r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });

"#,
    r#"
babelHelpers.asyncToGenerator(
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
babelHelpers.asyncToGenerator(
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
  var _notIIFE = babelHelpers.asyncToGenerator(
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
babelHelpers.asyncToGenerator(
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
//  _foo = babelHelpers.asyncToGenerator(
//  /*#__PURE__*/
//  regeneratorRuntime.mark(function _callee2() {
//    return regeneratorRuntime.wrap(function _callee2$(_context2) {
//      while (1) switch (_context2.prev = _context2.next) {
//        case 0:
//          /*#__PURE__*/
//          (function () {
//            var _ref = babelHelpers.asyncToGenerator(
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
  var _bar = babelHelpers.asyncToGenerator(function* () {
    console.log(bar);
  });

  function bar() {
    return _bar.apply(this, arguments);
  }

  return bar;
}();

"#
);

// async_to_generator_async_iife_with_regenerator_spec
test!(syntax(),|_| tr("{
  "plugins": [
    ["transform-arrow-functions", { "spec": true }],
    "transform-regenerator",
    "transform-async-to-generator",
    "external-helpers"
  ]
}
"), async_to_generator_async_iife_with_regenerator_spec, r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });

"#, r#"
var _this = this;

babelHelpers.asyncToGenerator(
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
babelHelpers.asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        babelHelpers.newArrowCheck(this, _this);
        _context2.next = 3;
        return 'ok';

      case 3:
      case "end":
        return _context2.stop();
    }
  }, _callee2, this);
})).bind(this)();

/*#__PURE__*/
(function () {
  var _notIIFE = babelHelpers.asyncToGenerator(
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
babelHelpers.asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee4() {
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        babelHelpers.newArrowCheck(this, _this);
        _context4.next = 3;
        return 'not iife';

      case 3:
      case "end":
        return _context4.stop();
    }
  }, _callee4, this);
})).bind(this);

"#);

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
      var _ref = babelHelpers.asyncToGenerator(function* (resolve) {
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
test!(syntax(),|_| tr("{
  "plugins": [
    "transform-async-to-generator",
    "transform-destructuring",
    "transform-parameters"
  ],
  "parserOpts": {
    "allowReturnOutsideFunction": true
  }
}
"), regression_4943, r#"
"use strict";

function mandatory(paramName) {
  throw new Error(`Missing parameter: ${paramName}`);
}

async function foo({ a, b = mandatory("b") }) {
  return Promise.resolve(b);
}

"#, r#"
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

"#);

// export_async_default_arrow_export
test!(
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
babelHelpers.asyncToGenerator(function* () {
  return yield foo();
});

exports.default = _default;

"#
);

// async_to_generator_function_arity
test!(syntax(),|_| tr("{
  "plugins": ["transform-async-to-generator", "external-helpers"]
}
"), async_to_generator_function_arity, r#"
async function one(a, b = 1) {}
async function two(a, b, ...c) {}
async function three(a, b = 1, c, d = 3) {}
async function four(a, b = 1, c, ...d) {}
async function five(a, {b}){}
async function six(a, {b} = {}){}

"#, r#"
function one(_x) {
  return _one.apply(this, arguments);
}

function _one() {
  _one = babelHelpers.asyncToGenerator(function* (a, b = 1) {});
  return _one.apply(this, arguments);
}

function two(_x2, _x3) {
  return _two.apply(this, arguments);
}

function _two() {
  _two = babelHelpers.asyncToGenerator(function* (a, b, ...c) {});
  return _two.apply(this, arguments);
}

function three(_x4) {
  return _three.apply(this, arguments);
}

function _three() {
  _three = babelHelpers.asyncToGenerator(function* (a, b = 1, c, d = 3) {});
  return _three.apply(this, arguments);
}

function four(_x5) {
  return _four.apply(this, arguments);
}

function _four() {
  _four = babelHelpers.asyncToGenerator(function* (a, b = 1, c, ...d) {});
  return _four.apply(this, arguments);
}

function five(_x6, _x7) {
  return _five.apply(this, arguments);
}

function _five() {
  _five = babelHelpers.asyncToGenerator(function* (a, {
    b
  }) {});
  return _five.apply(this, arguments);
}

function six(_x8) {
  return _six.apply(this, arguments);
}

function _six() {
  _six = babelHelpers.asyncToGenerator(function* (a, {
    b
  } = {}) {});
  return _six.apply(this, arguments);
}

"#);

// async_to_generator_object_method_with_super
test!(syntax(),|_| tr("{
  "plugins": ["transform-async-to-generator", "external-helpers"]
}
"), async_to_generator_object_method_with_super, r#"
class Foo extends class {} {
  async method() {
    super.method();

    var arrow = () => super.method();
  }
}

"#, r#"
class Foo extends class {} {
  method() {
    var _superprop_getMethod = () => super.method,
        _this = this;

    return babelHelpers.asyncToGenerator(function* () {
      _superprop_getMethod().call(_this);

      var arrow = () => _superprop_getMethod().call(_this);
    })();
  }

}

"#);

// export_async_default_export
test!(
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
  _myFunc = babelHelpers.asyncToGenerator(function* () {});
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
    return babelHelpers.asyncToGenerator(function* () {
      var wat = yield bar();
    })();
  }

}

"#
);

// regression_8783
test!(syntax(),|_| tr("{
  "plugins": ["transform-async-to-generator"],
  "parserOpts": {
    "allowReturnOutsideFunction": true
  }
}
"), regression_8783, r#"
(async function poll() {
  console.log(await Promise.resolve('Hello'))
  setTimeout(poll, 1000);
})();
"#, r#"
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function () {
  var _poll = _asyncToGenerator(function* () {
    console.log((yield Promise.resolve('Hello')));
    setTimeout(poll, 1000);
  });

  function poll() {
    return _poll.apply(this, arguments);
  }

  return poll;
})()();

"#);

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
  _s = babelHelpers.asyncToGenerator(function* (x) {
    var _arguments = arguments,
        _this = this;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    let t =
    /*#__PURE__*/
    function () {
      var _ref = babelHelpers.asyncToGenerator(function* (y, a) {
        let r =
        /*#__PURE__*/
        function () {
          var _ref2 = babelHelpers.asyncToGenerator(function* (z, b) {
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

var _bar = babelHelpers.interopRequireDefault(require("bar"));

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = babelHelpers.asyncToGenerator(function* () {});
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_shadowed_promise_nested
test!(syntax(),|_| tr("{
  "plugins": ["transform-async-to-generator"]
}
"), async_to_generator_shadowed_promise_nested, r#"
let Promise;

async function foo() {
  let Promise;

  await bar();

  async function bar() {
    return Promise.resolve();
  }
}

"#, r#"
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

"#);

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
babelHelpers.asyncToGenerator(function* () {
  return yield promise;
});

/*#__PURE__*/
babelHelpers.asyncToGenerator(function* () {
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
  var _ref = babelHelpers.asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo() {
    return _ref.apply(this, arguments);
  };
}();

var foo2 =
/*#__PURE__*/
function () {
  var _ref2 = babelHelpers.asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo2() {
    return _ref2.apply(this, arguments);
  };
}(),
    bar =
/*#__PURE__*/
function () {
  var _ref3 = babelHelpers.asyncToGenerator(function* () {
    var wat = yield foo();
  });

  return function bar() {
    return _ref3.apply(this, arguments);
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
  _foo = babelHelpers.asyncToGenerator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator_shadowed_promise_import
test!(syntax(),|_| tr("{
  "plugins": ["transform-async-to-generator"]
}
"), async_to_generator_shadowed_promise_import, r#"
import Promise from 'somewhere';

async function foo() {
  await Promise.resolve();
}

"#, r#"
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

"#);

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
function foo(_x) {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = babelHelpers.asyncToGenerator(function* (bar) {});
  return _foo.apply(this, arguments);
}

"#
);

// async_to_generator

// regression_T6882_exec
test_exec!(
    syntax(),
    |_| AsyncToGenerator {},
    regression_T6882_exec,
    r#"
foo();

async function foo() {}

"#
);
