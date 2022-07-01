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
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _slicedToArray = require("@swc/helpers/lib/_sliced_to_array.js").default;
var _react = _interopRequireDefault(require("react"));
var _reactI18N = require("@shopify/react-i18n");
function App() {
    var ref = _slicedToArray((0, _reactI18N.useI18n)(), 1), i18n = ref[0];
    return /*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo"));
}
