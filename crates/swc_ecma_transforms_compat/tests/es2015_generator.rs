#![allow(clippy::unit_arg)]

mod common;

use swc_common::{
    comments::{NoopComments, SingleThreadedComments},
    Mark,
};
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015, es2015::generator::generator, es2016, es2017, es2017::async_to_generator, es2018,
    es2021, es2022,
};
use swc_ecma_transforms_testing::test_exec;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        generator(unresolved_mark, NoopComments),
    )
}

fn tr_with_async() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        async_to_generator(Default::default(), unresolved_mark),
        generator(unresolved_mark, NoopComments),
    )
}

// computed_properties_example

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
//"#
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
    |t| {
        let unresolved_mark = Mark::new();
        (
            es2017(Default::default(), unresolved_mark),
            es2016(),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default(),
            ),
        )
    },
    issue_600_full,
    "async function foo(b) {
	    for (let a of b) {
	        await a
	    }
    }"
);

test_exec!(
    syntax(),
    |t| {
        let unresolved_mark = Mark::new();
        (
            async_to_generator(Default::default(), unresolved_mark),
            es2015::for_of(Default::default()),
            generator(unresolved_mark, t.comments.clone()),
        )
    },
    issue_600_exact_passes,
    "async function foo(b) {
	    for (let a of b) {
	        await a
	    }
    }"
);

test_exec!(
    syntax(),
    |t| generator(Mark::new(), t.comments.clone()),
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
    |t| generator(Mark::new(), t.comments.clone()),
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

test_exec!(
    syntax(),
    |t| generator(Mark::new(), t.comments.clone()),
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
    |t| generator(Mark::new(), t.comments.clone()),
    issue_849_1,
    "function* gen() { yield 1 };
function genFactory() { return function*() { yield 1 }; }
const v = genFactory()();
expect(v.next()).toEqual({ value: 1, done: false })
expect(v.next()).toEqual({ done: true })"
);

test_exec!(
    syntax(),
    |t| generator(Mark::new(), t.comments.clone()),
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
    |_| tr_with_async(),
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
    |_| tr_with_async(),
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

test_exec!(
    Syntax::default(),
    |_| tr_with_async(),
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

test_exec!(
    Syntax::default(),
    |_| tr_with_async(),
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
    |_| tr_with_async(),
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

test_exec!(
    Syntax::default(),
    |_| tr_with_async(),
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

test_exec!(
    Syntax::default(),
    |t| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            es2015::for_of(Default::default()),
            generator(mark, t.comments.clone()),
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

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "async-to-generator-es2015-fresh-mark")]
    AsyncToGeneratorEs2015FreshMark,
    #[serde(rename = "async-to-generator-es2016-es2015-fresh-mark")]
    AsyncToGeneratorEs2016Es2015FreshMark,
    #[serde(rename = "resolver-es2022-es2021-es2018-es2017-es2016-es2015-typescript-resolver")]
    ResolverEs2022Es2021Es2018Es2017Es2016Es2015TypescriptResolver,
    #[serde(rename = "es2015-fresh-mark")]
    Es2015FreshMark,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/generator/standard/async-to-generator-es2015-fresh-mark/**/input.js")]
#[testing::fixture(
    "tests/generator/standard/async-to-generator-es2016-es2015-fresh-mark/**/input.js"
)]
#[testing::fixture("tests/generator/standard/es2015-fresh-mark/**/input.js")]
#[testing::fixture(
    "tests/generator/standard/\
     resolver-es2022-es2021-es2018-es2017-es2016-es2015-typescript-resolver/**/input.js"
)]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::AsyncToGeneratorEs2015FreshMark => Box::new({
                    let mark = Mark::fresh(Mark::root());
                    (
                        async_to_generator(Default::default(), mark),
                        es2015::<SingleThreadedComments>(mark, None, Default::default()),
                    )
                }),
                CasePipeline::AsyncToGeneratorEs2016Es2015FreshMark => Box::new({
                    let mark = Mark::fresh(Mark::root());
                    (
                        async_to_generator(Default::default(), mark),
                        es2016(),
                        es2015::<SingleThreadedComments>(mark, None, Default::default()),
                    )
                }),
                CasePipeline::ResolverEs2022Es2021Es2018Es2017Es2016Es2015TypescriptResolver => {
                    Box::new({
                        let unresolved_mark = Mark::new();
                        let top_level_mark = Mark::new();
                        (
                            resolver(unresolved_mark, top_level_mark, true),
                            es2022(Default::default(), unresolved_mark),
                            es2021(),
                            es2018(Default::default()),
                            es2017(Default::default(), unresolved_mark),
                            es2016(),
                            es2015::<SingleThreadedComments>(
                                unresolved_mark,
                                None,
                                Default::default(),
                            ),
                        )
                    })
                }
                CasePipeline::Es2015FreshMark => Box::new({
                    let mark = Mark::fresh(Mark::root());
                    es2015::<SingleThreadedComments>(mark, None, Default::default())
                }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
