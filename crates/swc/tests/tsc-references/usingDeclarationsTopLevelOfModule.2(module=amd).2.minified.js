//// [usingDeclarationsTopLevelOfModule.2.ts]
define([
    "require",
    "@swc/helpers/_/_using_ctx"
], function(require, _using_ctx) {
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
    return 4;
});
