//@jsx: preserve
//@filename: file1.tsx
//!
//!  x Unexpected token `div`. Expected jsx identifier
//!   ,----
//! 4 | <div></div>
//!   :  ^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
//@filename: file2.tsx
//!
//!  x Unexpected token `div`. Expected jsx identifier
//!   ,----
//! 2 | var x = <div></div><div></div>
//!   :          ^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
