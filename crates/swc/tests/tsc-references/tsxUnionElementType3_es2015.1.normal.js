// @filename: file.tsx
// @jsx: react
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class RC1 extends React.Component {
    render() {
        return null;
    }
}
class RC2 extends React.Component {
    render() {
        return null;
    }
    method() {}
}
class RC3 extends React.Component {
    render() {
        return null;
    }
}
class RC4 extends React.Component {
    render() {
        return null;
    }
}
var EmptyRCComp = RC3 || RC4;
var PartRCComp = RC1 || RC4;
var RCComp = RC1 || RC2;
// OK
let a = /*#__PURE__*/ React.createElement(RCComp, {
    x: "Hi"
});
let a1 = /*#__PURE__*/ React.createElement(EmptyRCComp, null);
let a2 = /*#__PURE__*/ React.createElement(EmptyRCComp, {
    "data-prop": "hello"
});
let b = /*#__PURE__*/ React.createElement(PartRCComp, null);
let c = /*#__PURE__*/ React.createElement(PartRCComp, {
    "data-extra": "hello"
});
export { };
