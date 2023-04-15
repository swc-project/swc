//// [importCallExpressionInCJS5.ts]
"use strict";
//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
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
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "backup", {
    enumerable: true,
    get: function() {
        return backup;
    }
});
function backup() {
    return "backup";
}
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "D", {
    enumerable: true,
    get: function() {
        return D;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
class C {
    method() {
        const loadAsync = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
        this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, async (err)=>{
            console.log(err);
            let one = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./1")));
            console.log(one.backup());
        });
    }
    constructor(){
        this.myModule = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
    }
}
class D {
    method() {
        const loadAsync = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
        this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, async (err)=>{
            console.log(err);
            let one = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./1")));
            console.log(one.backup());
        });
    }
    constructor(){
        this.myModule = Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./0")));
    }
}
