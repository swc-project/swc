//// [propertyAccessChain.3.ts]
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  4 | obj?.a++;
//!    : ^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  5 | obj?.a.b++;
//!    : ^^^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  6 | obj?.a--;
//!    : ^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  7 | obj?.a.b--;
//!    : ^^^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!    ,----
//!  9 | ++obj?.a;
//!    :   ^^^^^^
//!    `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  10 | ++obj?.a.b;
//!     :   ^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  11 | --obj?.a;
//!     :   ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  12 | --obj?.a.b;
//!     :   ^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  14 | obj?.a = 1;
//!     : ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  15 | obj?.a.b = 1;
//!     : ^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  16 | obj?.a += 1;
//!     : ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  17 | obj?.a.b += 1;
//!     : ^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  19 | for (obj?.a in {});
//!     :      ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  20 | for (obj?.a.b in {});
//!     :      ^^^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  21 | for (obj?.a of []);
//!     :      ^^^^^^
//!     `----
//! 
//!   x The left-hand side of an assignment expression must be a variable or a property access.
//!     ,----
//!  22 | for (obj?.a.b of []);
//!     :      ^^^^^^^^
//!     `----
//! 
//!   x Not a pattern
//!     ,----
//!  24 | ({ a: obj?.a } = { a: 1 });
//!     :       ^^^^^^
//!     `----
//! 
//!   x Cannot assign to this
//!     ,----
//!  25 | ({ a: obj?.a.b } = { a: 1 });
//!     :       ^^^^^^^^
//!     `----
//! 
//!   x Not a pattern
//!     ,----
//!  26 | ({ ...obj?.a } = { a: 1 });
//!     :       ^^^^^^
//!     `----
//! 
//!   x Cannot assign to this
//!     ,----
//!  27 | ({ ...obj?.a.b } = { a: 1 });
//!     :       ^^^^^^^^
//!     `----
//! 
//!   x Not a pattern
//!     ,----
//!  28 | [...obj?.a] = [];
//!     :     ^^^^^^
//!     `----
//! 
//!   x Cannot assign to this
//!     ,----
//!  29 | [...obj?.a.b] = [];
//!     :     ^^^^^^^^
//!     `----
