//// [parserExportAssignment9.ts]
//! 
//!   x the name `default` is exported multiple times
//!    ,-[2:3]
//!  2 | export default foo;
//!    : ^^^^^^^^^|^^^^^^^^^
//!    :          `-- previous exported here
//!  3 | }
//!  4 | 
//!  5 | module Bar {
//!  6 |   export default bar;
//!    :   ^^^^^^^^^|^^^^^^^^^
//!    :            `-- exported more than once
//!    `----
//! 
//! Error: 
//!   > Exported identifiers must be unique
