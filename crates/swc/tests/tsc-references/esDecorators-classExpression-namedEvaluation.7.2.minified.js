//// [esDecorators-classExpression-namedEvaluation.7.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 13.15.5.6 RS: KeyedDestructuringAssignmentEvaluation
//!  4 | //   AssignmentElement : DestructuringAssignmentTarget Initializer?
//!  5 | 
//!  6 | [x = @dec class { }] = obj;
//!    :      ^
//!  7 | [x = class { @dec y: any; }] = obj;
//!    `----
