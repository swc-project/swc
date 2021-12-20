function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
let obj0 = {
    to: "world"
};
let obj1 = {
    children: "hi",
    to: "boo"
};
let obj2 = {
    onClick: ()=>{
    }
};
let obj3;
export function MainButton(props) {
    const linkProps = props;
    if (linkProps.to) {
        return this._buildMainLink(props);
    }
    return this._buildMainButton(props);
}
// Error
const b0 = /*#__PURE__*/ React.createElement(MainButton, {
    to: "/some/path",
    onClick: (e)=>{
    }
}, "GO"); // extra property;
const b1 = /*#__PURE__*/ React.createElement(MainButton, _extends({
    onClick: (e)=>{
    }
}, obj0), "Hello world"); // extra property;
const b2 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    to: "10000"
}, obj2)); // extra property
const b3 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    to: "10000"
}, {
    onClick: (k)=>{
    }
})); // extra property
const b4 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, obj3, {
    to: true
})); // Should error because Incorrect type; but attributes are any so everything is allowed
const b5 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, obj0)); // Spread retain method declaration (see GitHub #13365), so now there is an extra attributes
const b6 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, {
    children: 10
})); // incorrect type for optional attribute
const b7 = /*#__PURE__*/ React.createElement(MainButton, _extends({
}, {
    onClick (e) {
    }
}, {
    children: "hello",
    className: true
})); // incorrect type for optional attribute
const b8 = /*#__PURE__*/ React.createElement(MainButton, {
    "data-format": true
}); // incorrect type for specified hyphanated name
