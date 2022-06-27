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
function Comp(p) {
    return /*#__PURE__*/ React.createElement("div", null, p.b);
}
// Error: no children specified
let k = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
});
// Error: JSX.element is not the same as JSX.ElementClass
let k1 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, /*#__PURE__*/ React.createElement(Button, null));
let k2 = /*#__PURE__*/ React.createElement(Comp, {
    a: 10,
    b: "hi"
}, Button);
export { };
