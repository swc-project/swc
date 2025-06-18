//// [preact.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/_/_object_spread"), _object_spread_props = require("@swc/helpers/_/_object_spread_props");
require("react/jsx-dev-runtime"), require("react");
var props = {
    answer: 42
};
_object_spread_props._(_object_spread._({}, props), {
    children: "text"
}), _object_spread_props._(_object_spread._({}, props), {
    key: "bar",
    __source: {
        fileName: "preact.tsx",
        lineNumber: 5,
        columnNumber: 11
    },
    __self: void 0
});
//// [react.tsx]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _object_spread = require("@swc/helpers/_/_object_spread"), _object_spread_props = require("@swc/helpers/_/_object_spread_props");
require("react/jsx-dev-runtime"), require("react"), require("./preact");
var props2 = {
    answer: 42
};
_object_spread_props._(_object_spread._({}, props2), {
    children: "text"
}), _object_spread_props._(_object_spread._({}, props2), {
    key: "bar",
    __source: {
        fileName: "react.tsx",
        lineNumber: 6,
        columnNumber: 12
    },
    __self: void 0
});
