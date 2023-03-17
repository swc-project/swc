//// [jsxJsxsCjsTransformKeyProp.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default, _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default, props = {
    answer: 42
};
_objectSpread({
    key: "foo"
}, props), _objectSpreadProps(_objectSpread({}, props), {
    key: "bar"
});
