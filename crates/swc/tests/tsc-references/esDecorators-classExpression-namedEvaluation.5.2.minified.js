//// [esDecorators-classExpression-namedEvaluation.5.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 13.15.5.3 RS: PropertyDestructuringAssignmentEvaluation
//!  4 | //   AssignmentProperty : IdentifierReference Initializer?
//!  5 | 
//!  6 | ({ x = @dec class { } } = obj);
//!    :        ^
//!  7 | ({ x = class { @dec y: any; } } = obj);
//!    `----
