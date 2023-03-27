//// [jsxJsxsCjsTransformKeyPropCustomImport.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default;
var _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
var props = {
    answer: 42
};
var a = /*#__PURE__*/ React.createElement("div", _object_spread({
    key: "foo"
}, props), "text");
var b = /*#__PURE__*/ React.createElement("div", _object_spread_props(_object_spread({}, props), {
    key: "bar"
}), "text");
