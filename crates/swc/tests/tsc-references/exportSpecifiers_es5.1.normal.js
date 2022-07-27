// @module: esnext
// @declaration: true
// @Filename: /imports.ts
import { type, as, something, foo, bar } from "./exports.js";
type;
as; // Error (used in emitting position)
something; // Error (used in emitting position)
foo; // Error (used in emitting position)
bar; // Error (used in emitting position)
// @Filename: /exports.ts
//!failed to process input file
//!
//!Caused by:
//!    0: error was recoverable, but proceeding would result in wrong codegen
//!    1: Syntax Error
