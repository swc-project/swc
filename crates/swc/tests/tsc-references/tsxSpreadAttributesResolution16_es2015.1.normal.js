import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
export default function Component(props) {
    return(// Error: missing property
    /*#__PURE__*/ React.createElement(AnotherComponent, swcHelpers.extends({}, props)));
};
function AnotherComponent({ property1  }) {
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
