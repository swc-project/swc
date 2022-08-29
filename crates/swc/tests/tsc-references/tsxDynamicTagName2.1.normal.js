//// [tsxDynamicTagName2.tsx]
//! 
//!   x Expected ';', '}' or <eof>
//!     ,----
//!  10 | <customTag> Hello World </customTag>  // This should be an error. The lower-case is look up as an intrinsic element name
//!     :                   ^^^^^
//!     `----
//! 
//! Error: 
//!   > This is the expression part of an expression statement
//!     ,----
//!  10 | <customTag> Hello World </customTag>  // This should be an error. The lower-case is look up as an intrinsic element name
//!     : ^^^^^^^^^^^^^^^^^
//!     `----
