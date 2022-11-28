//// [restElementWithInitializer2.ts]
//! 
//!   x A rest parameter cannot have an initializer
//!    ,-[1:1]
//!  1 | var a: number[];
//!  2 | var x: number[];
//!  3 | [...x = a] = a;  // Error, rest element cannot have initializer
//!    :  ^^^^^^^^
//!    `----
