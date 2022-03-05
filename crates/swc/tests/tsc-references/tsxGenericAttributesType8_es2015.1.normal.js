import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const decorator = function(props) {
    return(/*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props)));
};
const decorator1 = function(props) {
    return(/*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props)));
};
export { };
