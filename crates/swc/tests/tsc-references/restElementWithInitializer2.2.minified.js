//// [restElementWithInitializer2.ts]
//! 
//!   x A rest parameter cannot have an initializer
//!    ,----
//!  3 | [...x = a] = a;  // Error, rest element cannot have initializer
//!    :  ^^^^^^^^
//!    `----
