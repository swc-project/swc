//// [usingDeclarationsTopLevelOfModule.2.ts]
"use strict";
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._();
    var z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    const y = 2;
    console.log(y, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
module.exports = 4;
