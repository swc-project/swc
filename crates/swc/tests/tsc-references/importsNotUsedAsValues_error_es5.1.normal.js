// @importsNotUsedAsValues: error
// @noUnusedLocals: true
// @Filename: /a.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
// @Filename: /b.ts
var a;
var b;
console.log(a, b);
export { };
// @Filename: /c.ts
var a;
var b;
console.log(a, b);
export { };
// @Filename: /d.ts
import { A } from "./a";
var a = A;
var b;
console.log(a, b);
// @Filename: /e.ts
export { }; // noUnusedLocals error only
// @Filename: /f.ts
import { C } from "./a";
C.One;
var c = C.Two;
var d = C.Two;
console.log(c, d);
// @Filename: /g.ts
var c;
var d;
console.log(c, d);
export { };
// @Filename: /h.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var H = function H() {
    "use strict";
    _class_call_check(this, H);
};
module.exports = H;
export { };
// @Filename: /i.ts
var H = require("./h"); // Error
var h = {};
console.log(h);
export { };
// @Filename: /j.ts
var H = require("./h"); // noUnusedLocals error only
export { };
// @Filename: /k.ts
var K;
(function(K) {
    K[K["One"] = 0] = "One";
    K[K["Two"] = 1] = "Two";
})(K || (K = {}));
module.exports = K;
export { };
// @Filename: /l.ts
var K = require("./k");
K.One;
export { };
// @Filename: /j.ts
// Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
