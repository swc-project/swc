//!
//!  x An interface can only extend an identifier/qualified-name with optional type arguments.
//!   ,----
//! 5 | interface C1 extends Foo?.Bar {}
//!   :                      ^^^^^^^^
//!   `----
//!
//!
//!Caused by:
//!    0: failed to process input file
//!    1: error was recoverable, but proceeding would result in wrong codegen
//!    2: Syntax Error
