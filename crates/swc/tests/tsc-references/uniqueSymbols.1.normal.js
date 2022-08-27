//// [uniqueSymbols.ts]
// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();
// declaration with type and call initializer
const constTypeAndCall = Symbol();
// declaration from initializer
const constInitToConstCall = constCall;
const constInitToLetCall = letCall;
const constInitToVarCall = varCall;
const constInitToConstDeclAmbient = constType;
let letInitToConstCall = constCall;
let letInitToLetCall = letCall;
let letInitToVarCall = varCall;
let letInitToConstDeclAmbient = constType;
var varInitToConstCall = constCall;
var varInitToLetCall = letCall;
var varInitToVarCall = varCall;
var varInitToConstDeclAmbient = constType;
// declaration from initializer with type query
const constInitToConstCallWithTypeQuery = constCall;
const constInitToConstDeclAmbientWithTypeQuery = constType;
// assignment from any
// https://github.com/Microsoft/TypeScript/issues/29108
const fromAny = {};
// function return inference
function funcReturnConstCall() {
    return constCall;
}
function funcReturnLetCall() {
    return letCall;
}
function funcReturnVarCall() {
    return varCall;
}
// function return value with type query
function funcReturnConstCallWithTypeQuery() {
    return constCall;
}
// generator function yield inference
function* genFuncYieldConstCall() {
    yield constCall;
}
function* genFuncYieldLetCall() {
    yield letCall;
}
function* genFuncYieldVarCall() {
    yield varCall;
}
// generator function yield with return type query
function* genFuncYieldConstCallWithTypeQuery() {
    yield constCall;
}
// async function return inference
async function asyncFuncReturnConstCall() {
    return constCall;
}
async function asyncFuncReturnLetCall() {
    return letCall;
}
async function asyncFuncReturnVarCall() {
    return varCall;
}
// async generator function yield inference
async function* asyncGenFuncYieldConstCall() {
    yield constCall;
}
async function* asyncGenFuncYieldLetCall() {
    yield letCall;
}
async function* asyncGenFuncYieldVarCall() {
    yield varCall;
}
// classes
class C {
    static readonlyStaticCall = Symbol();
    static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    readonlyCall = Symbol();
    readwriteCall = Symbol();
}
const constInitToCReadonlyStaticCall = C.readonlyStaticCall;
const constInitToCReadonlyStaticType = C.readonlyStaticType;
const constInitToCReadonlyStaticTypeAndCall = C.readonlyStaticTypeAndCall;
const constInitToCReadwriteStaticCall = C.readwriteStaticCall;
const constInitToCReadonlyStaticCallWithTypeQuery = C.readonlyStaticCall;
const constInitToCReadonlyStaticTypeWithTypeQuery = C.readonlyStaticType;
const constInitToCReadonlyStaticTypeAndCallWithTypeQuery = C.readonlyStaticTypeAndCall;
const constInitToCReadwriteStaticCallWithTypeQuery = C.readwriteStaticCall;
const constInitToCReadonlyCall = c.readonlyCall;
const constInitToCReadwriteCall = c.readwriteCall;
const constInitToCReadonlyCallWithTypeQuery = c.readonlyCall;
const constInitToCReadwriteCallWithTypeQuery = c.readwriteCall;
const constInitToCReadonlyCallWithIndexedAccess = c.readonlyCall;
const constInitToCReadwriteCallWithIndexedAccess = c.readwriteCall;
const constInitToIReadonlyType = i.readonlyType;
const constInitToIReadonlyTypeWithTypeQuery = i.readonlyType;
const constInitToIReadonlyTypeWithIndexedAccess = i.readonlyType;
const constInitToLReadonlyType = l.readonlyType;
const constInitToLReadonlyNestedType = l.nested.readonlyNestedType;
const constInitToLReadonlyTypeWithTypeQuery = l.readonlyType;
const constInitToLReadonlyNestedTypeWithTypeQuery = l.nested.readonlyNestedType;
const constInitToLReadonlyTypeWithIndexedAccess = l.readonlyType;
const constInitToLReadonlyNestedTypeWithIndexedAccess = l.nested.readonlyNestedType;
// type argument inference
const promiseForConstCall = Promise.resolve(constCall);
const arrayOfConstCall = [
    constCall
];
// widening positions
// argument inference
f(s);
f(N.s);
f(N["s"]);
// array literal elements
[
    s
];
[
    N.s
];
[
    N["s"]
];
// property assignments/methods
const o2 = {
    a: s,
    b: N.s,
    c: N["s"],
    method1 () {
        return s;
    },
    async method2 () {
        return s;
    },
    async *method3 () {
        yield s;
    },
    *method4 () {
        yield s;
    },
    method5 (p = s) {
        return p;
    }
};
// property initializers
class C0 {
    static a = s;
    static b = N.s;
    static c = N["s"];
    static d = s;
    static e = N.s;
    static f = N["s"];
    a = s;
    b = N.s;
    c = N["s"];
    d = s;
    e = N.s;
    f = N["s"];
    method1() {
        return s;
    }
    async method2() {
        return s;
    }
    async *method3() {
        yield s;
    }
    *method4() {
        yield s;
    }
    method5(p = s) {
        return p;
    }
}
// non-widening positions
// element access
o[s];
o[N.s];
o[N["s"]];
// arguments (no-inference)
f(s);
f(N.s);
f(N["s"]);
g(s);
g(N.s);
g(N["s"]);
// falsy expressions
s || "";
N.s || "";
N["s"] || "";
// conditionals
Math.random() * 2 ? s : "a";
Math.random() * 2 ? N.s : "a";
Math.random() * 2 ? N["s"] : "a";
// computed property names
({
    [s]: "a",
    [N.s]: "b"
});
class C1 {
}
const o3 = {
    method1 () {
        return s; // return type should not widen due to contextual type
    },
    async method2 () {
        return s; // return type should not widen due to contextual type
    },
    async *method3 () {
        yield s; // yield type should not widen due to contextual type
    },
    *method4 () {
        yield s; // yield type should not widen due to contextual type
    },
    method5 (p = s) {
        return p;
    }
};
// allowed when not emitting declarations
const o4 = {
    method1 (p) {
        return p;
    },
    method2 (p) {
        return p;
    }
};
const ce0 = class {
    method1(p) {
        return p;
    }
    method2(p) {
        return p;
    }
};
function funcInferredReturnType(obj) {
    return obj;
}
