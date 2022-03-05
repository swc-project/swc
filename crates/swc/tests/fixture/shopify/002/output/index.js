"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = App;
var swcHelpers = require("@swc/helpers");
var _react = swcHelpers.interopRequireDefault(require("react"));
var _reactI18N = require("@shopify/react-i18n");
function App() {
    var ref = swcHelpers.slicedToArray((0, _reactI18N).useI18n(), 1), i18n = ref[0];
    return(/*#__PURE__*/ _react.default.createElement("h1", null, i18n.translate("foo")));
}
