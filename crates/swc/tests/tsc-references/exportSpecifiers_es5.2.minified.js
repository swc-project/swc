import { type, as, something, foo, bar } from "./exports.js";
// @Filename: /exports.ts
//!
//!  x The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.
//!    ,----
//! 10 | export type { type something as whatever }; // Error
//!    :               ^^^^
//!    `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
