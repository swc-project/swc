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
    X: function() {
        return _Z.default;
    },
    X2: function() {
        return _Z.X2;
    },
    Y: function() {
        return _Z.Y;
    }
});
const _Z = /*#__PURE__*/ _interop_require_wildcard(_export_star(require("./Z"), exports));
