import * as swcHelpers from "@swc/helpers";
// @target: esnext
// @lib: esnext
// @declaration: false
// @useDefineForClassFields: false
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
function asyncFuncReturnConstCall() {
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function _asyncFuncReturnConstCall() {
    _asyncFuncReturnConstCall = // async function return inference
    swcHelpers.asyncToGenerator(function*() {
        return constCall;
    });
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function asyncFuncReturnLetCall() {
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function _asyncFuncReturnLetCall() {
    _asyncFuncReturnLetCall = swcHelpers.asyncToGenerator(function*() {
        return letCall;
    });
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function asyncFuncReturnVarCall() {
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function _asyncFuncReturnVarCall() {
    _asyncFuncReturnVarCall = swcHelpers.asyncToGenerator(function*() {
        return varCall;
    });
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function asyncGenFuncYieldConstCall() {
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function _asyncGenFuncYieldConstCall() {
    _asyncGenFuncYieldConstCall = // async generator function yield inference
    swcHelpers.wrapAsyncGenerator(function*() {
        yield constCall;
    });
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function asyncGenFuncYieldLetCall() {
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function _asyncGenFuncYieldLetCall() {
    _asyncGenFuncYieldLetCall = swcHelpers.wrapAsyncGenerator(function*() {
        yield letCall;
    });
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function asyncGenFuncYieldVarCall() {
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
function _asyncGenFuncYieldVarCall() {
    _asyncGenFuncYieldVarCall = swcHelpers.wrapAsyncGenerator(function*() {
        yield varCall;
    });
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
// classes
class C {
    constructor(){
        this.readonlyCall = Symbol();
        this.readwriteCall = Symbol();
    }
}
C.readonlyStaticCall = Symbol();
C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
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
    method2 () {
        return swcHelpers.asyncToGenerator(function*() {
            return s;
        })();
    },
    method3 () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            yield s;
        })();
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
    method1() {
        return s;
    }
    method2() {
        return swcHelpers.asyncToGenerator(function*() {
            return s;
        })();
    }
    method3() {
        return swcHelpers.wrapAsyncGenerator(function*() {
            yield s;
        })();
    }
    *method4() {
        yield s;
    }
    method5(p = s) {
        return p;
    }
    constructor(){
        this.a = s;
        this.b = N.s;
        this.c = N["s"];
        this.d = s;
        this.e = N.s;
        this.f = N["s"];
    }
}
C0.a = s;
C0.b = N.s;
C0.c = N["s"];
C0.d = s;
C0.e = N.s;
C0.f = N["s"];
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
var _key, _key1, _key2, _key3;
class C1 {
}
_key = s;
_key1 = N.s;
_key2 = s;
_key3 = N.s;
const o3 = {
    method1 () {
        return s; // return type should not widen due to contextual type
    },
    method2 () {
        return swcHelpers.asyncToGenerator(function*() {
            return s; // return type should not widen due to contextual type
        })();
    },
    method3 () {
        return swcHelpers.wrapAsyncGenerator(function*() {
            yield s; // yield type should not widen due to contextual type
        })();
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
