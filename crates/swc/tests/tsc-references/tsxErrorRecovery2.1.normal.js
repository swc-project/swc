//// [tsxErrorRecovery2.tsx]
//// [file1.tsx]
//!   x Expression expected
//!    ,-[4:1]
//!  1 | declare namespace JSX { interface Element { } }
//!  2 | 
//!  3 | <div></div>
//!  4 | <div></div>
//!    :      ^
//!  5 | 
//!    `----
//!   x Unterminated regexp literal
//!    ,-[4:1]
//!  1 | declare namespace JSX { interface Element { } }
//!  2 | 
//!  3 | <div></div>
//!  4 | <div></div>
//!    :       ^^^^^
//!  5 | 
//!    `----
//!   x Expression expected
//!    ,-[4:1]
//!  1 | declare namespace JSX { interface Element { } }
//!  2 | 
//!  3 | <div></div>
//!  4 | <div></div>
//!    :       ^^^^^
//!  5 | 
//!    `----
//// [file2.tsx]
//!   x Expression expected
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :                         ^
//!    `----
//!   x Unterminated regexp literal
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :                          ^^^^^
//!    `----
//!   x Expression expected
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :                          ^^^^^
//!    `----
