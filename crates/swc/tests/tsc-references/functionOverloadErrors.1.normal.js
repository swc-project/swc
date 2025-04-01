//// [functionOverloadErrors.ts]
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,-[2:1]
//!  1 | //Function overload signature with initializer
//!  2 | function fn1(x = 3);
//!    :              ^^^^^
//!  3 | function fn1() { }
//!  4 | 
//!  5 | //Multiple function overload signatures that are identical
//!    `----
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!      ,-[116:1]
//!  113 | }
//!  114 | 
//!  115 | //Function overloads which use initializer expressions
//!  116 | function initExpr(n = 13);
//!      :                   ^^^^^^
//!  117 | function initExpr() { }
//!      `----
