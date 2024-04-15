//// [usingDeclarationsTopLevelOfModule.2.ts]
define([
    "require",
    "@swc/helpers/_/_using_ctx"
], function(require, _using_ctx) {
    "use strict";
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
    return 4;
});
