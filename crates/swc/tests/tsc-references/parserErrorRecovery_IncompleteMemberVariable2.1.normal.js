//// [parserErrorRecovery_IncompleteMemberVariable2.ts]
//! 
//!   x Expected a semicolon
//!     ,-[9:1]
//!   9 |     // Class
//!  10 |     export class Point implements IPoint {
//!  11 | 
//!  12 |         public con:C "hello";
//!     :                      ^^^^^^^
//!  13 |         // Constructor
//!  14 |         constructor (public x: number, public y: number) { }
//!     `----
