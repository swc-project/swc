//// [file.tsx]
//! 
//!   x Expected ';', '}' or <eof>
//!    ,----
//!  9 | <div>Dot goes here: &middot; &notAnEntity; </div>;
//!    :          ^^^^
//!    `----
//! 
//! Error: 
//!   > This is the expression part of an expression statement
//!    ,----
//!  9 | <div>Dot goes here: &middot; &notAnEntity; </div>;
//!    : ^^^^^^^^
//!    `----
