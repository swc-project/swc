// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @noImplicitAny: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class BigGreeter extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null, "Default hi");
    }
}
// Error
let a = /*#__PURE__*/ React.createElement(BigGreeter, {
    prop1: "hello"
});
// OK
let b = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: (input)=>{
        this.textInput = input;
    }
});
let c = /*#__PURE__*/ React.createElement(BigGreeter, {
    "data-extra": "hi"
});
