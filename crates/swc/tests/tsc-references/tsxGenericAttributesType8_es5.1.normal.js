import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var decorator = function decorator(props) {
    return /*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props));
};
var decorator1 = function decorator1(props) {
    return /*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props));
};
export { };
