//// [importEquals2.ts]
//// [/a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export { };
//// [/b.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | import * as a from './a';
//!  2 | export = a;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [/c.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import a = require('./b');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | new a.A(); // Error
//!    `----
