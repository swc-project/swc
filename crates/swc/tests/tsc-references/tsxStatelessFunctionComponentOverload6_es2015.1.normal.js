import _extends from "@swc/helpers/src/_extends.mjs";
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
let obj = {
    children: "hi",
    to: "boo"
};
let obj1;
let obj2 = {
    onClick: ()=>{}
};
export function MainButton(props) {
    const linkProps = props;
    if (linkProps.to) {
        return this._buildMainLink(props);
    }
    return this._buildMainButton(props);
}
// OK
const b0 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path"
}, "GO");
const b1 = /*#__PURE__*/ React.createElement(MainButton, {
    onClick: (e)=>{}
}, "Hello world");
const b2 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj));
const b3 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    to: 10000
}, obj));
const b4 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj1)); // any; just pick the first overload
const b5 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj1, {
    to: "/to/somewhere"
})); // should pick the second overload
const b6 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, obj2));
const b7 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    onClick: ()=>{
        console.log("hi");
    }
}));
const b8 = /*#__PURE__*/ React.createElement(MainButton, _extends({}, {
    onClick () {}
})); // OK; method declaration get retained (See GitHub #13365)
const b9 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path",
    "extra-prop": true
}, "GO");
const b10 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path",
    children: "hi"
});
const b11 = /*#__PURE__*/ React.createElement(MainButton, {
    onClick: (e)=>{},
    className: "hello",
    "data-format": true
}, "Hello world");
const b12 = /*#__PURE__*/ React.createElement(MainButton, {
    "data-format": "Hello world"
});
