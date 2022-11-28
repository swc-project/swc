//// [file.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[2:1]
//!  2 | declare namespace JSX { interface Element { } }
//!  3 | 
//!  4 | function foo() {
//!  5 | 	var x = <div>  { </div>
//!    :           ^^^
//!  6 | }
//!  7 | // Shouldn't see any errors down here
//!  8 | var y = { a: 1 };
//!    `----
