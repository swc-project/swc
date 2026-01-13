//// [foo1.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo2 = require('./foo2');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | export module M1 {
//!  3 |     export class C1 {
//!  4 |         m1: foo2.M1.C1;
//!    `----
//// [foo2.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[1:1]
//!  1 | import foo1 = require('./foo1');
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  2 | export module M1 {
//!  3 |     export class C1 {
//!  4 |         m1: foo1.M1.C1;
//!    `----
