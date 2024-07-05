//// [esDecorators-classExpression-namedEvaluation.6.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 13.15.5.6 RS: KeyedDestructuringAssignmentEvaluation
//!  4 | //   AssignmentElement : DestructuringAssignmentTarget Initializer?
//!  5 | 
//!  6 | ({ y: x = @dec class { } } = obj);
//!    :           ^
//!  7 | ({ y: x = class { @dec y: any; } } = obj);
//!    `----
