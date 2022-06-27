import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const decorator = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({}, props));
};
const decorator2 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({}, props, {
            x: 2
        }));
};
const decorator3 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({
            x: 2
        }, props));
};
export { };
