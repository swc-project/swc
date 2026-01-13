//// [parserExportAssignment8.ts]
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,-[1:1]
//!  1 | export = B;
//!    : ^^^^^^^^^^^
//!  2 | 
//!  3 | export class C {
//!  4 | }
//!    `----
