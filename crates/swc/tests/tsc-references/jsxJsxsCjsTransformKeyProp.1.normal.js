//// [jsxJsxsCjsTransformKeyProp.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ React.createElement("div", _object_spread._({
    key: "foo"
}, props), "text");
var b = /*#__PURE__*/ React.createElement("div", _object_spread_props._(_object_spread._({}, props), {
    key: "bar"
}), "text");
