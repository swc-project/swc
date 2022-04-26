#![allow(clippy::unit_arg)]

use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015, es2015::regenerator, es2016, es2017, es2017::async_to_generator, es2018, es2021, es2022,
};
use swc_ecma_transforms_testing::{test, test_exec};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        regenerator(Default::default(), unresolved_mark)
    )
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
var regeneratorRuntime = require("regenerator-runtime");

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

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_decl_1,
    "function* foo(a,b,c){}
",
    r#"
var regeneratorRuntime = require("regenerator-runtime");
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
    |t| chain!(
        es2017(Default::default()),
        es2016(),
        es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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
        async_to_generator(Default::default()),
        es2015::for_of(Default::default()),
        es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
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
    |_| es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
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
    |_| es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
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

// test interop between export and regenerator
test!(
    syntax(),
    |_| {
        let mark = Mark::fresh(Mark::root());

        es2015::regenerator(Default::default(), mark)
    },
    issue_831_3,
    "export function* myGenerator() {
        yield* [1,2,3];
    }",
    "var regeneratorRuntime = require(\"regenerator-runtime\");
var _marked = regeneratorRuntime.mark(myGenerator);
export function myGenerator() {
    return regeneratorRuntime.wrap(function myGenerator$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.delegateYield([
                    1,
                    2,
                    3
                ], \"t0\", 1);
            case 1:
            case \"end\":
                return _ctx.stop();
        }
    }, _marked);
}
"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
    delegate_context,
    "function* a() {
        yield 5;
        return 7;
    }
    function* b() {
        let x = yield* a();
        yield (x + 1);
    }
    expect([...b()]).toEqual([5, 8]);"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
    issue_849_1,
    "function* gen() { yield 1 };
function genFactory() { return function*() { yield 1 }; }
const v = genFactory()();
expect(v.next()).toEqual({ value: 1, done: false })
expect(v.next()).toEqual({ done: true })"
);

test_exec!(
    syntax(),
    |_| es2015::regenerator(Default::default(), Mark::fresh(Mark::root())),
    issue_853_1,
    "function throwingFn() { throw 'Error' }
function* gen() {
    try { yield throwingFn() } catch (e) { yield e }
};
const v = gen();
expect(v.next()).toEqual({ done: false, value: 'Error'});
"
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    issue_1036_1,
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
    Syntax::default(),
    |_| tr(()),
    issue_1036_2,
    "
    const x = function*() {
        return Promise.all([[1], [2], [3]].map(
            function*([a]) {
                Promise.resolve().then(() => a * 2)
            })
        )
    }
    ",
    r#"
    var regeneratorRuntime = require("regenerator-runtime");
    const x = regeneratorRuntime.mark(function _callee1() {
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    return _ctx1.abrupt("return", Promise.all([
                        [
                            1
                        ],
                        [
                            2
                        ],
                        [
                            3
                        ]
                    ].map(regeneratorRuntime.mark(function _callee([a]) {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    Promise.resolve().then(()=>a * 2);
                                case 1:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))));
                case 1:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1);
    });
    "#
);

test_exec!(
    Syntax::default(),
    |_| tr(()),
    issue_1036_3,
    "
    const x = function*() {
        yield* [[1], [2], [3]].map(function([a]) {
            return a * 2
        })
    }
    const v = x();
    expect(v.next()).toEqual({ value: 2, done: false})
    expect(v.next()).toEqual({ value: 4, done: false})
    expect(v.next()).toEqual({ value: 6, done: false})
    expect(v.next()).toEqual({ done: true})
    "
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
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
    |_| tr(()),
    hoist_function_in_generator_issue_2556_1,
    r#"
function* foo() {
    return bar;
    function bar() { }
}
"#,
    r#"
var regeneratorRuntime = require("regenerator-runtime");
var _marked = regeneratorRuntime.mark(foo);
function foo() {
  var bar;

  return regeneratorRuntime.wrap(function foo$(_ctx) {
    while (1)
      switch (_ctx.prev = _ctx.next) {
        case 0:
          bar = function _bar() {};

          return _ctx.abrupt("return", bar);
        case 3:
        case "end":
          return _ctx.stop();
      }
  }, _marked);
}
"#
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_2,
    "
async function foo() {
    return bar;
    async function bar() {
        return 1;
    }
    async function bar() {
        return 2;
    }
    async function bar() {
        return 3;
    }
}

return foo()
    .then((bar) => bar())
    .then((x) => {
        expect(x).toEqual(3);
    });
"
);

