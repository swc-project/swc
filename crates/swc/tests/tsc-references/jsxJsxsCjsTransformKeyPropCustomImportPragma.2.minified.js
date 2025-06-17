//// [preact.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/_/_object_spread"), _object_spread_props = require("@swc/helpers/_/_object_spread_props"), props = {
    answer: 42
};
_object_spread._({
    key: "foo"
}, props), _object_spread_props._(_object_spread._({}, props), {
    key: "bar"
});
//// [react.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/_/_object_spread"), _object_spread_props = require("@swc/helpers/_/_object_spread_props");
require("./preact");
var props2 = {
    answer: 42
};
_object_spread._({
    key: "foo"
}, props2), _object_spread_props._(_object_spread._({}, props2), {
    key: "bar"
});
