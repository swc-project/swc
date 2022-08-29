//// [readonlyReadonly.ts]
//! 
//!   x 'readonly' modifier already seen.
//!    ,----
//!  2 | readonly readonly x: number;
//!    :          ^^^^^^^^
//!    `----
//! 
//!   x A parameter property is only allowed in a constructor implementation
//!    ,----
//!  3 | constructor(readonly readonly y: number) {}
//!    :                      ^^^^^^^^^^^^^^^^^^
//!    `----
