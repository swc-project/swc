// @Filename: foo1.ts
//!
//!  x multiple `export =` found
//!   ,-[4:1]
//! 4 | export = x;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 5 | export = y;
//!   : ^^^^^^^^^^^
//!   `----
// @Filename: foo2.ts
//!
//!  x multiple `export =` found
//!   ,-[4:1]
//! 4 | export = x;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 5 | export = y;
//!   : ^^^^^^^^^^^
//!   `----
// @Filename: foo3.ts
//!
//!  x multiple `export =` found
//!   ,-[8:1]
//! 8 | export = x;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 9 | export = y;
//!   : ^^^^^^^^^^^
//!   `----
// @Filename: foo4.ts
//!
//!  x multiple `export =` found
//!   ,-[2:1]
//! 2 | export = x;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 3 | function x(){
//! 4 | 	return 42;
//! 5 | }
//! 6 | function y(){
//! 7 | 	return 42;
//! 8 | }
//! 9 | export = y;
//!   : ^^^^^^^^^^^
//!   `----
// @Filename: foo5.ts
//!
//!  x multiple `export =` found
//!   ,-[5:1]
//! 5 | export = x;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 6 | export = y;
//!   : ^^^^^^^^^^^
//!   `----
//!
//!  x multiple `export =` found
//!   ,-[6:1]
//! 6 | export = y;
//!   : ^^^^^|^^^^^
//!   :      `-- previous `export =` declared here
//! 7 | export = z;
//!   : ^^^^^^^^^^^
//!   `----
