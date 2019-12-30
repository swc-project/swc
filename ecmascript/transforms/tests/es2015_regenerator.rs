#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat::es2015::{parameters, regenerator, spread},
    modules::common_js::common_js,
    pass::Pass,
};

#[macro_use]
mod common;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    regenerator()
}

// arrow_inside_generator
test!(
    syntax(),
    |_| tr(Default::default()),
    arrow_inside_generator,
    r#"
function* gen () {
  const a = () => {
    return 1;
  };
}

"#,
    "
var _marked = regeneratorRuntime.mark(gen);
function gen() {
    return regeneratorRuntime.wrap(function gen$(_ctx) {
        while(1){
            switch(_ctx.prev = _ctx.next){
                case 0: const a = ()=>{
                    return 1;
                };
                case 1:
                case 'end': return _ctx.stop();
            }
        }
    }, _marked);
}
"
);

// computed_properties_example
test!(
    syntax(),
    |_| tr(Default::default()),
    computed_properties_example,
    r#"
var o = {
  *foo() {
    return "foo";
  }
};

"#,
    r#"
var o = {
  foo() {
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
          while (1) switch (_ctx.prev = _ctx.next) {
            case 0:
              return _ctx.abrupt("return", "foo");

            case 1:
            case "end":
              return _ctx.stop();
          }
        }, _callee);
      })()
    );
  }

};

"#
);

// class_argument_scope_example
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    class_argument_scope_example_exec,
    r#"
class Test {
  *iter(arg = this) {
    yield arg;
  }
}

let test = new Test;
expect(test.iter().next().value).toBe(test);

"#
);

// regression_T7041
test!(
    syntax(),
    |_| tr(Default::default()),
    regression_t7041,
    r#"
Object.keys({});

function * fn(){}

"#,
    r#"
var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(fn);

Object.keys({});

function fn() {
  return _regeneratorRuntime.wrap(function fn$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
        case "end":
          return _ctx.stop();
      }
    }
  }, _marked);
}

"#
);

// regression_4219
test!(
    syntax(),
    |_| chain!(
        parameters(),
        spread(Default::default()),
        tr(Default::default())
    ),
    regression_4219,
    r#"
function test(fn) {
    return async (...args) => {
    return fn(...args);
    };
}
"#,
    r#"
function test(fn) {
  return function _callee() {
    var _args = arguments;
    return regeneratorRuntime.async(function _callee$(_ctx) {
      while (1) {
        switch (_ctx.prev = _ctx.next) {
          case 0:
            return _ctx.abrupt("return", fn.apply(void 0, _args));

          case 1:
          case "end":
            return _ctx.stop();
        }
      }
    });
  };
}

"#
);

// regression_6733
test!(
    syntax(),
    |_| chain!(tr(Default::default()), common_js(Default::default())),
    regression_6733,
    r#"
export default function * () {
  var x = yield 5;
  return 5;
}

"#,
    r#"
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _callee;

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(_callee);

function _callee() {
  var x;
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
          _ctx.next = 2;
          return 5;

        case 2:
          x = _ctx.sent;
          return _ctx.abrupt("return", 5);

        case 4:
        case "end":
          return _ctx.stop();
      }
    }
  }, _marked);
}

"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_decl_1,
    "function* foo(a,b,c){}
",
    r#"
var _marked = regeneratorRuntime.mark(foo);

function foo(a, b, c) {
  return regeneratorRuntime.wrap(function foo$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
        case "end":
          return _ctx.stop();
      }
    }
  }, _marked);
}
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_expr_1,
    "let a = function* foo(a,b,c){}
",
    r#"
