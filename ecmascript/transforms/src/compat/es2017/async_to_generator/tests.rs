use super::*;
use crate::{
    compat::es2015::{arrow, destructuring, es2015, function_name, parameters},
    fixer::fixer,
};

struct ParenRemover;
impl Fold<Expr> for ParenRemover {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);

        let expr = expr.fold_children(self);
        validate!(match expr {
            Expr::Paren(ParenExpr { expr, .. }) => *expr,
            _ => expr,
        })
    }
}

fn tr() -> impl Fold<Module> {
    chain!(
        ParenRemover,
        validating!(arrow()),
        validating!(parameters()),
        validating!(destructuring()),
        validating!(function_name()),
        AsyncToGenerator {},
        fixer()
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
        return new Promise(function(resolve) {
          var _ref = _asyncToGenerator((function*(resolve) {
            console.log(this);
            setTimeout(resolve, 1000);
          }).bind(this));
          return function() {
            return _ref.apply(this, arguments);
          };
        }().bind(this));
      } 
};
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
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
        let ref = param ? param : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), a = ref.a, _ref$b = ref.b, b = _ref$b === void 0 ? mandatory('b') : _ref$b;
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
    return _asyncToGenerator(function* () {
      var wat = yield bar();
    })();
  }

}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
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
        let t = function(y, a) {
            var _ref = _asyncToGenerator((function*(y, a) {
                let r = function(z, b) {
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
                }().bind(this);
                yield r();
                console.log(this, args, arguments);
                return this.g(r);
            }).bind(this));
            return function () {
                return _ref.apply(this, arguments);
            };
        }().bind(this);
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
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
  _one = _asyncToGenerator(function*(a, param) {
    let b = param === void 0 ? 1 : param;
  });
  return _one.apply(this, arguments);
}
function one(a, param) {
  return _one.apply(this, arguments);
}
function _two() {
  _two = _asyncToGenerator(function*(a, b) {
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
  _three = _asyncToGenerator(function*(a, param, c, param1) {
    let b = param === void 0 ? 1 : param, d = param1 === void 0 ? 3 : param1;
  });
  return _three.apply(this, arguments);
}
function three(a, param, c, param1) {
  return _three.apply(this, arguments);
}
function _four() {
  _four = _asyncToGenerator(function*(a, param, c) {
    let b = param === void 0 ? 1 : param;
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
  _five = _asyncToGenerator(function*(a, param) {
    let ref = param ? param : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), b = ref.b;
  });
  return _five.apply(this, arguments);
}
function five(a, param) {
  return _five.apply(this, arguments);
}
function _six() {
  _six = _asyncToGenerator(function*(a, param) {
    let ref = param === void 0 ? {
      } : param, ref1 = ref ? ref : _throw(
          new TypeError("Cannot destructure 'undefined' or 'null'")
          ), b = ref1.b;

  });
  return _six.apply(this, arguments);
}
function six(a, param) {
  return _six.apply(this, arguments);
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| chain_at!(Module, tr(), es2015()),
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
    ::swc_ecma_parser::Syntax::default(),
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
    ::swc_ecma_parser::Syntax::default(),
    |_| chain_at!(Module, AsyncToGenerator, es2015()),
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
