//// [file.tsx]
//! 
//!   x Unknown regular expression flags.
//!    ,----
//!  5 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!    :                            ^^^^^^^^^^^^^^^^^^^^
//!    `----
//! 
//!   x Unterminated regexp literal
//!    ,----
//!  5 | let k1 = <div> <h2> Hello </h2> <h1> world </h1></div>;
//!    :                                                  ^^^^^^
//!    `----
