//// [uniqueSymbolsDeclarations.ts]
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();
const constTypeAndCall = Symbol(), constInitToConstCall = constCall, constInitToLetCall = letCall, constInitToVarCall = varCall, constInitToConstDeclAmbient = constType;
let letInitToConstCall = constCall, letInitToLetCall = letCall, letInitToVarCall = varCall, letInitToConstDeclAmbient = constType;
var varInitToConstCall = constCall, varInitToLetCall = letCall, varInitToVarCall = varCall, varInitToConstDeclAmbient = constType;
const constInitToConstCallWithTypeQuery = constCall, constInitToConstDeclAmbientWithTypeQuery = constType;
function funcReturnConstCall() {
    return constCall;
}
function funcReturnLetCall() {
    return letCall;
}
function funcReturnVarCall() {
    return varCall;
}
function funcReturnConstCallWithTypeQuery() {
    return constCall;
}
function* genFuncYieldConstCall() {
    yield constCall;
}
function* genFuncYieldLetCall() {
    yield letCall;
}
function* genFuncYieldVarCall() {
    yield varCall;
}
function* genFuncYieldConstCallWithTypeQuery() {
    yield constCall;
}
async function asyncFuncReturnConstCall() {
    return constCall;
}
async function asyncFuncReturnLetCall() {
    return letCall;
}
async function asyncFuncReturnVarCall() {
    return varCall;
}
async function* asyncGenFuncYieldConstCall() {
    yield constCall;
}
async function* asyncGenFuncYieldLetCall() {
    yield letCall;
}
async function* asyncGenFuncYieldVarCall() {
    yield varCall;
}
class C {
    static readonlyStaticCall = Symbol();
    static readonlyStaticTypeAndCall = Symbol();
    static readwriteStaticCall = Symbol();
    readonlyCall = Symbol();
    readwriteCall = Symbol();
}
const constInitToCReadonlyStaticCall = C.readonlyStaticCall, constInitToCReadonlyStaticType = C.readonlyStaticType, constInitToCReadonlyStaticTypeAndCall = C.readonlyStaticTypeAndCall, constInitToCReadwriteStaticCall = C.readwriteStaticCall, constInitToCReadonlyStaticCallWithTypeQuery = C.readonlyStaticCall, constInitToCReadonlyStaticTypeWithTypeQuery = C.readonlyStaticType, constInitToCReadonlyStaticTypeAndCallWithTypeQuery = C.readonlyStaticTypeAndCall, constInitToCReadwriteStaticCallWithTypeQuery = C.readwriteStaticCall, constInitToCReadonlyCall = c.readonlyCall, constInitToCReadwriteCall = c.readwriteCall, constInitToCReadonlyCallWithTypeQuery = c.readonlyCall, constInitToCReadwriteCallWithTypeQuery = c.readwriteCall, constInitToCReadonlyCallWithIndexedAccess = c.readonlyCall, constInitToCReadwriteCallWithIndexedAccess = c.readwriteCall, constInitToIReadonlyType = i.readonlyType, constInitToIReadonlyTypeWithTypeQuery = i.readonlyType, constInitToIReadonlyTypeWithIndexedAccess = i.readonlyType, constInitToLReadonlyType = l.readonlyType, constInitToLReadonlyNestedType = l.nested.readonlyNestedType, constInitToLReadonlyTypeWithTypeQuery = l.readonlyType, constInitToLReadonlyNestedTypeWithTypeQuery = l.nested.readonlyNestedType, constInitToLReadonlyTypeWithIndexedAccess = l.readonlyType, constInitToLReadonlyNestedTypeWithIndexedAccess = l.nested.readonlyNestedType, promiseForConstCall = Promise.resolve(constCall), arrayOfConstCall = [
    constCall
];
f(s), f(N.s), f(N.s), N.s, N.s;
const o2 = {
    a: s,
    b: N.s,
    c: N.s,
    method1: ()=>s,
    method2: async ()=>s,
    async *method3 () {
        yield s;
    },
    *method4 () {
        yield s;
    },
    method5: (p = s)=>p
};
class C0 {
    static a = s;
    static b = N.s;
    static c = N.s;
    static d = s;
    static e = N.s;
    static f = N.s;
    a = s;
    b = N.s;
    c = N.s;
    d = s;
    e = N.s;
    f = N.s;
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
o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), N.s, N.s, 2 * Math.random() && N.s, 2 * Math.random() && N.s, N.s;
class C1 {
}
const o4 = {
    method1: ()=>s,
    method2: async ()=>s,
    async *method3 () {
        yield s;
    },
    *method4 () {
        yield s;
    },
    method5: (p = s)=>p
};
