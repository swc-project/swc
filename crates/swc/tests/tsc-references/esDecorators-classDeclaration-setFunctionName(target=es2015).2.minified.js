//// [esDecorators-classDeclaration-setFunctionName.ts]
//// [a.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | @dec class C {}
//!    : ^
//!  4 | 
//!  5 | export {}
//!    `----
//// [b.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | @dec export class C {}
//!    : ^
//!  4 | 
//!    `----
//// [c.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | @dec export default class C {}
//!    : ^
//!  4 | 
//!    `----
//// [c.ts]
//!   x Expression expected
//!    ,-[3:1]
//!  1 | declare let dec: any;
//!  2 | 
//!  3 | @dec export default class {}
//!    : ^
//!    `----
