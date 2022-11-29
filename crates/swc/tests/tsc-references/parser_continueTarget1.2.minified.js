//// [parser_continueTarget1.ts]
//! 
//!   x A 'continue' statement can only jump to a label of an enclosing iteration statement
//!    ,-[1:1]
//!  1 | target:
//!  2 |   continue target;
//!    :   ^^^^^^^^^^^^^^^^
//!    `----
