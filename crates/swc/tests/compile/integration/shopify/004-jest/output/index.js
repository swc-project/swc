"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
var _react = /*#__PURE__*/ _interop_require_default._(require("react"));
var _reacti18n = require("@shopify/react-i18n");
function App() {
    var _useI18n = _sliced_to_array._((0, _reacti18n.useI18n)(), 1), i18n = _useI18n[0];
    return /*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo"));
}
