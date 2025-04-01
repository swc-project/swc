//// [esDecorators-classExpression-namedEvaluation.1.ts]
//!   x Expression expected
//!     ,-[8:1]
//!   5 | // 13.15.2 RS: Evaluation
//!   6 | //  AssignmentExpression : LeftHandSideExpression `=` AssignmentExpression
//!   7 | 
//!   8 | x = @dec class { };
//!     :     ^
//!   9 | x = class { @dec y: any; };
//!  10 | 
//!  11 | // 13.15.2 RS: Evaluation
//!     `----
