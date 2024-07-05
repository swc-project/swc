//// [esDecorators-classExpression-namedEvaluation.11.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | 
//!  4 | // No NamedEvaluation, no class name
//!  5 | 
//!  6 | (@dec class {});
//!    :  ^
//!  7 | (class { @dec y: any });
//!  8 | 
//!  9 | // No NamedEvaluation, class name
//!    `----
