//// [parserNotRegex1.ts]
//! 
//!   x Return statement is not allowed here
//!    ,-[1:1]
//!  1 |   if (a.indexOf(-(4/3)))      // We should not get a regex here because of the / in the comment.
//!  2 |   {
//!  3 |     return true;
//!    :     ^^^^^^^^^^^^
//!  4 |   }
//!    `----
