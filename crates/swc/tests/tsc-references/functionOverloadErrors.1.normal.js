//// [functionOverloadErrors.ts]
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!    ,----
//!  2 | function fn1(x = 3);
//!    :              ^^^^^
//!    `----
//! 
//!   x A parameter initializer is only allowed in a function or constructor implementation
//!      ,----
//!  116 | function initExpr(n = 13);
//!      :                   ^^^^^^
//!      `----
