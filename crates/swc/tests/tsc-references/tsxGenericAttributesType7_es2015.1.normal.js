// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import _extends from "@swc/helpers/src/_extends.mjs";
const React = require('react');
const decorator = function(props) {
    return /*#__PURE__*/ React.createElement(Component, _extends({}, props));
};
const decorator1 = function(props) {
    return /*#__PURE__*/ React.createElement(Component, _extends({}, props, {
        x: "hi"
    }));
};
export { };
