//// [main.ts]
//!   x Expression expected
//!    ,-[7:1]
//!  4 | var C;
//!  5 | 
//!  6 | // uses __esDecorate, __runInitializers, __setFunctionName
//!  7 | C ??= @dec class {};
//!    :       ^
//!  8 | 
//!    `----
//// [tslib.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
