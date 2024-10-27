#![allow(clippy::unit_arg)]

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
use swc_ecma_transforms_testing::{test, test_exec};

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

test!(
    syntax(),
    |_| tr(Default::default()),
    empty_fn_decl_1,
    "function* foo(a,b,c){}
"
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
test!(
    syntax(),
    |t| generator(Mark::new(), t.comments.clone()),
    issue_831_3,
    "export function* myGenerator() {
        yield* [1,2,3];
    }"
);

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

test!(
    Syntax::default(),
    |_| tr(()),
    hoist_function_in_generator_issue_2556_1,
    r#"
function* foo() {
    return bar;
    function bar() { }
}
"#
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

test!(
    Syntax::default(),
    |_| tr_with_async(),
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
"#
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

test!(
    Syntax::default(),
    |_| tr_with_async(),
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

test!(
    Syntax::default(),
    |_| tr_with_async(),
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
"#
);

test!(
    Syntax::default(),
    |_| tr(()),
    issue_1125_2,
    "
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
    "
);

test!(
    Syntax::default(),
    |_| tr_with_async(),
    issue_1799_1,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    "
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            es2015::<SingleThreadedComments>(mark, None, Default::default()),
        )
    },
    issue_1799_2,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    "
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        (
            async_to_generator(Default::default(), mark),
            es2016(),
            es2015::<SingleThreadedComments>(mark, None, Default::default()),
        )
    },
    issue_1799_3,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    "
);

test!(
    Syntax::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, true),
            es2022(Default::default(), unresolved_mark),
            es2021(),
            es2018(Default::default()),
            es2017(Default::default(), unresolved_mark),
            es2016(),
            es2015::<SingleThreadedComments>(unresolved_mark, None, Default::default()),
        )
    },
    issue_1799_5,
    "
    export default function Foo() {
        return call(async (e) => { await doSomething(); })
    }
    "
);

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        es2015::<SingleThreadedComments>(mark, None, Default::default())
    },
    issue_2024_1,
    "
    _async_to_generator(function*() {
        const sleep = ()=>new Promise((resolve)=>setTimeout(()=>resolve(undefined), 500));
        const result = (yield sleep()) || 'fallback';
        console.log(result);
    })();
    "
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

test!(
    Syntax::default(),
    |_| {
        let mark = Mark::fresh(Mark::root());
        es2015::<SingleThreadedComments>(mark, None, Default::default())
    },
    issue_7809,
    r#"
    function a(fn) {
        return _a.apply(this, arguments);
    }
    function _a() {
        _a = _async_to_generator(function*(fn) {
            (yield fn()).a = 1;
        });
        return _a.apply(this, arguments);
    }    
    "#
);
