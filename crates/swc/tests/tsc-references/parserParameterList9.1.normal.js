//// [parserParameterList9.ts]
//! 
//!   x A rest parameter cannot be optional
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    foo(...bar?) { }
//!    :              ^
//!  3 | }
//!    `----
