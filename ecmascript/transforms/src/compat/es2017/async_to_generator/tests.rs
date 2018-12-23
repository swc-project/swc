use super::*;
use crate::{
  compat::es2015::{arrow, destructuring, function_name, parameters},
  fixer::fixer,
};

struct ParenRemover;
impl Fold<Expr> for ParenRemover {
  fn fold(&mut self, expr: Expr) -> Expr {
    let expr = expr.fold_children(self);
    match expr {
      Expr::Paren(ParenExpr { expr, .. }) => *expr,
      _ => expr,
    }
  }
}

fn tr() -> impl Fold<Module> {
  chain!(
    ParenRemover,
    arrow(),
    parameters(),
    destructuring(Default::default()),
    function_name(),
    AsyncToGenerator::default(),
    fixer()
  )
}

test!(
  tr(),
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
      var _ref = asyncToGenerator(function*(resolve) {
        console.log(this);
        setTimeout(resolve, 1000);
      });
      return function() {
        return _ref.apply(this, arguments);
      };
    })().bind(this));
  } 
};
"#
);

test!(
  tr(),
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
    _foo = asyncToGenerator(function*(param) {
        let { a , b =mandatory('b')  } = param;
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
  tr(),
  async_iife,
  r#"
(async function() { await 'ok' })();
(async () => { await 'ok' })();
(async function notIIFE() { await 'ok' });
(async () => { await 'not iife' });
"#,
  r#"
asyncToGenerator(function*() {
    yield 'ok';
});

asyncToGenerator(function*() {
    yield 'ok';
});

(function() {
    var _notIIFE = asyncToGenerator(function*() {
        yield 'ok';
    });
    return function notIIFE() {
        return _notIIFE.apply(this, arguments);
    };
})();

(function() {
    var _ref = asyncToGenerator(function*() {
        yield 'not iife';
    });
    return function() {
        return _ref.apply(this, arguments);
    };
})();
"#
);

test!(
  tr(),
  async,
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
    return asyncToGenerator(function* () {
      var wat = yield bar();
    })();
  }

}
"#
);

test!(
  tr(),
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
  function s(_x) {
  return _s.apply(this, arguments);
}

function _s() {
  _s = asyncToGenerator(function* (x) {
    var _this = this,
        _arguments = arguments;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    let t =
    
    function () {
      var _ref = asyncToGenerator(function* (y, a) {
        let r =
        
        function () {
          var _ref2 = asyncToGenerator(function* (z, b) {
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

test!(
  tr(),
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
  var _foo = asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo() {
    return _foo.apply(this, arguments);
  };
}();

var foo2 = function () {
  var _foo2 = asyncToGenerator(function* () {
    var wat = yield bar();
  });

  return function foo2() {
    return _foo2.apply(this, arguments);
  };
}(),
    bar = function () {
  var _bar = asyncToGenerator(function* () {
    var wat = yield foo();
  });

  return function bar() {
    return _bar.apply(this, arguments);
  };
}();"#
);

test!(
  tr(),
  function_arity,
  r#"
async function one(a, b = 1) {}
async function two(a, b, ...c) {}
async function three(a, b = 1, c, d = 3) {}
async function four(a, b = 1, c, ...d) {}
async function five(a, {b}){}
async function six(a, {b} = {}){}
"#,
  r#"
function _one() {
  _one = asyncToGenerator(function*(a, param) {
    let tmp = param, b = tmp === void 0 ? 1 : tmp;
  });
  return _one.apply(this, arguments);
}
function one(a, param) {
  return _one.apply(this, arguments);
}
function _two() {
  _two = asyncToGenerator(function*(a, b) {
      for(let _len = arguments.length, c = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        c[_key - 2] = arguments[_key];
      }
  });
  return _two.apply(this, arguments);
}
function two(a, b) {
  return _two.apply(this, arguments);
}
function _three() {
  _three = asyncToGenerator(function*(a, param, c, param1) {
    let tmp = param, b = tmp === void 0 ? 1 : tmp, tmp = param1, d = tmp === void 0 ? 3 : tmp;
  });
  return _three.apply(this, arguments);
}
function three(a, param, c, param1) {
  return _three.apply(this, arguments);
}
function _four() {
  _four = asyncToGenerator(function*(a, param, c) {
    let tmp = param, b = tmp === void 0 ? 1 : tmp;
    for(let _len = arguments.length, d = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
      d[_key - 3] = arguments[_key];
    }
  });
  return _four.apply(this, arguments);
}
function four(a, param, c) {
  return _four.apply(this, arguments);
}
function _five() {
  _five = asyncToGenerator(function*(a, param) {
    let ref = param ? param : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), b = ref.b;
  });
  return _five.apply(this, arguments);
}
function five(a, param) {
  return _five.apply(this, arguments);
}
function _six() {
  _six = asyncToGenerator(function*(a, param) {
    let tmp = param, ref = tmp === void 0 ? {
    } : tmp, ref = ref ? ref : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), b = ref.b;
  });
  return _six.apply(this, arguments);
}
function six(a, param) {
  return _six.apply(this, arguments);
}
"#
);

test!(
  tr(),
  named_expression,
  r#"
var foo = async function bar() {
  console.log(bar);
};
"#,
  r#"
var foo = (function() {
  var _bar = asyncToGenerator(function*() {
    console.log(bar);
  });
  return function bar() {
    return _bar.apply(this, arguments);
  };
})();
"#
);

test!(
  tr(),
  no_parameters_and_no_id,
  r#"
foo(async function () {
});"#,
  r#"
foo(asyncToGenerator(function* () {}));
"#
);

test!(
  tr(),
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

    return asyncToGenerator(function* () {
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

          
          asyncToGenerator(function* () {
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

        
        asyncToGenerator(function* () {
          _this3;
        });
      }
    })();
  }

}
"#
);

test!(
  tr(),
  object_method_with_super,
  r#"class Foo extends class {} {
  async method() {
    super.method();

    var arrow = () => super.method();
  }
}"#,
  r#"
class Foo extends class {} {
  method() {
    var _superprop_callMethod = (..._args) => super.method(..._args);

    return asyncToGenerator(function* () {
      _superprop_callMethod();

      var arrow = () => _superprop_callMethod();
    })();
  }

}
"#
);

test!(
  tr(),
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
    return asyncToGenerator(function* () {
      return yield baz(bar);
    })();
  }

};"#
);

test!(
  tr(),
  babel_parameters,
  r#"
async function foo(bar) {

}
"#,
  r#"
function _foo() {
  _foo = asyncToGenerator(function* (bar) {});
  return _foo.apply(this, arguments);
}
function foo(bar) {
  return _foo.apply(this, arguments);
}
"#
);

test!(
  tr(),
  statement,
  r#"
async function foo() {
  var wat = await bar();
}
"#,
  r#"
function _foo() {
  _foo = asyncToGenerator(function* () {
    var wat = yield bar();
  });
  return _foo.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}
"#
);
