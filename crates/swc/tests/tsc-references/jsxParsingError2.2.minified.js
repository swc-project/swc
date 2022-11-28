//// [jsxParsingError2.tsx]
//// [file.tsx]
//// [Error1.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[1:1]
//!  1 | // Issue error about missing span closing tag, not missing div closing tag
//!  2 | let x1 = <div><span></div>;
//!    :           ^^^
//!  3 | 
//!    `----
//// [Error2.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[1:1]
//!  1 | let x2 = <div></span>;
//!    :           ^^^
//!  2 | 
//!    `----
//// [Error3.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[1:1]
//!  1 | let x3 = <div>;
//!    :           ^^^
//!  2 | 
//!    `----
//// [Error4.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[1:1]
//!  1 | let x4 = <div><div></span>;
//!    :           ^^^
//!  2 | 
//!    `----
//// [Error5.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[1:1]
//!  1 | let x5 = <div><span>
//!    :           ^^^
//!  2 | 
//!    `----
