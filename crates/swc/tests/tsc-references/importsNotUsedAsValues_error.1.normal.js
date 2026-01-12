//// [importsNotUsedAsValues_error.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _default = function _default() {
    "use strict";
    _class_call_check(this, _default);
};
export { _default as default };
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
//// [/b.ts]
var a;
var b;
console.log(a, b);
export { };
//// [/c.ts]
var a;
var b;
console.log(a, b);
export { };
//// [/d.ts]
import { A } from './a';
var a = A;
var b;
console.log(a, b);
//// [/e.ts]
export { };
 // noUnusedLocals error only
//// [/f.ts]
import { C } from './a';
C.One;
var c = C.Two;
var d = C.Two;
console.log(c, d);
//// [/g.ts]
var c;
var d;
console.log(c, d);
export { };
//// [/h.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var H = function H() {
    "use strict";
    _class_call_check(this, H);
};
export { };
//// [/i.ts]
var h = {};
console.log(h);
export { };
//// [/j.ts]
export { };
 // noUnusedLocals error only
//// [/k.ts]
export { };
//// [/l.ts]
K.One;
export { };
//// [/j.ts]
// Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
