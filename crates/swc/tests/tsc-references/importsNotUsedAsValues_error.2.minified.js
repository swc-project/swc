//// [importsNotUsedAsValues_error.ts]
//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _default = function _default() {
    "use strict";
    _class_call_check(this, _default);
};
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var C;
!function(C) {
    C[C.One = 0] = "One", C[C.Two = 1] = "Two";
}(C || (C = {}));
export { _default as default };
//// [/b.ts]
console.log(void 0, void 0);
export { };
//// [/c.ts]
console.log(void 0, void 0);
export { };
//// [/d.ts]
import { A } from "./a";
console.log(A, void 0);
//// [/e.ts]
export { };
//// [/f.ts]
import { C } from "./a";
C.One, console.log(C.Two, C.Two);
//// [/g.ts]
console.log(void 0, void 0);
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
