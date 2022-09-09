//// [preact.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default, _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default, props = (require("preact/jsx-runtime"), require("react"), {
    answer: 42
});
_objectSpreadProps(_objectSpread({}, props), {
    children: "text"
}), _objectSpreadProps(_objectSpread({}, props), {
    key: "bar"
});
//// [react.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default, _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
require("react/jsx-runtime"), require("react"), require("./preact");
var props2 = {
    answer: 42
};
_objectSpreadProps(_objectSpread({}, props2), {
    children: "text"
}), _objectSpreadProps(_objectSpread({}, props2), {
    key: "bar"
});