test!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_4,
    r#"
function requester() {
	return pureRequester
  
    async function pureRequester() {
      	await refreshThenRequest()
        return true;
        
        async function refreshThenRequest() {
        
        }
    }
}
"#,
    r#"
var regeneratorRuntime = require("regenerator-runtime");
function requester() {
  return pureRequester;
  function pureRequester() {
    return _pureRequester.apply(this, arguments);
  }
  function _pureRequester() {
    _pureRequester = _asyncToGenerator(
      regeneratorRuntime.mark(function _callee1() {
        var refreshThenRequest, _refreshThenRequest;
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
          while (1)
            switch (_ctx1.prev = _ctx1.next) {
              case 0:
                refreshThenRequest = function _refreshThenRequest1() {
                  return _refreshThenRequest.apply(this, arguments);
                };
                _refreshThenRequest = function __refreshThenRequest() {
                  _refreshThenRequest = _asyncToGenerator(
                    regeneratorRuntime.mark(function _callee() {
                      return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while (1)
                          switch (_ctx.prev = _ctx.next) {
                            case 0:
                            case "end":
                              return _ctx.stop();
                          }
                      }, _callee);
                    })
                  );
                  return _refreshThenRequest.apply(this, arguments);
                };
                _ctx1.next = 4;
                return refreshThenRequest();
              case 4:
                return _ctx1.abrupt("return", true);
              case 7:
              case "end":
                return _ctx1.stop();
            }
        }, _callee1);
      })
    );
    return _pureRequester.apply(this, arguments);
  }
}
"#
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_5,
    r#"
function requester() {
    return pureRequester;
  
    async function pureRequester() {
      await refreshThenRequest();
      return true;
  
      async function refreshThenRequest() {}
    }
  }
  
  return requester()().then(function test(result) {
      expect(result).toBe(true);
  });
"#
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    issue_2620,
    r#"
async function main() {
    class Weird1 {
        weird = async () => {
            return !!this;
        };

        decoy1 = async () => {};
        decoy2 = () => {};
    }

    class Weird2 {
        weird = async () => {
            return !!this;
        };

        //    decoy1 = async () => { };
        decoy2 = () => {};
    }

    class Weird3 {
        weird = async () => {
            return !!this;
        };

        decoy1 = async () => {};
        //    decoy2 = () => { };
    }

    class Weird4 {
        decoy1 = async () => {};
        decoy2 = () => {};

        weird = async () => {
            return !!this;
        };
    }

    return Promise.all([
        new Weird4().weird(),
        new Weird3().weird(),
        new Weird2().weird(),
        new Weird1().weird(),
    ]);
}

return main().then((results) => {
    expect(results).toEqual([true, true, true, true]);
});
"#
);

test!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_6,
    r#"
async function foo(a) {
    return bar1;

    async function bar1(b) {
        return a + b;
    }
}

foo(1)
    .then((t) => t(2))
    .then(console.log);
"#,
    r#"
