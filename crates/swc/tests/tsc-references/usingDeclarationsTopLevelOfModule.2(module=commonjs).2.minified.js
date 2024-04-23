//// [usingDeclarationsTopLevelOfModule.2.ts]
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _usingCtx = _using_ctx._(), z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    console.log(2, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
module.exports = 4;
