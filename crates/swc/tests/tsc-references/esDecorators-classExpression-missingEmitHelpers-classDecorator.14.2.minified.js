//// [main.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | declare var x: any;
//!  4 | 
//!  5 | // uses __esDecorate, __runInitializers, __setFunctionName, __propKey
//!  6 | ({ [x]: @dec class {} });
//!    :         ^
//!  7 | 
//!    `----
//// [tslib.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
