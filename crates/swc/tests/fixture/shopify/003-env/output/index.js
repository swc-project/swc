"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: ()=>App
});
const _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
const _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
const _reactI18N = require("@shopify/react-i18n");
function App() {
    const [i18n] = (0, _reactI18N.useI18n)();
    return /*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo"));
}
