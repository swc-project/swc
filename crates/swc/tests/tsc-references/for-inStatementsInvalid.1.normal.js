//// [for-inStatementsInvalid.ts]
//! 
//!   x The left-hand side of a 'for...of' statement cannot use a type annotation
//!     ,-[8:1]
//!   8 | for (aRegExp in {}) { }
//!   9 | 
//!  10 | for (var idx : number in {}) { }
//!     :          ^^^
//!  11 | 
//!  12 | function fn(): void { }
//!     `----
