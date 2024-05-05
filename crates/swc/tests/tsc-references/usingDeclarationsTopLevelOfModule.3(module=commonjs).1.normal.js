//// [usingDeclarationsTopLevelOfModule.3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "y", {
    enumerable: true,
    get: function() {
        return y;
    }
});
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    var z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    if (false) {
        var y = 1;
    }
    function f() {
        console.log(y, z);
    }
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
