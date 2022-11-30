//// [parserStatementIsNotAMemberVariableDeclaration1.ts]
//! 
//!   x Return statement is not allowed here
//!    ,-[1:1]
//!  1 | ,-> return {
//!  2 | |   
//!  3 | `->   "set": function (key, value) {
//!  4 |     
//!  5 |         // 'private' should not be considered a member variable here.
//!  6 |         private[key] = value;
//!    `----
//! 
//!   x Expression expected
//!    ,-[3:1]
//!  3 |   "set": function (key, value) {
//!  4 | 
//!  5 |     // 'private' should not be considered a member variable here.
//!  6 |     private[key] = value;
//!    :     ^^^^^^^
//!  7 | 
//!  8 |   }
//!    `----
