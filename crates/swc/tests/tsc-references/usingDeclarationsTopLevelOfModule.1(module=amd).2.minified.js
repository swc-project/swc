//// [usingDeclarationsTopLevelOfModule.1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(require, exports, _dispose, _using) {
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
            return w;
        },
        x: function() {
            return x;
        },
        y: function() {
            return y;
        }
    });
    let x = 1, w = 3;
    try {
        var _stack = [], z = _using._(_stack, {
            [Symbol.dispose] () {}
        }), y = 2, _default = 4;
        console.log(w, x, y, z);
    } catch (_) {
        var _error = _, _hasError = !0;
    } finally{
        _dispose._(_stack, _error, _hasError);
    }
});
