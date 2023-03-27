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
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _sliced_to_array = require("@swc/helpers/lib/_sliced_to_array.js").default;
var _react = /*#__PURE__*/ _interop_require_default(require("react"));
var _react_i_1_8n = require("@shopify/react-i18n");
function App() {
    var _useI18n = _sliced_to_array((0, _react_i_1_8n.useI18n)(), 1), i18n = _useI18n[0];
    return /*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo"));
}
