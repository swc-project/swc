//// [jsxJsxsCjsTransformKeyPropCustomImport.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default;
var _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
var props = {
    answer: 42
};
var a = /*#__PURE__*/ React.createElement("div", _objectSpread({
    key: "foo"
}, props), "text");
var b = /*#__PURE__*/ React.createElement("div", _objectSpreadProps(_objectSpread({}, props), {
    key: "bar"
}), "text");
