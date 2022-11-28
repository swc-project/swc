//// [invalidNewTarget.es5.ts]
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!    ,-[1:1]
//!  1 | const a = new.target;
//!    :           ^^^^^^^^^^
//!  2 | const b = () => new.target;
//!    `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!    ,-[1:1]
//!  1 | const a = new.target;
//!  2 | const b = () => new.target;
//!    :                 ^^^^^^^^^^
//!  3 | 
//!  4 | class C {
//!    `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!     ,-[17:1]
//!  17 | 
//!  18 | const O = {
//!  19 |     [new.target]: undefined,
//!     :      ^^^^^^^^^^
//!  20 |     k() { return new.target; },
//!  21 |     get l() { return new.target; },
//!     `----
//! 
//!   x 'new.target' is only allowed in the body of a function declaration, function expression, or class.
//!     ,-[21:1]
//!  21 |     get l() { return new.target; },
//!  22 |     set m(_) { _ = new.target; },
//!  23 |     n: new.target,
//!     :        ^^^^^^^^^^
//!  24 | };
//!     `----
