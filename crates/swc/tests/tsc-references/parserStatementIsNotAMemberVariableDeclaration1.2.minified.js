//// [parserStatementIsNotAMemberVariableDeclaration1.ts]
//! 
//!   x Return statement is not allowed here
//!    ,-[1:1]
//!  1 | ,-> return {
//!  2 | |   
//!  3 | `->   "set": function (key, value) {
//!    `----
//! 
//!   x Unexpected token `private`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string,
//!   | regexp, ` for template literal, (, or an identifier
//!    ,----
//!  6 | private[key] = value;
//!    : ^^^^^^^
//!    `----
