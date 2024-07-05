//// [main.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!    ,-[7:1]
//!  4 | 
//!  5 | // needs: __esDecorate, __runInitializers, __setFunctionName
//!  6 | class C {
//!  7 |     @dec accessor #x: any;
//!    :     ^
//!  8 | }
//!  9 | 
//!    `----
//// [tslib.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
