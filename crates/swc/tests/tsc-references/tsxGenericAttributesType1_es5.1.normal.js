// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import _extends from "@swc/helpers/src/_extends.mjs";
var React = require("react");
var decorator = function decorator(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _extends({}, props));
    };
};
var decorator2 = function decorator2(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _extends({}, props, {
            x: 2
        }));
    };
};
var decorator3 = function decorator3(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, _extends({
            x: 2
        }, props));
    };
};
export { };
