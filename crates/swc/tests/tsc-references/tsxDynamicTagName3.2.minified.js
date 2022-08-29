//// [tsxDynamicTagName3.tsx]
//! 
//!   x Expected ';', '}' or <eof>
//!     ,----
//!  10 | <CustomTag> Hello World </CustomTag>  // This should be an error. we will try look up string literal type in JSX.IntrinsicElements
//!     :                   ^^^^^
//!     `----
//! 
//! Error: 
//!   > This is the expression part of an expression statement
//!     ,----
//!  10 | <CustomTag> Hello World </CustomTag>  // This should be an error. we will try look up string literal type in JSX.IntrinsicElements
//!     : ^^^^^^^^^^^^^^^^^
//!     `----
