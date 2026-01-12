//// [importEqualsDeclaration.ts]
//// [/a.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | class A { a!: string }
//!  2 | export = A;
//!    : ^^^^^^^^^^^
//!  3 | 
//!    `----
//// [/b.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[2:1]
//!  1 | class SomeClass {}
//!  2 | export = SomeClass;
//!    : ^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!    `----
//// [/c.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[2:1]
//!  1 | import type A = require('./a'); // Ok
//!  2 | import type = require('./b');   // Ok
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  3 | 
//!  4 | A.prototype; // Error
//!  5 | const a: A = { a: 'a' }; // Ok
//!    `----
