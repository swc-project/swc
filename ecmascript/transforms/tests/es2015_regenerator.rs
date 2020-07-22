#![feature(test)]
#![feature(box_patterns)]

use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{
    compat::{es2015, es2015::regenerator, es2016, es2017, es2017::async_to_generator},
    modules::common_js::common_js,
    resolver,
};
use swc_ecma_visit::Fold;

#[macro_use]
mod common;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Fold {
    chain!(resolver(), regenerator(Mark::fresh(Mark::root())))
}

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
var regeneratorRuntime = require('regenerator-runtime');

var o = {
  foo() {
    return regeneratorRuntime.mark(function _callee() {
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
    ;
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

//// regression_T7041
//test!(
//    syntax(),
//    |_| tr(Default::default()),
//    regression_t7041,
//    r#"
//var _regeneratorRuntime = require("regenerator-runtime");
//
//Object.keys({});
//
//function * fn(){}
//
//"#,
//    r#"
//var _regeneratorRuntime = require("regenerator-runtime");
//
//var _marked = _regeneratorRuntime.mark(fn);
//
//Object.keys({});
//
//function fn() {
//  return _regeneratorRuntime.wrap(function fn$(_ctx) {
//    while (1) {
//      switch (_ctx.prev = _ctx.next) {
//        case 0:
//        case "end":
//          return _ctx.stop();
//      }
//    }
//  }, _marked);
//}
//
//"#
//);

// regression_6733
test!(
    syntax(),
    |_| chain!(
        tr(Default::default()),
        common_js(Mark::fresh(Mark::root()), Default::default())
    ),
    regression_6733,
    r#"
export default function * () {
  var x = yield 5;
  return 5;
}

"#,
    r#"
'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = void 0;
var regeneratorRuntime = require('regenerator-runtime');
var _default = function _callee() {
    var x;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return 5;
            case 2:
                x = _ctx.sent;
                void 0;
                return _ctx.abrupt('return', 5);
            case 5:
            case 'end': return _ctx.stop();
        }
    }, _callee);
};
exports.default = _default;
"#
);

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_decl_1,
    "function* foo(a,b,c){}
",
    r#"
var regeneratorRuntime = require('regenerator-runtime');
var _marked = regeneratorRuntime.mark(foo);

function foo(a, b, c) {
  return regeneratorRuntime.wrap(function foo$(_ctx) {
    while (1) 
      switch (_ctx.prev = _ctx.next) {
        case 0:
        case "end":
          return _ctx.stop();
      }
  }, _marked);
}
"#
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_1,
    "
    
let v = (function* (){
  yield 3;
  if (true)
	  return 1
})();

expect(v.next()).toEqual({ value: 3, done: false });
expect(v.next()).toEqual({ value: 1, done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_2,
    "
    
let v = (function* (){
  if (false)
	  return a
  yield 1
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });


"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_return_exec_1,
    "
    
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
    "
    
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
    "
    
    let v = (function* () {
  if (true)
  	yield 1
})();

expect(v.next()).toEqual({ done: false, value: 1 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    conditional_yield_2,
    "
    
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
    "
    
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
    "
    
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
    "
    
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
    "
    
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
    ignore,
    syntax(),
    |_| tr(Default::default()),
    yield_temp,
    "
    
function id(v) { return v; }
    
let v = (function* () {
  yield (1, id(yield id(2), 2));
  return (3, id(yield id(4)));
})();


expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: false, value: 2 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    ignore,
    syntax(),
    |_| tr(Default::default()),
    yield_next_value,
    "
    
let v = (function* () {
  let bar = yield 'foo';
  yield bar
})();

expect(v.next('bar')).toEqual({value: 'foo', done: false})
expect(v.next()).toEqual({value: 'bar', done: false})
expect(v.next()).toEqual({done: true})
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    only_yield,
    "
    
let v = (function* () {
    yield 1
})();

expect(v.next()).toEqual({ done: false, value: 1 });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_cond,
    "
    
let v = (function* (){
  true ? yield 1 : yield 2;
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_array,
    "
    
let v = (function* (){
  yield [yield 1, 2];
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: [undefined, 2], done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_object,
    "
    
let v = (function* (){
  yield { a: 1 };
})();

expect(v.next()).toEqual({ value: { a: 1 }, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_logical_and,
    "
    
let v = (function* (){
  (yield 1) && (yield 2);
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_logical_or,
    "
    
let v = (function* (){
  (yield 1) || (yield 2);
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_update_prefix,
    "
    
let v = (function* (){
  let i = 0;
  yield ++i;
  yield i;
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    expr_update_postfix,
    "
    
let v = (function* (){
  let i = 0;
  yield i++;
  yield i;
})();

expect(v.next()).toEqual({ value: 0, done: false });
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    bin_expr_1,
    "
    
let v = (function* (){
  yield ((yield 1) + (yield 2));
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ value: NaN, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    try_stmt_1,
    "
    
let v = (function* (){
  try {
    yield 1;
  } catch(e){
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    try_stmt_2,
    "
    
let v = (function* (){
  try {
    yield 1;
    throw new Error('');
  } catch(e){
    yield 2;
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    try_stmt_3,
    "
    
let v = (function* (){
  try {
    yield 1;
    throw new Error('');
  } finally {
    yield 2;
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(() => v.next()).toThrow();
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    try_stmt_4,
    "
    
let v = (function* (){
  try {
    yield 1;
    throw new Error('');
  } catch (e) {
    yield 2;
  } finally {
    yield 3;
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ value: 3, done: false });

"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    try_stmt_5,
    "
    
let v = (function* (){
  try {
    yield 1;
  } catch (e) {
  }
  try {
    yield 2;
  } catch (e) {
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    labeled_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    break_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    continue_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    switch_stmt_1,
    "
    
let v = (function* (){
  switch(1) {
  	case 1: 
      yield 1
      yield 2
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    switch_stmt_2,
    "
    
let v = (function* (){
  switch(2) {
  	case 1: 
      yield 1
      yield 2
  }
})();

expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    switch_stmt_3,
    "
    
let v = (function* (){
  switch(2) {
  	default: 
      yield 1
      yield 2
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    switch_stmt_4,
    "
    
let v = (function* (){
  switch(1) {
  	case 1: 
      yield 1
  	case 2: 
      yield 2
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    switch_stmt_5,
    "
    
let v = (function* (){
  switch(1) {
  	case 1: 
      yield 1;
      break;
  	case 2: 
      yield 2;
      break;
  	case 3: 
      yield 3;
      break;
  	case 4: 
      yield 4;
      break;
  }
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    throw_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    while_stmt_1,
    "
    
let v = (function* (){
    let i = 0;
    while (true) {
        yield i++;
    }
})();

expect(v.next()).toEqual({ value: 0, done: false });
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ value: 3, done: false });
expect(v.next()).toEqual({ value: 4, done: false });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    do_while_stmt_1,
    "
    
let v = (function* (){
    let i = 0;
    do {
        yield i++;
    } while(true);
})();

expect(v.next()).toEqual({ value: 0, done: false });
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ value: 3, done: false });
expect(v.next()).toEqual({ value: 4, done: false });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    do_while_stmt_2,
    "
    
let v = (function* (){
    do {
        yield 1;
    } while(false);
})();

expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    for_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    for_of_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

// TODO
test_exec!(
    syntax(),
    |_| tr(Default::default()),
    for_in_stmt_1,
    "
    
let v = (function* (){
})();

expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    bin_expr_2,
    "
    
let v = (function* (){
  let a = 1;
  let b = 2;
  yield a + b;
  yield (yield a) + (yield b)
})();

expect(v.next()).toEqual({ value: 3, done: false });
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ value: NaN, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    arguments_1,
    "
    
function* gen(){
    yield Array.prototype.slice.call(arguments);
}

var v = gen(1, 2);
expect(v.next()).toEqual({ value: [1, 2], done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| tr(Default::default()),
    arguments_2,
    "
    
function* gen(){
    yield arguments[0];
    yield arguments[1];
}

var v = gen(1, 2);
expect(v.next()).toEqual({ value: 1, done: false });
expect(v.next()).toEqual({ value: 2, done: false });
expect(v.next()).toEqual({ done: true });

var v = gen(3, 4);
expect(v.next()).toEqual({ value: 3, done: false });
expect(v.next()).toEqual({ value: 4, done: false });
expect(v.next()).toEqual({ done: true });
"
);

test_exec!(
    syntax(),
    |_| chain!(
        es2017(),
        es2016(),
        es2015(Mark::fresh(Mark::root()), Default::default()),
    ),
    issue_600_full,
    "async function foo(b) {
	    for (let a of b) {
	        await a
	    }
    }"
);

test_exec!(
    syntax(),
    |_| chain!(
        async_to_generator(),
        es2015::for_of(Default::default()),
        es2015::regenerator(Mark::fresh(Mark::root())),
    ),
    issue_600_exact_passes,
    "async function foo(b) {
	    for (let a of b) {
	        await a
	    }
    }"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Mark::fresh(Mark::root())),
    issue_600_min,
    "function* foo() {
        try {
            yield 1;
            throw new Error('1')
        } finally{
            try {
                yield 2;
            } finally{
                throw new Error('2');
            }
        }
    }
    
    var v = foo();
    expect(v.next()).toEqual({ value: 1, done: false });
    expect(v.next()).toEqual({ value: 2, done: false });
    expect(() => v.next()).toThrow('2')
    "
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Mark::fresh(Mark::root())),
    issue_831_1,
    "function* myGenerator() {
        yield* [1,2,3];
    }
    
    const v = myGenerator();
    expect(v.next()).toEqual({ value: 1, done: false });
    expect(v.next()).toEqual({ value: 2, done: false });
    expect(v.next()).toEqual({ value: 3, done: false });
    expect(v.next()).toEqual({ done: true });
    "
);

// test interop between cjs module and regenerator
test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        chain!(
            es2015::regenerator(mark),
            common_js(mark, Default::default()),
        )
    },
    issue_831_2,
    "export function* myGenerator() {
        yield* [1,2,3];
    }",
    "'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.myGenerator = myGenerator;
var regeneratorRuntime = require('regenerator-runtime');
var _marked = regeneratorRuntime.mark(myGenerator);
function myGenerator() {
    return regeneratorRuntime.wrap(function myGenerator$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    1,
                    2,
                    3
                ], _ctx.t0, 1);
            case 1:
                _ctx.t0;
            case 2:
            case 'end':
                return _ctx.stop();
        }
    }, _marked);
}"
);

// test interop between export and regenerator
test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        es2015::regenerator(mark)
    },
    issue_831_3,
    "export function* myGenerator() {
        yield* [1,2,3];
    }",
    "var regeneratorRuntime = require('regenerator-runtime');
var _marked = regeneratorRuntime.mark(myGenerator);
export function myGenerator() {
    return regeneratorRuntime.wrap(function myGenerator$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    1,
                    2,
                    3
                ], _ctx.t0, 1);
            case 1:
                _ctx.t0;
            case 2:
            case 'end':
                return _ctx.stop();
        }
    }, _marked);
}
"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Mark::fresh(Mark::root())),
    issue_849_1,
    "function* gen() { yield 1 };
function genFactory() { return function*() { yield 1 }; }
const v = genFactory()();
expect(v.next()).toEqual({ value: 1, done: false })
expect(v.next()).toEqual({ done: true })"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Mark::fresh(Mark::root())),
    issue_853_1,
    "function throwingFn() { throw 'Error' }
function* gen() { 
    try { yield throwingFn() } catch (e) { yield e }
};
const v = gen();
expect(v.next()).toEqual({ done: false, value: 'Error'});
"
);
