//// [preact.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default, _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
require("preact/jsx-runtime"), require("preact");
var props = {
    answer: 42
};
_object_spread_props(_object_spread({}, props), {
    children: "text"
}), _object_spread_props(_object_spread({}, props), {
    key: "bar"
});
//// [react.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default, _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
require("react/jsx-runtime"), require("react"), require("./preact");
var props2 = {
    answer: 42
};
_object_spread_props(_object_spread({}, props2), {
    children: "text"
}), _object_spread_props(_object_spread({}, props2), {
    key: "bar"
});
