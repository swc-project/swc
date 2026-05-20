//// [TwoInternalModulesThatMergeEachWithExportedAndNonExportedClassesOfTheSameName.ts]
//!   x the name `Point` is defined multiple times
//!     ,-[2:1]
//!   1 | module A {
//!   2 |     export class Point {
//!     :                  ^^|^^
//!     :                    `-- previous definition of `Point` here
//!   3 |         x: number;
//!   4 |         y: number;
//!   5 |     }
//!   6 | }
//!   7 | 
//!   8 | module A {
//!   9 |     class Point {
//!     :           ^^|^^
//!     :             `-- `Point` redefined here
//!  10 |         fromCarthesian(p: A.Point) {
//!  11 |             return { x: p.x, y: p.y };
//!  12 |         }
//!     `----
