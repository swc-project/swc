//// [override1.ts]
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!     ,-[15:1]
//!  12 | }
//!  13 | 
//!  14 | class C {
//!  15 |     override foo(v: string) {}
//!     :     ^^^^^^^^
//!  16 | }
//!  17 | 
//!  18 | function f () {
//!     `----
//!   x This member cannot have an 'override' modifier because its containing class does not extend another class.
//!     ,-[42:1]
//!  39 | 
//!  40 | function ff () {
//!  41 |     return class {
//!  42 |         override foo () {}
//!     :         ^^^^^^^^
//!  43 |     }
//!  44 | }
//!     `----
