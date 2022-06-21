"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    App: function() {
        return App;
    }
});
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _slicedToArrayMjs = require("@swc/helpers/lib/_sliced_to_array.js").default;
var _react = _interopRequireDefaultMjs(require("react"));
var _reactI18N = require("@shopify/react-i18n");
function App() {
    var ref = _slicedToArrayMjs((0, _reactI18N.useI18n)(), 1), i18n = ref[0];
    return /*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo"));
}
