//// [esDecorators-classExpression-namedEvaluation.2.ts]
//!   x Expression expected
//!     ,-[8:1]
//!   5 | // 13.2.5.5 RS: PropertyDefinitionEvaluation
//!   6 | //  PropertyAssignment : PropertyName `:` AssignmentExpression
//!   7 | 
//!   8 | ({ x: @dec class { } });
//!     :       ^
//!   9 | ({ x: class { @dec y: any; } });
//!  10 | 
//!  11 | ({ "x": @dec class { } });
//!     `----
