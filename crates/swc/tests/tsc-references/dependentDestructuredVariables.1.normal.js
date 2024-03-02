//// [dependentDestructuredVariables.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f10({ kind, payload }) {
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f11(action) {
    const { kind, payload } = action;
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f12({ kind, payload }) {
    switch(kind){
        case 'A':
            payload.toFixed();
            break;
        case 'B':
            payload.toUpperCase();
            break;
        default:
            payload; // never
    }
}
// repro #50206
function f13({ kind, payload }) {
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f14(t) {
    const { kind, payload } = t;
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f20({ kind, payload }) {
    if (payload) {
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f21(action) {
    const { kind, payload } = action;
    if (payload) {
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f22(action) {
    if (action.payload) {
        const { kind, payload } = action;
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f23({ kind, payload }) {
    if (payload) {
        switch(kind){
            case 'A':
                payload.toFixed();
                break;
            case 'B':
                payload.toUpperCase();
                break;
            default:
                payload; // never
        }
    }
}
function f30({ kind, isA }) {
    if (kind === 'A') {
        isA; // true
    }
    if (kind === 'B') {
        isA; // false
    }
    if (kind === 'C') {
        isA; // false
    }
    if (isA) {
        kind; // 'A'
    } else {
        kind; // 'B' | 'C'
    }
}
function f40(...[kind, data]) {
    if (kind === 'A') {
        data.toFixed();
    }
    if (kind === 'B') {
        data.toUpperCase();
    }
}
function unrefined1(ab) {
    const { variant, value } = ab;
    if (variant === 'a') {
        printValue(value);
    } else {
        printValueList(value);
    }
}
const reducerBroken = (state, { type, payload })=>{
    switch(type){
        case 'add':
            return state + payload.toAdd;
        case 'remove':
            return state - payload.toRemove;
    }
};
const { value, done } = it.next();
if (!done) {
    value; // number
}
f50((kind, data)=>{
    if (kind === 'A') {
        data.toFixed();
    }
    if (kind === 'B') {
        data.toUpperCase();
    }
});
const f51 = (kind, payload)=>{
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
};
const f52 = (kind, payload)=>{
    if (kind === 'A') {
        payload.toFixed();
    } else {
        payload; // undefined
    }
};
readFile('hello', (err, data)=>{
    if (err === null) {
        data.length;
    } else {
        err.message;
    }
});
const reducer = (op, args)=>{
    switch(op){
        case "add":
            console.log(args.a + args.b);
            break;
        case "concat":
            console.log(args.firstArr.concat(args.secondArr));
            break;
    }
};
reducer("add", {
    a: 1,
    b: 3
});
reducer("concat", {
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
        if (type == 'num') {
            cb(123);
        } else {
            cb("abc");
        }
    }
};
let fooAsyncM = {
    method (type, cb) {
        return _async_to_generator(function*() {
            if (type == 'num') {
                cb(123);
            } else {
                cb("abc");
            }
        })();
    }
};
let fooGenM = {
    *method (type, cb) {
        if (type == 'num') {
            cb(123);
        } else {
            cb("abc");
        }
    }
};
let fooAsyncGenM = {
    method (type, cb) {
        return _wrap_async_generator(function*() {
            if (type == 'num') {
                cb(123);
            } else {
                cb("abc");
            }
        })();
    }
};
const f60 = (kind, payload)=>{
    if (kind === "a") {
        payload.toFixed(); // error
    }
    if (kind === "b") {
        payload.toUpperCase(); // error
    }
};
// Repro from #48902
function foo({ value1, test1 = value1.test1, test2 = value1.test2, test3 = value1.test3, test4 = value1.test4, test5 = value1.test5, test6 = value1.test6, test7 = value1.test7, test8 = value1.test8, test9 = value1.test9 }) {}
// Repro from #49772
function fa1(x) {
    const [guard, value] = x;
    if (guard) {
        for(;;){
            value; // number
        }
    } else {
        while(!!true){
            value; // string
        }
    }
}
function fa2(x) {
    const { guard, value } = x;
    if (guard) {
        for(;;){
            value; // number
        }
    } else {
        while(!!true){
            value; // string
        }
    }
}
const fa3 = (guard, value)=>{
    if (guard) {
        for(;;){
            value; // number
        }
    } else {
        while(!!true){
            value; // string
        }
    }
};
const bot = new Client();
bot.on("shardDisconnect", (event, shard)=>console.log(`Shard ${shard} disconnected (${event.code},${event.wasClean}): ${event.reason}`));
bot.on("shardDisconnect", (event)=>console.log(`${event.code} ${event.wasClean} ${event.reason}`));
// Destructuring tuple types with different arities
function fz1([x, y]) {
    if (y === 2) {
        x; // 1
    }
    if (y === 4) {
        x; // 3
    }
    if (y === undefined) {
        x; // 5
    }
    if (x === 1) {
        y; // 2
    }
    if (x === 3) {
        y; // 4
    }
    if (x === 5) {
        y; // undefined
    }
}
// Repro from #55661
function tooNarrow([x, y]) {
    if (y === undefined) {
        const shouldNotBeOk = x; // Error
    }
}
// https://github.com/microsoft/TypeScript/issues/56312
function parameterReassigned1([x, y]) {
    if (Math.random()) {
        x = 1;
    }
    if (y === 2) {
        x; // 1 | 3
    }
}
function parameterReassigned2([x, y]) {
    if (Math.random()) {
        y = 2;
    }
    if (y === 2) {
        x; // 1 | 3
    }
}
// https://github.com/microsoft/TypeScript/pull/56313#discussion_r1416482490
const parameterReassignedContextualRest1 = (x, y)=>{
    if (Math.random()) {
        y = 2;
    }
    if (y === 2) {
        x; // 1 | 3
    }
};
