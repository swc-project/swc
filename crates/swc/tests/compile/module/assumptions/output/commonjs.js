"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "namespace", {
    enumerable: true,
    get: function() {
        return _lazy();
    }
});
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
function _lazy() {
    var data = /*#__PURE__*/ _interop_require_wildcard._(require("./lazy"));
    _lazy = function() {
        return data;
    };
    return data;
}
function _named() {
    var data = require("./named");
    _named = function() {
        return data;
    };
    return data;
}
exports.value = _named().value;
