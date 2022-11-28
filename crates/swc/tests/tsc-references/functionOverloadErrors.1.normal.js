//// [functionOverloadErrors.ts]
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[1:1]
//!  1 | //Function overload signature with initializer
//!  2 | function fn1(x = 3);
//!    :              ^^^^^
//!  3 | function fn1() { }
//!    `----
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!      ,-[114:1]
//!  114 | 
//!  115 | //Function overloads which use initializer expressions
//!  116 | function initExpr(n = 13);
//!      :                   ^^^^^^
//!  117 | function initExpr() { }
//!      `----