var regeneratorRuntime = require("regenerator-runtime");
function foo(a) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _asyncToGenerator(
        regeneratorRuntime.mark(function _callee1(a) {
            var bar1, _bar1;
            return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                while (1)
                    switch (_ctx1.prev = _ctx1.next) {
                        case 0:
                            bar1 = function _bar11(b) {
                                return _bar1.apply(this, arguments);
                            };
                            _bar1 = function __bar1() {
                                _bar1 = _asyncToGenerator(
                                    regeneratorRuntime.mark(function _callee(
                                        b
                                    ) {
                                        return regeneratorRuntime.wrap(
                                            function _callee$(_ctx) {
                                                while (1)
                                                    switch (_ctx.prev = _ctx.next) {
                                                        case 0:
                                                            return _ctx.abrupt(
                                                                "return",
                                                                a + b
                                                            );
                                                        case 1:
                                                        case "end":
                                                            return _ctx.stop();
                                                    }
                                            },
                                            _callee
                                        );
                                    })
                                );
                                return _bar1.apply(this, arguments);
                            };
                            return _ctx1.abrupt("return", bar1);
                        case 5:
                        case "end":
                            return _ctx1.stop();
                    }
            }, _callee1);
        })
    );
    return _foo.apply(this, arguments);
}
foo(1)
    .then((t) => t(2))
    .then(console.log);
"#
);

test_exec!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_7,
    r#"
async function foo(a) {
    return bar1;

    async function bar1(b) {
        return a + b;
    }
}

return foo(1)
    .then((t) => t(2))
    .then((result) => {
        expect(result).toBe(3);
    });
"#
);

test!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    hoist_function_in_async_issue_2556_8,
    r#"
var fib = function fib() {
    return 42;
};
async function init() {
    return fib;

    async function fib(n) {
        if (n <= 1) {
            return n;
        }
        const x = await fib(n - 1);
        const y = await fib(n - 2);
        return x + y;
    }
}
"#,
    r#"
var regeneratorRuntime = require("regenerator-runtime");
var fib = function fib() {
    return 42;
};
function init() {
    return _init.apply(this, arguments);
}
function _init() {
    _init = _asyncToGenerator(
        regeneratorRuntime.mark(function _callee1() {
            var fib1, _fib;
            return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                while (1)
                    switch (_ctx1.prev = _ctx1.next) {
                        case 0:
                            fib1 = function _fib1(n) {
                                return _fib.apply(this, arguments);
                            };
                            _fib = function __fib() {
                                _fib = _asyncToGenerator(
                                    regeneratorRuntime.mark(function _callee(
                                        n
                                    ) {
                                        var x, y;
                                        return regeneratorRuntime.wrap(
                                            function _callee$(_ctx) {
                                                while (1)
                                                    switch (_ctx.prev = _ctx.next) {
                                                        case 0:
                                                            if (!(n <= 1)) {
                                                                _ctx.next = 2;
                                                                break;
                                                            }
                                                            return _ctx.abrupt(
                                                                "return",
                                                                n
                                                            );
                                                        case 2:
                                                            _ctx.next = 4;
                                                            return fib1(n - 1);
                                                        case 4:
                                                            x = _ctx.sent;
                                                            _ctx.next = 7;
                                                            return fib1(n - 2);
                                                        case 7:
                                                            y = _ctx.sent;
                                                            return _ctx.abrupt(
                                                                "return",
                                                                x + y
                                                            );
                                                        case 9:
                                                        case "end":
                                                            return _ctx.stop();
                                                    }
                                            },
                                            _callee
                                        );
                                    })
                                );
                                return _fib.apply(this, arguments);
                            };
                            return _ctx1.abrupt("return", fib1);
                        case 5:
                        case "end":
                            return _ctx1.stop();
                    }
            }, _callee1);
        })
    );
    return _init.apply(this, arguments);
}
"#
);

