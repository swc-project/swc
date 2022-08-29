//// [a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>Foo
});
class Foo {
}
//// [b.ts]
"use strict";
function foo() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>foo
});
