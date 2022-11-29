//// [readonlyReadonly.ts]
//! 
//!   x 'readonly' modifier already seen.
//!    ,-[1:1]
//!  1 | class C {
//!  2 |     readonly readonly x: number;
//!    :              ^^^^^^^^
//!  3 |     constructor(readonly readonly y: number) {}
//!  4 | }
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,-[1:1]
//!  1 | class C {
//!  2 |     readonly readonly x: number;
//!  3 |     constructor(readonly readonly y: number) {}
//!    :                          ^^^^^^^^^^^^^^^^^^
//!  4 | }
//!    `----
