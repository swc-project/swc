//// [foo1.ts]
//!   x multiple `export =` found
//!    ,-[3:1]
//!  1 | var x = 10;
//!  2 | var y = 20;
//!  3 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  4 | export = y;
//!    : ^^^^^^^^^^^
//!  5 | 
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[3:1]
//!  1 | var x = 10;
//!  2 | var y = 20;
//!  3 | export = x;
//!    : ^^^^^^^^^^^
//!  4 | export = y;
//!  5 | 
//!    `----
//// [foo2.ts]
//!   x multiple `export =` found
//!    ,-[3:1]
//!  1 | var x = 10;
//!  2 | class y {};
//!  3 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  4 | export = y;
//!    : ^^^^^^^^^^^
//!  5 | 
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[3:1]
//!  1 | var x = 10;
//!  2 | class y {};
//!  3 | export = x;
//!    : ^^^^^^^^^^^
//!  4 | export = y;
//!  5 | 
//!    `----
//// [foo3.ts]
//!   x multiple `export =` found
//!    ,-[7:1]
//!  4 | class y {
//!  5 |     y: number;
//!  6 | }
//!  7 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  8 | export = y;
//!    : ^^^^^^^^^^^
//!  9 | 
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[7:1]
//!  4 | class y {
//!  5 |     y: number;
//!  6 | }
//!  7 | export = x;
//!    : ^^^^^^^^^^^
//!  8 | export = y;
//!  9 | 
//!    `----
//// [foo4.ts]
//!   x multiple `export =` found
//!    ,-[1:1]
//!  1 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  2 | function x(){
//!  3 |     return 42;
//!  4 | }
//!  5 | function y(){
//!  6 |     return 42;
//!  7 | }
//!  8 | export = y;
//!    : ^^^^^^^^^^^
//!  9 | 
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[1:1]
//!  1 | export = x;
//!    : ^^^^^^^^^^^
//!  2 | function x(){
//!  3 |     return 42;
//!  4 | }
//!    `----
//// [foo5.ts]
//!   x multiple `export =` found
//!    ,-[4:1]
//!  1 | var x = 5;
//!  2 | var y = "test";
//!  3 | var z = {};
//!  4 | export = x;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  5 | export = y;
//!    : ^^^^^^^^^^^
//!  6 | export = z;
//!    `----
//!   x multiple `export =` found
//!    ,-[5:1]
//!  2 | var y = "test";
//!  3 | var z = {};
//!  4 | export = x;
//!  5 | export = y;
//!    : ^^^^^|^^^^^
//!    :      `-- previous `export =` declared here
//!  6 | export = z;
//!    : ^^^^^^^^^^^
//!    `----
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[4:1]
//!  1 | var x = 5;
//!  2 | var y = "test";
//!  3 | var z = {};
//!  4 | export = x;
//!    : ^^^^^^^^^^^
//!  5 | export = y;
//!  6 | export = z;
//!    `----
