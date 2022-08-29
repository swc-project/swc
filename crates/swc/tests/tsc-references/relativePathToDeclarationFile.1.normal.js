//// [test/foo.d.ts]
export { };
//// [test/other.d.ts]
export { };
//// [test/sub/relMod.d.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  4 | export = Test;
//!    : ^^^^^^^^^^^^^^
//!    `----
//// [test/file1.ts]
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  1 | import foo = require('foo');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  2 | import other = require('./other');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,----
//!  3 | import relMod = require('./sub/relMod');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!    `----
