//// [deleteOperatorInvalidOperations.ts]
//! 
//!   x Expected a semicolon
//!    ,-[3:1]
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                    ^^^^^^
//!  6 | 
//!  7 | // miss an operand
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,-[3:1]
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                           ^
//!  6 | 
//!  7 | // miss an operand
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[3:1]
//!  3 | 
//!  4 | // operand before delete operator
//!  5 | var BOOLEAN1 = ANY delete ;     //expect error
//!    :                          ^
//!  6 | 
//!  7 | // miss an operand
//!    `----
//! 
//!   x Unexpected token `;`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!     ,-[6:1]
//!   6 | 
//!   7 | // miss an operand
//!   8 | var BOOLEAN2 = delete ;
//!     :                       ^
//!   9 | 
//!  10 | // delete global variable s
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[6:1]
//!   6 | 
//!   7 | // miss an operand
//!   8 | var BOOLEAN2 = delete ;
//!     :                      ^
//!   9 | 
//!  10 | // delete global variable s
//!     `----
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!     ,-[11:1]
//!  11 | class testADelx {
//!  12 |     constructor(public s: () => {}) {
//!  13 |         delete s;      //expect error
//!     :                ^
//!  14 |     }
//!  15 | }
//!     `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!     ,-[11:1]
//!  11 | class testADelx {
//!  12 |     constructor(public s: () => {}) {
//!  13 |         delete s;      //expect error
//!     :                ^
//!  14 |     }
//!  15 | }
//!     `----
