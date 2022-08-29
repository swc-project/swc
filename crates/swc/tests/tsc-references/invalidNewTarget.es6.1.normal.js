//// [invalidNewTarget.es6.ts]
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!    ,----
//!  1 | const a = new.target;
//!    :           ^^^^^^^^^^
//!    `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!    ,----
//!  2 | const b = () => new.target;
//!    :                 ^^^^^^^^^^
//!    `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!     ,----
//!  19 | [new.target]: undefined,
//!     :  ^^^^^^^^^^
//!     `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!     ,----
//!  23 | n: new.target,
//!     :    ^^^^^^^^^^
//!     `----
