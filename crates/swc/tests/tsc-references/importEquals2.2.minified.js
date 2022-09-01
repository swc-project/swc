//// [importEquals2.ts]
//// [/a.ts]
export { };
//// [/b.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  2 | export = a;
//!    : ^^^^^^^^^^^
//!    `----
//// [/c.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import a = require('./b');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
