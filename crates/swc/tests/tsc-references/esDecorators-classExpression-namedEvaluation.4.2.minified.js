//// [esDecorators-classExpression-namedEvaluation.4.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | // 8.6.3 RS: IteratorBindingInitialization
//!  4 | //  SingleNameBinding : BindingIdentifier Initializer?
//!  5 | 
//!  6 | { const [x = @dec class { }] = obj; }
//!    :              ^
//!  7 | { const [x = class { @dec y: any; }] = obj; }
//!  8 | 
//!  9 | // 14.3.3.3 RS: KeyedBindingInitialization
//!    `----
