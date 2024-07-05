//// [templateStringInDeleteExpression.ts]
//!   x The operand of a delete operator must be a property reference.
//!    ,----
//!  1 | delete `abc${0}abc`;
//!    :        ^^^^^^^^^^^^
//!    `----
