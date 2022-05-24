import _extends from "@swc/helpers/lib/_extends.js";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class Opt extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    }
}
const obj = {};
const obj1 = {
    x: 2
};
// OK
let p = /*#__PURE__*/ React.createElement(Opt, null);
let y = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj));
let y1 = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj1));
let y2 = /*#__PURE__*/ React.createElement(Opt, _extends({}, obj1, {
    y: true
}));
let y3 = /*#__PURE__*/ React.createElement(Opt, {
    x: 2
});
export { };
