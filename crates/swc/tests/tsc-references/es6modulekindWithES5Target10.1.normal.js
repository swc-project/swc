//// [es6modulekindWithES5Target10.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  2 | import i = require("mod"); // Error;
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  7 | export = N; // Error
//!    : ^^^^^^^^^^^
//!    `----