let a =
/*#__PURE__*/
regeneratorRuntime.mark(function foo(a, b, c) {
  return regeneratorRuntime.wrap(function foo$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
        case "end":
          return _ctx.stop();
      }
    }
  }, foo);
});
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_expr_2,
    "(function* (a,b,c){})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee(a, b, c) {
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
        case 'end':
          return _ctx.stop();
      }
    }
  }, _callee);
});
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    fn_expr_yield_1,
    "(function* (){
  a;
  b;
  yield 3;
  yield b;
})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
          a;
          b;
          _ctx.next = 1;
          return 3;

        case 1:
          _ctx.next = 2;
          return b;

        case 2:
        case 'end':
          return _ctx.stop();
      }
    }
  }, _callee);
});
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    fn_expr_yield_return_1,
    "(function* (){
  a;
  yield 3;
  b;
  return
})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
          a;
          _ctx.next = 1;
          return 3;

        case 1:
          b;
          return _ctx.abrupt('return');

        case 2:
        case 'end':
          return _ctx.stop();
      }
    }
  }, _callee);
});
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    fn_expr_yield_return_2,
    "(function* (){
  a;
  yield 3;
  b;
  return a;
})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_ctx) {
    while (1) {
      switch (_ctx.prev = _ctx.next) {
        case 0:
          a;
          _ctx.next = 1;
          return 3;

        case 1:
          b;
          return _ctx.abrupt('return', a);

        case 2:
        case 'end':
          return _ctx.stop();
      }
    }
  }, _callee);
});
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_1,
    "(function* (){
  a;
  yield 3;
  b;
  if (a)
	  return a
})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1){
            switch(_ctx.prev = _ctx.next){
                case 0:
                    a;
                    _ctx.next = 1;
                    return 3;
                case 1:
                    b;
                    if (a) return _ctx.abrupt('return', a);
                case 2:
                case 'end': return _ctx.stop();
            }
        }
    }, _callee);
});"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_2,
    "(function* (){
  a;
  yield 3;
  b;
  if (a)
	  return a
  yield 1
})",
    "
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1){
            switch(_ctx.prev = _ctx.next){
                case 0:
                    a;
                    _ctx.next = 1;
                    return 3;
                case 1:
                    b;
                    if (a) return _ctx.abrupt('return', a);
                    _ctx.next = 2;
                    return 1;
                case 2:
                case 'end': return _ctx.stop();
            }
        }
    }, _callee);
});"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_exec_1,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    let v = (function* (){
  yield 3;
  if (true)
	  return 2;
  yield 1
})();

expect(v.next()).toEqual({ done: false, value: 3 });
expect(v.next()).toEqual({ done: true, value: 2 });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_exec_2,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    let v = (function* (){
  yield 3;
  if (false)
	  return 2;
  yield 1
})();

expect(v.next()).toEqual({ done: false, value: 3 });
expect(v.next()).toEqual({ done: false, value: 1 });
expect(v.next()).toEqual({ done: true, value: undefined });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_yield_1,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    let v = (function* () {
  if (true)
  	yield 1
  if (false)
    yield 2
  yield 3
})();

expect(v.next()).toEqual({ done: false, value: 1 });
expect(v.next()).toEqual({ done: false, value: 3 });
expect(v.next()).toEqual({ done: true, value: undefined });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    yield_in_seq,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    let v = (function* () {
    return (1, yield 2, yield 3, 4, yield 5);
})();

expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: false, value: 3 });
expect(v.next()).toEqual({ done: false, value: 5 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    yield_in_cond_seq,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    let v = (function* () {
    if (true)
        return (1, yield 2, yield 3, 4, yield 5);
})();

expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: false, value: 3 });
expect(v.next()).toEqual({ done: false, value: 5 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    yield_in_return_and_call,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
    function id(v) { return v; }
    
    let v = (function* () {
    if (true)
        return (1, id(yield id(2)));
})();

expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    yield_in_call,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
function id(v) { return v; }
    
let v = (function* () {
  return (1, id(yield id(2)));
  return (3, id(yield id(4)));
})();

expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    yield_temp,
    "var _regeneratorRuntime = require('@babel/runtime/regenerator');
    
function id(v) { return v; }
    
let v = (function* () {
  yield (1, id(yield id(2), 2));
  return (3, id(yield id(4)));
})();


expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: true });
"
);
