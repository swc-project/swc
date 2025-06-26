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
        return _module.default;
    },
    get Y () {
        return _module.Y;
    },
    get Z () {
        return _module.Z;
    }
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _module = /*#__PURE__*/ _interop_require_wildcard._(require("./module"));
