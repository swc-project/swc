//// [esDecorators-classDeclaration-commentPreservation.ts]
//// [file1.ts]
//!   x Expression expected
//!    ,-[5:1]
//!  2 | declare var dec: any;
//!  3 | 
//!  4 | /*1*/
//!  5 | @dec
//!    : ^
//!  6 | /*2*/
//!  7 | @dec
//!  8 | /*3*/
//!    `----
//// [file2.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | 
//!  2 | /*34*/
//!  3 | @dec
//!    : ^
//!  4 | /*35*/
//!  5 | @dec
//!  6 | /*36*/
//!    `----
//// [file3.ts]
//!   x Expected '{', got '@'
//!    ,-[5:1]
//!  2 | /*40*/
//!  3 | export
//!  4 | /*41*/
//!  5 | @dec
//!    : ^
//!  6 | /*42*/
//!  7 | @dec
//!  8 | /*43*/
//!    `----
