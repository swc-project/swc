//// [tsxDynamicTagName1.tsx]
//! 
//!   x Expected ';', '}' or <eof>
//!    ,----
//!  3 | <CustomTag> Hello World </CustomTag>  // No error
//!    :                   ^^^^^
//!    `----
//! 
//! Error: 
//!   > This is the expression part of an expression statement
//!    ,----
//!  3 | <CustomTag> Hello World </CustomTag>  // No error
//!    : ^^^^^^^^^^^^^^^^^
//!    `----
