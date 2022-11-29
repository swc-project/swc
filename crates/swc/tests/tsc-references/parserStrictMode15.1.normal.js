//// [parserStrictMode15.ts]
//! 
//!   x 'delete' cannot be called on an identifier in strict mode
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | delete a;
//!    :        ^
//!    `----
//! 
//!   x The operand of a delete operator must be a property reference.
//!    ,-[1:1]
//!  1 | "use strict";
//!  2 | delete a;
//!    :        ^
//!    `----
