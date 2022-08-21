//!
//!  x `await` cannot be used as an identifier in an async context
//!   ,----
//! 4 | declare namespace foo { const await: any; }
//!   :                               ^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
