//// [foo1.ts]
export function x() {
    return true;
}
//// [foo2.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo1 = require('./foo1');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | var x = foo1.x;
//!  3 | export = x;
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[3:1]
//!  1 | import foo1 = require('./foo1');
//!  2 | var x = foo1.x;
//!  3 | export = x;
//!    : ^^^^^^^^^^^
//!  4 | 
//!    `----
//// [foo3.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo2 = require('./foo2');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | var x = foo2(); // should be boolean
//!    `----
