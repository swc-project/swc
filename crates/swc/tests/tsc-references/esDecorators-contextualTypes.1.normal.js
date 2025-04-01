//// [esDecorators-contextualTypes.ts]
//!   x Expression expected
//!    ,-[2:1]
//!  1 | 
//!  2 | @((t, c) => { })
//!    : ^
//!  3 | class C {
//!  4 |     @((t, c) => { })
//!  5 |     static f() {}
//!    `----