test!(
    Syntax::default(),
    |_| tr(()),
    issue_1125_2,
    "
    function _test() {
        _test = _asyncToGenerator(function* () {
            try {
            yield 1;
            } finally {
            console.log(2);
            }
        });
        return _test.apply(this, arguments);
    }

    function test() {
        return _test.apply(this, arguments);
    }

    test();
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");

    function _test() {
        _test = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while (1)
              switch (_ctx.prev = _ctx.next) {
                case 0:
                  _ctx.prev = 0;
                  _ctx.next = 3;
                  return 1;

                case 3:
                  _ctx.prev = 3;
                  console.log(2);
                  return _ctx.finish(3);

                case 6:
                case \"end\":
                  return _ctx.stop();
              }
          }, _callee, null, [[0,, 3, 6]]);
        }));
        return _test.apply(this, arguments);
      }

      function test() {
        return _test.apply(this, arguments);
      }

      test();
    "
);

test!(
    Syntax::default(),
    |_| tr(()),
    issue_1125_3,
    "
    function* foo() {
        try {
            yield 1;
        } finally {
            console.log(2);
        }
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    var _marked = regeneratorRuntime.mark(foo);

    function foo() {
        return regeneratorRuntime.wrap(function foo$(_ctx) {
            while (1)
            switch (_ctx.prev = _ctx.next) {
                case 0:
                _ctx.prev = 0;
                _ctx.next = 3;
                return 1;

                case 3:
                _ctx.prev = 3;
                console.log(2);
                return _ctx.finish(3);

                case 6:
                case \"end\":
                return _ctx.stop();
            }
        }, _marked, null, [[0,, 3, 6]]);
    }
    "
);

test!(
    Syntax::default(),
    |_| tr(()),
    issue_1125_4,
    "
    function* foo() {
        try {
            yield 1;
        } catch(e) {
            console.log(2);
        }
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    var _marked = regeneratorRuntime.mark(foo);

    function foo() {
      return regeneratorRuntime.wrap(function foo$(_ctx) {
        while (1)
          switch (_ctx.prev = _ctx.next) {
            case 0:
              _ctx.prev = 0;
              _ctx.next = 3;
              return 1;

            case 3:
              _ctx.next = 8;
              break;

            case 5:
              _ctx.prev = 5;
              _ctx.t0 = _ctx[\"catch\"](0);
              console.log(2);

            case 8:
            case \"end\":
              return _ctx.stop();
          }
      }, _marked, null, [[0, 5]]);
    }
    "
);

test!(
    Syntax::default(),
    |_| chain!(async_to_generator(Default::default()), tr(())),
    issue_1799_1,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    export default function Foo() {
        return call(function() {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return doSomething();
                        case 2:
                        case \"end\":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }());
    }
"
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator(Default::default()),
            es2015::<SingleThreadedComments>(mark, None, Default::default())
        )
    },
    issue_1799_2,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    export default function Foo() {
        return call(function() {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return doSomething();
                        case 2:
                        case \"end\":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }());
    }
"
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator(Default::default()),
            es2016(),
            es2015::<SingleThreadedComments>(mark, None, Default::default()),
        )
    },
    issue_1799_3,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    export default function Foo() {
        return call(function() {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return doSomething();
                        case 2:
                        case \"end\":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }());
    }
"
);

test!(
    Syntax::default(),
    |t| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            es2022(Some(t.comments.clone()), Default::default()),
            es2021(),
            es2018(Default::default()),
            es2017(Default::default()),
            es2016(),
            es2015::<SingleThreadedComments>(mark, None, Default::default()),
        )
    },
    issue_1799_5,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    export default function Foo() {
        return call(function() {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return doSomething();
                        case 2:
                        case \"end\":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }());
    }
"
);

test!(
    syntax(),
    |_| tr(Default::default()),
    issue_1892,
    r#"
    function *gen() {
            var firstTime = true;
        outer:
        while (true) {
              yield 0;
          try {
                while (true) {
                  yield 1;
              if (firstTime) {
                    firstTime = false;
                yield 2;
                continue outer;
              } else {
                    yield 3;
                break;
              }
            }
            yield 4;
            break;
          } finally {
                yield 5;
          }
          yield 6;
        }
        yield 7;
      }

    const iter = gen();
    expect(iter.next()).toEqual({value: 0, done: false});
    expect(iter.next()).toEqual({value: 1, done: false});
    expect(iter.next()).toEqual({value: 2, done: false});
    expect(iter.next()).toEqual({value: 5, done: false});
    expect(iter.next()).toEqual({value: 0, done: false});
    expect(iter.next()).toEqual({value: 1, done: false});
    expect(iter.next()).toEqual({value: 3, done: false});
    expect(iter.next()).toEqual({value: 4, done: false});
    expect(iter.next()).toEqual({value: 5, done: false});
    expect(iter.next()).toEqual({value: 7, done: false});
    expect(iter.next()).toEqual({value: undefined, done: true});

"#,
    r#"
    var regeneratorRuntime = require("regenerator-runtime");
    var _marked = regeneratorRuntime.mark(gen);
    function gen() {
            var firstTime;
        return regeneratorRuntime.wrap(function gen$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                    firstTime = true;
                case 1:
                    if (!true) {
                            _ctx.next = 31;
                        break;
                    }
                    _ctx.next = 4;
                    return 0;
                case 4:
                    _ctx.prev = 4;
                case 5:
                    if (!true) {
                            _ctx.next = 20;
                        break;
                    }
                    _ctx.next = 8;
                    return 1;
                case 8:
                    if (!firstTime) {
                            _ctx.next = 15;
                        break;
                    }
                    firstTime = false;
                    _ctx.next = 12;
                    return 2;
                case 12:
                    return _ctx.abrupt("continue", 1);
                case 15:
                    _ctx.next = 17;
                    return 3;
                case 17:
                    return _ctx.abrupt("break", 20);
                case 18:
                    _ctx.next = 5;
                    break;
                case 20:
                    _ctx.next = 22;
                    return 4;
                case 22:
                    return _ctx.abrupt("break", 31);
                case 23:
                    _ctx.prev = 23;
                    _ctx.next = 26;
                    return 5;
                case 26:
                    return _ctx.finish(23);
                case 27:
                    _ctx.next = 29;
                    return 6;
                case 29:
                    _ctx.next = 1;
                    break;
                case 31:
                    _ctx.next = 33;
                    return 7;
                case 33:
                case "end":
                    return _ctx.stop();
            }
        }, _marked, null, [
            [
                4,
                ,
                23,
                27
            ]
        ]);
    }

    const iter = gen();
    expect(iter.next()).toEqual({
            value: 0,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 1,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 2,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 5,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 0,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 1,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 3,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 4,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 5,
        done: false
    });
    expect(iter.next()).toEqual({
            value: 7,
        done: false
    });
    expect(iter.next()).toEqual({
            value: undefined,
        done: true
    });
"#
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        es2015::<SingleThreadedComments>(mark, None, Default::default())
    },
    issue_2024_1,
    "
    _asyncToGenerator(function*() {
        const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
        const result = (yield sleep()) || 'fallback';
        console.log(result);
    })();
    ",
    "
    var regeneratorRuntime = require(\"regenerator-runtime\");
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var sleep, result;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    sleep = function() {
                        return new Promise(function(resolve) {
                            return setTimeout(function() {
                                return resolve(undefined);
                            }, 500);
                        });
                    };
                    _ctx.next = 3;
                    return sleep();
                case 3:
                    _ctx.t0 = _ctx.sent;
                    if (_ctx.t0) {
                        _ctx.next = 6;
                        break;
                    }
                    _ctx.t0 = 'fallback';
                case 6:
                    result = _ctx.t0;
                    console.log(result);
                case 8:
                case \"end\":
                    return _ctx.stop();
            }
        }, _callee);
    }))();
    "
);

test_exec!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        chain!(
            async_to_generator(Default::default()),
            es2015::for_of(Default::default()),
            regenerator(Default::default(), mark)
        )
    },
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
