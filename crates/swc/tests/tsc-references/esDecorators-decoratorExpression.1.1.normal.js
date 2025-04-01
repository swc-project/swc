//// [esDecorators-decoratorExpression.1.ts]
//!   x Expression expected
//!    ,-[4:1]
//!  1 | 
//!  2 | declare let x: any;
//!  3 | 
//!  4 | { @x().y class C {} }
//!    :   ^
//!  5 | 
//!  6 | { @new x class C {} }
//!    `----
