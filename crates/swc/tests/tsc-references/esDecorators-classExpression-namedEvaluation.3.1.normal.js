//// [esDecorators-classExpression-namedEvaluation.3.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 14.3.1.2 RS: Evaluation
//!  4 | //   LexicalBinding : BindingIdentifier Initializer
//!  5 | 
//!  6 | { let x = @dec class { }; }
//!    :           ^
//!  7 | { let x = class { @dec y: any; }; }
//!  8 | 
//!  9 | { const x = @dec class { }; }
//!    `----
