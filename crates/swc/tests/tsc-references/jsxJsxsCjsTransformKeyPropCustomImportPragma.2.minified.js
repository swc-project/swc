//// [preact.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _extends = require("@swc/helpers/lib/_extends.js").default, _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
require("preact/jsx-runtime"), require("react");
var props = {
    answer: 42
};
_objectSpreadProps(_extends({}, props), {
    children: "text"
}), _objectSpreadProps(_extends({}, props), {
    key: "bar"
});
//// [react.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _extends = require("@swc/helpers/lib/_extends.js").default, _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
require("react/jsx-runtime"), require("react"), require("./preact");
var props2 = {
    answer: 42
};
_objectSpreadProps(_extends({}, props2), {
    children: "text"
}), _objectSpreadProps(_extends({}, props2), {
    key: "bar"
});
