//// [jsxJsxsCjsTransformKeyPropCustomImport.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default, _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default, props = {
    answer: 42
};
_object_spread({
    key: "foo"
}, props), _object_spread_props(_object_spread({}, props), {
    key: "bar"
});
