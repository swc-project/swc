//// [parserArrowFunctionExpression11.ts]
//// [fileJs.js]
//!   x Expected ':', got '<eof>'
//!    ,-[1:1]
//!  1 | a ? b ? c : (d) : e => f // Legal JS
//!    :                        ^
//!  2 | 
//!    `----
//// [fileTs.ts]
//!   x Expected ':', got '<eof>'
//!    ,----
//!  1 | a ? b ? c : (d) : e => f
//!    :                        ^
//!    `----
