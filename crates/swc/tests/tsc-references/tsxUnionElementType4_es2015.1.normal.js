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
var RCComp = RC1 || RC2;
var EmptyRCComp = RC3 || RC4;
var PartRCComp = RC1 || RC4;
// Error
let a = /*#__PURE__*/ React.createElement(RCComp, {
    x: true
});
let b = /*#__PURE__*/ React.createElement(PartRCComp, {
    x: 10
});
let c = /*#__PURE__*/ React.createElement(EmptyRCComp, {
    prop: true
});
