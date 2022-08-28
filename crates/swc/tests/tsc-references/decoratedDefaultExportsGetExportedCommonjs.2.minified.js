//// [a.ts]
"use strict";
var decorator;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>Foo
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
let Foo = class {
};
Foo = _tsDecorate([
    decorator
], Foo);
//// [b.ts]
"use strict";
var decorator;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>_class
});
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
let _class = class {
};
_class = _tsDecorate([
    decorator
], _class);
