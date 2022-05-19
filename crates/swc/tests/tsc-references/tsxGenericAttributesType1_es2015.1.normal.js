import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const decorator = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props));
};
const decorator2 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props, {
            x: 2
        }));
};
const decorator3 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, swcHelpers.extends({
            x: 2
        }, props));
};
export { };
