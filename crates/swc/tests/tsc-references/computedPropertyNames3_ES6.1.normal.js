//// [computedPropertyNames3_ES6.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,-[3:1]
//!  3 |     [0 + 1]() { }
//!  4 |     static [() => { }]() { }
//!  5 |     get [delete id]() { }
//!    :                 ^^
//!  6 |     set [[0, 1]](v) { }
//!  7 |     static get [<String>""]() { }
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[3:1]
//!  3 |     [0 + 1]() { }
//!  4 |     static [() => { }]() { }
//!  5 |     get [delete id]() { }
//!    :                 ^^
//!  6 |     set [[0, 1]](v) { }
//!  7 |     static get [<String>""]() { }
//!    `----
