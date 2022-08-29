//// [importsNotUsedAsValues_error.ts]
//// [/a.ts]
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
import { A } from "./a";
var a = A;
var b;
console.log(a, b);
//// [/e.ts]
export { }; // noUnusedLocals error only
//// [/f.ts]
import { C } from "./a";
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
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = H;
//!    : ^^^^^^^^^^^
//!    `----
//// [/i.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import H = require('./h'); // Error
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [/j.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import H = require('./h'); // noUnusedLocals error only
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [/k.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = K;
//!    : ^^^^^^^^^^^
//!    `----
//// [/l.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import K = require('./k');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//// [/j.ts]
// Sad face https://github.com/microsoft/TypeScript/blob/6b04f5039429b9d412696fe2febe39ecc69ad365/src/testRunner/compilerRunner.ts#L207
