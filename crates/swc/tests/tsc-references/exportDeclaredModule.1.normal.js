//// [foo1.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[6:1]
//!  3 |     export var a: string; 
//!  4 |     export function b(): number;
//!  5 | }
//!  6 | export = M1;
//!    : ^^^^^^^^^^^^
//!  7 | 
//!    `----
//// [foo2.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo1 = require('./foo1');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | var x: number = foo1.b();
//!    `----
