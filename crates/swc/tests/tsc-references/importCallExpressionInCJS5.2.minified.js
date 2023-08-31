//// [importCallExpressionInCJS5.ts]
//// [0.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    B: function() {
        return B;
    },
    foo: function() {
        return foo;
    }
});
class B {
    print() {
        return "I am B";
    }
}
function foo() {
    return "foo";
}
//// [1.ts]
function backup() {
    return "backup";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "backup", {
    enumerable: !0,
    get: function() {
        return backup;
    }
});
//// [2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "D", {
    enumerable: !0,
    get: function() {
        return D;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
class D {
    method() {
        Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0"))), this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, async (err)=>{
            console.log(err), console.log((await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./1")))).backup());
        });
    }
    constructor(){
        this.myModule = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
    }
}
