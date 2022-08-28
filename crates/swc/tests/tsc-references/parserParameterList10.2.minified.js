//// [parserParameterList10.ts]
//! 
//!   x A rest parameter cannot have an initializer
//!    ,----
//!  2 | foo(...bar = 0) { }
//!    :        ^^^
//!    `----
