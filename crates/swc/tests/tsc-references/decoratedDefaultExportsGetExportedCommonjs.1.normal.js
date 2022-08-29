//// [a.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>Foo
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var decorator;
let Foo = class Foo {
};
Foo = _tsDecorate([
    decorator
], Foo);
//// [b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_class
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var decorator;
let _class = class _class {
};
_class = _tsDecorate([
    decorator
], _class);
