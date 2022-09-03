//// [dependentDestructuredVariables.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function f10({ kind , payload  }) {
    'A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase();
}
function f11(action) {
    let { kind , payload  } = action;
    'A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase();
}
function f12({ kind , payload  }) {
    switch(kind){
        case 'A':
            payload.toFixed();
            break;
        case 'B':
            payload.toUpperCase();
    }
}
function f20({ kind , payload  }) {
    payload && ('A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase());
}
function f21(action) {
    let { kind , payload  } = action;
    payload && ('A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase());
}
function f22(action) {
    if (action.payload) {
        let { kind , payload  } = action;
        'A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase();
    }
}
function f23({ kind , payload  }) {
    if (payload) switch(kind){
        case 'A':
            payload.toFixed();
            break;
        case 'B':
            payload.toUpperCase();
    }
}
function f30({ kind , isA  }) {}
function f40(...[kind, data]) {
    'A' === kind && data.toFixed(), 'B' === kind && data.toUpperCase();
}
function unrefined1(ab) {
    let { variant , value  } = ab;
    'a' === variant ? printValue(value) : printValueList(value);
}
let reducerBroken = (state, { type , payload  })=>{
    switch(type){
        case 'add':
            return state + payload.toAdd;
        case 'remove':
            return state - payload.toRemove;
    }
}, { value , done  } = it.next();
f50((kind, data)=>{
    'A' === kind && data.toFixed(), 'B' === kind && data.toUpperCase();
});
let f51 = (kind, payload)=>{
    'A' === kind && payload.toFixed(), 'B' === kind && payload.toUpperCase();
}, f52 = (kind, payload)=>{
    'A' === kind && payload.toFixed();
};
readFile('hello', (err, data)=>{
    null === err ? data.length : err.message;
});
let reducer = (op, args)=>{
    switch(op){
        case "add":
            console.log(args.a + args.b);
            break;
        case "concat":
            console.log(args.firstArr.concat(args.secondArr));
    }
};
reducer("add", {
    a: 1,
    b: 3
}), reducer("concat", {
    firstArr: [
        1,
        2
    ],
    secondArr: [
        3,
        4
    ]
});
let fooM = {
    method (type, cb) {
        cb('num' == type ? 123 : "abc");
    }
}, fooAsyncM = {
    method: (type, cb)=>_async_to_generator(function*() {
            'num' == type ? cb(123) : cb("abc");
        })()
}, fooGenM = {
    *method (type, cb) {
        cb('num' == type ? 123 : "abc");
    }
}, fooAsyncGenM = {
    method: (type, cb)=>_wrap_async_generator(function*() {
            'num' == type ? cb(123) : cb("abc");
        })()
}, f60 = (kind, payload)=>{
    "a" === kind && payload.toFixed(), "b" === kind && payload.toUpperCase();
};
function foo({ value1 , test1 =value1.test1 , test2 =value1.test2 , test3 =value1.test3 , test4 =value1.test4 , test5 =value1.test5 , test6 =value1.test6 , test7 =value1.test7 , test8 =value1.test8 , test9 =value1.test9  }) {}
function fa1(x) {
    let [guard, value] = x;
    if (guard) for(;;);
    else for(;;);
}
function fa2(x) {
    let { guard , value  } = x;
    if (guard) for(;;);
    else for(;;);
}
let fa3 = (guard, value)=>{
    if (guard) for(;;);
    else for(;;);
};
