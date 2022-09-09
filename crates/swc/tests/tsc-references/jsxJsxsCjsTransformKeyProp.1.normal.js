//// [jsxJsxsCjsTransformKeyProp.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _extends = require("@swc/helpers/lib/_extends.js").default;
var props = {
    answer: 42
};
var a = /*#__PURE__*/ React.createElement("div", _extends({
    key: "foo"
}, props), "text");
var b = /*#__PURE__*/ React.createElement("div", _extends({}, props, {
    key: "bar"
}), "text");
