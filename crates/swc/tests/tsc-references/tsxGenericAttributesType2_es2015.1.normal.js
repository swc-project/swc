import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
const decorator4 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({}, props, {
            y: "blah"
        }));
};
export { };
