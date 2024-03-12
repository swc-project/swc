//// [usingDeclarationsTopLevelOfModule.1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(require, exports, _dispose, _using) {
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
    var _x;
    var _w;
    try {
        var _stack = [];
        const x = 1;
        _x = x;
        var z = _using._(_stack, {
            [Symbol.dispose] () {}
        });
        var y = 2;
        const w = 3;
        _w = w;
        var _default = 4;
        console.log(w, x, y, z);
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose._(_stack, _error, _hasError);
    }
});
