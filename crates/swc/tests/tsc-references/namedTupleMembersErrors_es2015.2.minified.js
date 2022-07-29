//!
//!  x Only named exports may use 'export type'.
//!    ,----
//! 16 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!    : ^^^^^^^^^^^
//!    `----
//!
//!  x Expected '{', got 'OptTrailing'
//!    ,----
//! 16 | export type OptTrailing = [first: string, rest: ...string[]?]; // dots+question on element disallowed
//!    :             ^^^^^^^^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
