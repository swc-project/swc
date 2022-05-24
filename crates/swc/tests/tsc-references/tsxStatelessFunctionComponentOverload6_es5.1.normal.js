import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var obj = {
    children: "hi",
    to: "boo"
};
var obj1;
var obj2 = {
    onClick: function() {}
};
export function MainButton(props) {
    var linkProps = props;
    if (linkProps.to) {
        return this._buildMainLink(props);
    }
    return this._buildMainButton(props);
}
// OK
var b0 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path"
}, "GO");
var b1 = /*#__PURE__*/ React.createElement(MainButton, {
    onClick: function(e) {}
}, "Hello world");
var b2 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj));
var b3 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    to: 10000
}, obj));
var b4 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj1)); // any; just pick the first overload
var b5 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj1, {
    to: "/to/somewhere"
})); // should pick the second overload
var b6 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj2));
var b7 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    onClick: function() {
        console.log("hi");
    }
}));
var b8 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    onClick: function onClick() {}
})); // OK; method declaration get retained (See GitHub #13365)
var b9 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path",
    "extra-prop": true
}, "GO");
var b10 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path",
    children: "hi"
});
var b11 = /*#__PURE__*/ React.createElement(MainButton, {
    onClick: function(e) {},
    className: "hello",
    "data-format": true
}, "Hello world");
var b12 = /*#__PURE__*/ React.createElement(MainButton, {
    "data-format": "Hello world"
});
