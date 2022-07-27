//!
//!  x 'implements', 'interface', 'let', 'package', 'private', 'protected',  'public', 'static', or 'yield' cannot be used as an identifier in strict mode
//!   ,----
//! 2 | var interface: number, I: string;
//!   :     ^^^^^^^^^
//!   `----
//!
//!  x Unexpected token `interface`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string,
//!  | regexp, ` for template literal, (, or an identifier
//!   ,----
//! 5 | interface   // This should be the identifier 'interface'
//!   : ^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: Syntax Error
