//// [parserExportAssignment7.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[4:1]
//!  1 | export class C {
//!  2 | }
//!  3 | 
//!  4 | export = B;
//!    : ^^^^^^^^^^^
//!    `----
