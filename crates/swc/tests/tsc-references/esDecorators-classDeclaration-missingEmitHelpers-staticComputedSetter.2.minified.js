//// [main.ts]
//!   x Unexpected token `@`. Expected identifier, string literal, numeric literal or [ for the computed key
//!     ,-[8:1]
//!   5 | 
//!   6 | // needs: __esDecorate, __runInitializers, __propKey
//!   7 | class C {
//!   8 |     @dec static set [x](value: number) { }
//!     :     ^
//!   9 | }
//!  10 | 
//!     `----
//// [tslib.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
