#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat::es2015::{parameters, regenerator, spread},
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
    r#"
function* gen () {
  const a = () => {
    return 1;
  };
}

"#
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
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", "foo");

            case 1:
            case "end":
              return _context.stop();
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
  return _regeneratorRuntime.wrap(function fn$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
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
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", fn.apply(void 0, _args));

          case 1:
          case "end":
            return _context.stop();
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
    |_| tr(Default::default()),
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
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 5;

        case 2:
          x = _context.sent;
          return _context.abrupt("return", 5);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

"#
);
