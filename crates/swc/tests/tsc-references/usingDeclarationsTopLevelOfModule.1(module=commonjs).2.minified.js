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
const _dispose = require("@swc/helpers/_/_dispose"), _using = require("@swc/helpers/_/_using");
try {
    var _x, _w, _stack = [];
    _x = 1;
    var z = _using._(_stack, {
        [Symbol.dispose] () {}
    }), y = 2;
    _w = 3;
    var _default = 4;
    console.log(3, 1, y, z);
} catch (_) {
    var _error = _, _hasError = !0;
} finally{
    _dispose._(_stack, _error, _hasError);
}
