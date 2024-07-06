//// [main.ts]
//!   x Expression expected
//!    ,-[8:1]
//!  5 | var C;
//!  6 | 
//!  7 | // uses __esDecorate, __runInitializers, __setFunctionName, __propKey
//!  8 | ({ [x]: C = @dec class {} } = {});
//!    :             ^
//!  9 | 
//!    `----
//// [tslib.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
