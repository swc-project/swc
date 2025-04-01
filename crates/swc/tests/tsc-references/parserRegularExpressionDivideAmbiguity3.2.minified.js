//// [parserRegularExpressionDivideAmbiguity3.ts]
//!   x Unknown regular expression flags.
//!    ,----
//!  1 | if (1) /regexp/a.foo();
//!    :        ^^^^^^^^^
//!    `----
