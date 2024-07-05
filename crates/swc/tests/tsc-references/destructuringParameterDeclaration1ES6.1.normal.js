//// [destructuringParameterDeclaration1ES6.ts]
//!   x the name `number` is bound more than once in this parameter list
//!     ,-[96:1]
//!  93 | function e4({x: [number,string,any] }) { }  // x has type [any, any, any]
//!  94 | function e5({x: [a, b, c]}: { x: [number, number, number] }) { }  // x has type [any, any, any]
//!  95 | 
//!  96 | function e6({x: [number, number, number]}) { }  // error, duplicate identifier;
//!     :                  ^^^|^^  ^^^|^^
//!     :                     |       `-- used as parameter more than once
//!     :                     `-- previous definition here
//!  97 | 
//!  98 | 
//!     `----
//!   x the name `number` is bound more than once in this parameter list
//!     ,-[96:1]
//!  93 | function e4({x: [number,string,any] }) { }  // x has type [any, any, any]
//!  94 | function e5({x: [a, b, c]}: { x: [number, number, number] }) { }  // x has type [any, any, any]
//!  95 | 
//!  96 | function e6({x: [number, number, number]}) { }  // error, duplicate identifier;
//!     :                          ^^^|^^  ^^^|^^
//!     :                             |       `-- used as parameter more than once
//!     :                             `-- previous definition here
//!  97 | 
//!  98 | 
//!     `----
