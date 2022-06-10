import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _default = function _default() {
    "use strict";
    _class_call_check(this, _default);
};
export { _default as default };
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var C;
(function(C) {
    C[C["One"] = 0] = "One";
    C[C["Two"] = 1] = "Two";
})(C || (C = {}));
var a;
var b;
console.log(a, b);
var a;
var b;
console.log(a, b);
var a = A;
var b;
console.log(a, b);
0;
var c = 1;
var d = 1;
console.log(c, d);
var c;
var d;
console.log(c, d);
// @Filename: /h.ts
var H = function H() {
    "use strict";
    _class_call_check(this, H);
};
module.exports = H;
// @Filename: /i.ts
var H = require("./h"); // Error
var h = {};
console.log(h);
// @Filename: /j.ts
var H = require("./h"); // noUnusedLocals error only
var // @Filename: /k.ts
K;
(function(K) {
    K[K["One"] = 0] = "One";
    K[K["Two"] = 1] = "Two";
})(K || (K = {}));
module.exports = K;
// @Filename: /l.ts
var K = require("./k");
0; // @Filename: /j.ts
 // Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
