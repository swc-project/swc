//// [esDecorators-classExpression-namedEvaluation.9.ts]
//// [a.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | export = @dec class { };
//!    :          ^
//!  4 | 
//!    `----
//// [b.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | export = class { @dec y: any };
//!    :                  ^
//!    `----
