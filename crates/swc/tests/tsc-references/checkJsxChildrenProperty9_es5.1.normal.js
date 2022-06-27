// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
// OK
var k1 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", /*#__PURE__*/ React.createElement("h1", null, " world "));
var k2 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", function(user) {
    return /*#__PURE__*/ React.createElement("h2", null, user.name);
});
var k3 = /*#__PURE__*/ React.createElement("div", null, " ", 1, " ", "That is a number", " ");
