//// [tsxErrorRecovery2.tsx]
//// [file1.tsx]
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,-[3:1]
//!  1 | declare namespace JSX { interface Element { } }
//!  2 | 
//!  3 | <div></div>
//!    :  ^^^
//!  4 | <div></div>
//!  5 | 
//!    `----
//// [file2.tsx]
//!   x Unexpected token `div`. Expected jsx identifier
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :          ^^^
//!    `----
