//// [invalidInstantiatedModule.ts]
//!   x the name `Point` is defined multiple times
//!    ,-[2:1]
//!  1 | module M {
//!  2 |     export class Point { x: number; y: number }
//!    :                  ^^|^^
//!    :                    `-- previous definition of `Point` here
//!  3 |     export var Point = 1;  // Error
//!    :                ^^|^^
//!    :                  `-- `Point` redefined here
//!  4 | }
//!  5 | 
//!  6 | module M2 {
//!    `----
