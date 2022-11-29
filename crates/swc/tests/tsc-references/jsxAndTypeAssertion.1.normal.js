//// [jsxAndTypeAssertion.tsx]
//! 
//!   x Unexpected token `any`. Expected jsx identifier
//!     ,-[4:1]
//!   4 | class foo {}
//!   5 | 
//!   6 | var x: any;
//!   7 | x = <any> { test: <any></any> };
//!     :      ^^^
//!   8 | 
//!   9 | x = <any><any></any>;
//!  10 |  
//!     `----
