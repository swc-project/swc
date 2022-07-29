//!
//!  x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!   ,----
//! 3 | function f(arguments) {
//!   :            ^^^^^^^^^
//!   `----
//!
//!  x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!   ,----
//! 4 | var a = () => (arguments) => arguments;
//!   :                ^^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
