//// [parserParameterList10.ts]
//! 
//!   x A rest parameter cannot have an initializer
//!    ,-[1:1]
//!  1 | class C {
//!  2 |    foo(...bar = 0) { }
//!    :           ^^^
//!  3 | }
//!    `----
