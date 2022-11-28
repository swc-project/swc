//// [deleteOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,-[2:1]
//!  2 | var ANY;
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                    ^^^^^^
//!  6 | 
//!  7 | // miss an operand
//!  8 | var BOOLEAN2 = delete ;
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[2:1]
//!  2 | var ANY;
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                           ^
//!  6 | 
//!  7 | // miss an operand
//!  8 | var BOOLEAN2 = delete ;
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[2:1]
//!  2 | var ANY;
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                          ^
//!  6 | 
//!  7 | // miss an operand
//!  8 | var BOOLEAN2 = delete ;
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,-[5:1]
//!   5 | var BOOLEAN1 = ANY delete ;     //expect error
//!   6 | 
//!   7 | // miss an operand
//!   8 | var BOOLEAN2 = delete ;
//!     :                       ^
//!   9 | 
//!  10 | // delete global variable s
//!  11 | class testADelx {
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[5:1]
//!   5 | var BOOLEAN1 = ANY delete ;     //expect error
//!   6 | 
//!   7 | // miss an operand
//!   8 | var BOOLEAN2 = delete ;
//!     :                      ^
//!   9 | 
//!  10 | // delete global variable s
//!  11 | class testADelx {
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[10:1]
//!  10 | // delete global variable s
//!  11 | class testADelx {
//!  12 |     constructor(public s: () => {}) {
//!  13 |         delete s;      //expect error
//!     :                ^
//!  14 |     }
//!  15 | }
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[10:1]
//!  10 | // delete global variable s
//!  11 | class testADelx {
//!  12 |     constructor(public s: () => {}) {
//!  13 |         delete s;      //expect error
//!     :                ^
//!  14 |     }
//!  15 | }
//!     `----
