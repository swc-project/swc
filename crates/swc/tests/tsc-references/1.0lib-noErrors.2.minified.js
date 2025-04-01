//// [1.0lib-noErrors.ts]
//!   x 'eval' and 'arguments' cannot be used as a binding identifier in strict mode
//!     ,-[29:1]
//!  26 |   * Evaluates JavaScript code and executes it. 
//!  27 |   * @param x A String value that contains valid JavaScript code.
//!  28 |   */
//!  29 | declare function eval(x: string): any;
//!     :                  ^^^^
//!  30 | 
//!  31 | /**
//!  32 |   * Converts A string to an integer.
//!     `----
