//// [override1.ts]
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!     ,-[13:1]
//!  13 | 
//!  14 | class C {
//!  15 |     override foo(v: string) {}
//!     :     ^^^^^^^^
//!  16 | }
//!     `----
//! 
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!     ,-[40:1]
//!  40 | function ff () {
//!  41 |     return class {
//!  42 |         override foo () {}
//!     :         ^^^^^^^^
//!  43 |     }
//!  44 | }
//!     `----
