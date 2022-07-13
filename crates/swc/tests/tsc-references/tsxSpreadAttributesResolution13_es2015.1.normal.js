// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import _extends from "@swc/helpers/src/_extends.mjs";
const React = require('react');
export default function Component(props) {
    let condition1;
    if (condition1) {
        return /*#__PURE__*/ React.createElement(ChildComponent, _extends({}, props));
    } else {
        return /*#__PURE__*/ React.createElement(ChildComponent, _extends({}, props, {
            property1: "NewString"
        }));
    }
};
function ChildComponent({ property1  }) {
    return /*#__PURE__*/ React.createElement("span", null, property1);
}
