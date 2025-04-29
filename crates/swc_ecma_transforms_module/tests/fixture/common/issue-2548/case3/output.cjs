"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get X () {
        return _Z.default;
    },
    get X2 () {
        return _Z.X2;
    },
    get Y () {
        return _Z.Y;
    }
});
const _Z = /*#__PURE__*/ _interop_require_wildcard(_export_star(require("./Z"), exports));
