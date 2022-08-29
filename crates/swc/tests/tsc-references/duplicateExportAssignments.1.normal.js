//// [foo1.ts]
//! 
//!   x multiple `export =` found
//!    ,-[3:1]
//!  3 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  4 | export = y;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  3 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [foo2.ts]
//! 
//!   x multiple `export =` found
//!    ,-[3:1]
//!  3 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  4 | export = y;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  3 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [foo3.ts]
//! 
//!   x multiple `export =` found
//!    ,-[7:1]
//!  7 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  8 | export = y;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  7 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [foo4.ts]
//! 
//!   x multiple `export =` found
//!    ,-[1:1]
//!  1 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  2 | function x(){
//!  3 | 	return 42;
//!  4 | }
//!  5 | function y(){
//!  6 | 	return 42;
//!  7 | }
//!  8 | export = y;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  1 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
//// [foo5.ts]
//! 
//!   x multiple `export =` found
//!    ,-[4:1]
//!  4 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  5 | export = y;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x multiple `export =` found
//!    ,-[5:1]
//!  5 | export = y;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  6 | export = z;
//!    : ^^^^^^^^^^^
//!    `----
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  4 | export = x;
//!    : ^^^^^^^^^^^
//!    `----
