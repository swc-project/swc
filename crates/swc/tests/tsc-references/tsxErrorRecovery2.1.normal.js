//// [tsxErrorRecovery2.tsx]
//// [file1.tsx]
//!   x Expected ident
//!    ,-[4:1]
//!  1 | declare namespace JSX { interface Element { } }
//!  2 | 
//!  3 | <div></div>
//!  4 | <div></div>
//!    :       ^
//!  5 | 
//!    `----
//// [file2.tsx]
//!   x Expected ident
//!    ,----
//!  1 | var x = <div></div><div></div>
//!    :                          ^
//!    `----
