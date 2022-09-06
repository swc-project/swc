//// [jsxJsxsCjsTransformKeyProp.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _extends = require("@swc/helpers/lib/_extends.js").default, props = {
    answer: 42
};
_extends({
    key: "foo"
}, props), _extends({}, props, {
    key: "bar"
});
