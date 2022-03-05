import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var decorator = function decorator(Component) {
    return function(props) {
        /*#__PURE__*/ return React.createElement(Component, swcHelpers.extends({}, props));
    };
};
var decorator2 = function decorator2(Component) {
    return function(props) {
        /*#__PURE__*/ return React.createElement(Component, swcHelpers.extends({}, props, {
            x: 2
        }));
    };
};
var decorator3 = function decorator3(Component) {
    return function(props) {
        /*#__PURE__*/ return React.createElement(Component, swcHelpers.extends({
            x: 2
        }, props));
    };
};
export { };
