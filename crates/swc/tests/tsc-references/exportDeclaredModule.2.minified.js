//// [foo1.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  6 | export = M1;
//!    : ^^^^^^^^^^^^
//!    `----
//// [foo2.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import foo1 = require('./foo1');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
