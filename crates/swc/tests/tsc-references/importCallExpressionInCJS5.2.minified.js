//// [importCallExpressionInCJS5.ts]
"use strict";
//// [0.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    B: ()=>B,
    foo: ()=>foo
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
function backup() {
    return "backup";
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "backup", {
    enumerable: !0,
    get: ()=>backup
});
//// [2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "D", {
    enumerable: !0,
    get: ()=>D
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
class D {
    myModule = Promise.resolve().then(()=>_interopRequireWildcard(require("./0")));
    method() {
        Promise.resolve().then(()=>_interopRequireWildcard(require("./0"))), this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, async (err)=>{
            console.log(err);
            let one = await Promise.resolve().then(()=>_interopRequireWildcard(require("./1")));
            console.log(one.backup());
        });
    }
}
