//// [main.ts]
//!   x Expression expected
//!    ,-[6:1]
//!  3 | declare var dec: any;
//!  4 | 
//!  5 | // needs: __esDecorate, __runInitializers, __setFunctionName
//!  6 | export default @dec class {}
//!    :                ^
//!  7 | 
//!    `----
//// [tslib.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
