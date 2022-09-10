//// [jsxParsingError3.tsx]
//// [file.tsx]
//// [Error1.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x1 = <div>}</div>;
//!    :           ^^^
//!    `----
//// [Error2.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x2 = <div>></div>;
//!    :           ^^^
//!    `----
//// [Error3.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x3 = <div>{"foo"}}</div>;
//!    :           ^^^
//!    `----
//// [Error4.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x4 = <div>{"foo"}></div>;
//!    :           ^^^
//!    `----
//// [Error5.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x5 = <div>}{"foo"}</div>;
//!    :           ^^^
//!    `----
//// [Error6.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | let x6 = <div>>{"foo"}</div>;
//!    :           ^^^
//!    `----
