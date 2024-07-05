//// [plainJSRedeclare.js]
//!   x the name `orbitol` is defined multiple times
//!    ,-[1:1]
//!  1 | const orbitol = 1
//!    :       ^^^|^^^
//!    :          `-- previous definition of `orbitol` here
//!  2 | var orbitol = 1 + false
//!    :     ^^^|^^^
//!    :        `-- `orbitol` redefined here
//!  3 | orbitol.toExponential()
//!    `----
