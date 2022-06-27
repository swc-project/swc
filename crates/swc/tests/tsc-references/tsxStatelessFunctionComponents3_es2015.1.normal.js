// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const Foo = (props)=>/*#__PURE__*/ React.createElement("div", null);
// Should be OK
const foo = /*#__PURE__*/ React.createElement(Foo, null);
// Should be OK
var MainMenu = (props)=>/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", null, "Main Menu"));
var App = ({ children  })=>/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(MainMenu, null));
export { };
