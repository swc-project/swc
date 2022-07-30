// @outdir: out/
// @allowJS: true
// @checkJS: true
// @filename: plainJSRedeclare.js
//!
//!  x the name `orbitol` is defined multiple times
//!   ,-[2:1]
//! 2 | const orbitol = 1
//!   :       ^^^|^^^
//!   :          `-- previous definition of `orbitol` here
//! 3 | var orbitol = 1 + false
//!   :     ^^^|^^^
//!   :        `-- `orbitol` redefined here
//!   `----
