//// [usingDeclarationsTopLevelOfModule.1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    default: function() {
        return _default;
    },
    w: function() {
        return _w;
    },
    x: function() {
        return _x;
    },
    y: function() {
        return y;
    }
});
const _using_ctx = require("@swc/helpers/_/_using_ctx");
try {
    var _x, _w, _usingCtx = _using_ctx._();
    _x = 1;
    var z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    _w = 3;
    var _default = 4;
    console.log(3, 1, 2, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
