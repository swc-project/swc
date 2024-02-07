//// [main.ts]
//! 
//!   x Expression expected
//!    ,-[2:1]
//!  2 | declare var dec: any;
//!  3 | 
//!  4 | // uses: __esDecorate, __runInitializers
//!  5 | export const C = @dec class C {};
//!    :                  ^
//!  6 | 
//!    `----
//// [tslib.d.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
