// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
function Greet(x) {
    return /*#__PURE__*/ React.createElement("div", null, "Hello, ", x);
}
class BigGreeter extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", null);
    }
}
// OK
let a = /*#__PURE__*/ React.createElement(Greet, null);
// OK - always valid to specify 'key'
let b = /*#__PURE__*/ React.createElement(Greet, {
    key: "k"
});
// Error - not allowed to specify 'ref' on SFCs
let c = /*#__PURE__*/ React.createElement(Greet, {
    ref: "myRef"
});
// OK - ref is valid for classes
let d = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: (x)=>x.greeting.substr(10)
});
// Error ('subtr' not on string)
let e = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: (x)=>x.greeting.subtr(10)
});
// Error (ref callback is contextually typed)
let f = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: (x)=>x.notARealProperty
});
// OK - key is always valid
let g = /*#__PURE__*/ React.createElement(BigGreeter, {
    key: 100
});
// OK - contextually typed intrinsic ref callback parameter
let h = /*#__PURE__*/ React.createElement("div", {
    ref: (x)=>x.innerText
});
// Error - property not on ontextually typed intrinsic ref callback parameter
let i = /*#__PURE__*/ React.createElement("div", {
    ref: (x)=>x.propertyNotOnHtmlDivElement
});
