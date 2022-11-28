//// [1.0lib-noErrors.ts]
//! 
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!     ,-[27:1]
//!  27 |   * @param x A String value that contains valid JavaScript code.
//!  28 |   */
//!  29 | declare function eval(x: string): any;
//!     :                  ^^^^
//!  30 | 
//!  31 | /**
//!     `----
