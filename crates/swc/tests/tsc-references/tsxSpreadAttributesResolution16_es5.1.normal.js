import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
export default function Component(props) {
    return(// Error: missing property
    /*#__PURE__*/ React.createElement(AnotherComponent, _extends({}, props)));
};
function AnotherComponent(param) {
    var property1 = param.property1;
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
