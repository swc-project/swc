//// [esDecorators-decoratorExpression.2.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | declare let g: <T>(...args: any) => any;
//!  4 | declare let h: () => <T>(...args: any) => any;
//!  5 | 
//!  6 | { @x! class C {} }
//!    :   ^
//!  7 | 
//!  8 | { @x.y! class C {} }
//!    `----
