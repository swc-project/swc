//// [computedPropertyNames3_ES5.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,-[2:1]
//!  2 | class C {
//!  3 |     [0 + 1]() { }
//!  4 |     static [() => { }]() { }
//!  5 |     get [delete id]() { }
//!    :                 ^^
//!  6 |     set [[0, 1]](v) { }
//!  7 |     static get [<String>""]() { }
//!  8 |     static set [id.toString()](v) { }
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[2:1]
//!  2 | class C {
//!  3 |     [0 + 1]() { }
//!  4 |     static [() => { }]() { }
//!  5 |     get [delete id]() { }
//!    :                 ^^
//!  6 |     set [[0, 1]](v) { }
//!  7 |     static get [<String>""]() { }
//!  8 |     static set [id.toString()](v) { }
//!    `----
