//// [/foo.ts]
//!   x Expression expected
//!     ,-[8:1]
//!   5 |     };
//!   6 | }
//!   7 | 
//!   8 | @meta('a', 'x')
//!     : ^
//!   9 | class C {
//!  10 |     @meta('b', 'y')
//!  11 |     m() { }
//!     `----
