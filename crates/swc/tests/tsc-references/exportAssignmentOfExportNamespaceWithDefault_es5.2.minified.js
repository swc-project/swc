import a from "a";
a();
// @filename: external.d.ts
//!
//!  x the name `default` is exported multiple times
//!   ,-[6:9]
//! 6 | export { _a as default };
//!   :                ^^^|^^^
//!   :                   `-- previous exported here
//! 7 |     }
//! 8 |     export default a;
//!   :     ^^^^^^^^|^^^^^^^^
//!   :             `-- exported more than once
//!   `----
//!
//!Error: 
//!  > Exported identifiers must be unique
//!
//!  x An export assignment cannot be used in a module with other exported elements.
//!    ,----
//! 13 | export = a;
//!    : ^^^^^^^^^^^
//!    `----
