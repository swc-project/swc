// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class Button extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "My Button");
    }
}
function AnotherButton(p) {
    return /*#__PURE__*/ React.createElement("h1", null, "Just Another Button");
}
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
let k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null), /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null));
let k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null)), /*#__PURE__*/ React.createElement(AnotherButton, null));
let k3 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null)));
function SingleChildComp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// OK
let k4 = /*#__PURE__*/ React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null)));
// Error
let k5 = /*#__PURE__*/ React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(React.Fragment, null), /*#__PURE__*/ React.createElement(Button, null), /*#__PURE__*/ React.createElement(AnotherButton, null));
