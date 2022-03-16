import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var decorator4 = function decorator4(Component) {
    return function(props) {
        return /*#__PURE__*/ React.createElement(Component, swcHelpers.extends({}, props, {
            y: "blah"
        }));
    };
};
export { };
