// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var Foo = function(props) {
    return /*#__PURE__*/ React.createElement("div", null);
};
// Should be OK
var foo = /*#__PURE__*/ React.createElement(Foo, null);
// Should be OK
var MainMenu = function(props) {
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", null, "Main Menu"));
};
var App = function(param) {
    var children = param.children;
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(MainMenu, null));
};
