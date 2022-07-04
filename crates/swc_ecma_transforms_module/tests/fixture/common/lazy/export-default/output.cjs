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
    default: ()=>_external().default,
    foo: ()=>_external().default
});
function _external() {
    const data = /*#__PURE__*/ _interopRequireDefault(require("external"));
    _external = function() {
        return data;
    };
    return data;
}
