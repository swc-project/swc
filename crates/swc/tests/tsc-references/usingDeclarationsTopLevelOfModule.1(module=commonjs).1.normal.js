//// [usingDeclarationsTopLevelOfModule.1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
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
var _x;
var _w;
try {
    var _usingCtx = _using_ctx._();
    const x = 1;
    _x = x;
    var z = _usingCtx.u({
        [Symbol.dispose] () {}
    });
    const y = 2;
    const w = 3;
    _w = w;
    var _default = 4;
    console.log(w, x, y, z);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
