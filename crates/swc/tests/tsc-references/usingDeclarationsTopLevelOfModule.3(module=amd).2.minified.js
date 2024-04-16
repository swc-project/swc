//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_using_ctx"
], function(require, exports, _using_ctx) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "y", {
        enumerable: !0,
        get: function() {
            return y;
        }
    });
    try {
        var y, _usingCtx = _using_ctx._();
        _usingCtx.u({
            [Symbol.dispose] () {}
        });
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
});
