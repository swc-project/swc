//// [tsxErrorRecovery2.tsx]
//// [file1.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  3 | <div></div>
//!    :  ^^^
//!    `----
//// [file2.tsx]
//! 
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :          ^^^
//!    `----
