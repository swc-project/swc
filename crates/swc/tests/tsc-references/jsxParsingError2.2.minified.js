//// [jsxParsingError2.tsx]
//// [file.tsx]
//// [Error1.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  2 | let x1 = <div><span></div>;
//!    :           ^^^
//!    `----
//// [Error2.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x2 = <div></span>;
//!    :           ^^^
//!    `----
//// [Error3.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x3 = <div>;
//!    :           ^^^
//!    `----
//// [Error4.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x4 = <div><div></span>;
//!    :           ^^^
//!    `----
//// [Error5.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x5 = <div><span>
//!    :           ^^^
//!    `----
