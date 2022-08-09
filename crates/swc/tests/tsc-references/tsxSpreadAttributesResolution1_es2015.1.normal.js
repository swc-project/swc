// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
import _extends from "@swc/helpers/src/_extends.mjs";
const React = require('react');
class Poisoned extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    }
}
const obj = {};
// OK
let p = /*#__PURE__*/ React.createElement(Poisoned, _extends({}, obj));
let y = /*#__PURE__*/ React.createElement(Poisoned, null);
export { };
