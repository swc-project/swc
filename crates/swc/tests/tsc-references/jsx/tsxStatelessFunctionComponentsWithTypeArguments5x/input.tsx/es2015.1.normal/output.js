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
function createComponent(arg) {
    let a1 = /*#__PURE__*/ React.createElement(Component, _extends({
    }, arg));
    let a2 = /*#__PURE__*/ React.createElement(Component, _extends({
    }, arg, {
        prop1: true
    }));
}
function Bar(arg) {
    let a1 = /*#__PURE__*/ React.createElement(ComponentSpecific, _extends({
    }, arg, {
        "ignore-prop": "hi"
    })); // U is number
    let a2 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({
    }, arg, {
        "ignore-prop": 10
    })); // U is number
    let a3 = /*#__PURE__*/ React.createElement(ComponentSpecific, _extends({
    }, arg, {
        prop: "hello"
    })); // U is "hello"
    let a4 = /*#__PURE__*/ React.createElement(ComponentSpecific, _extends({
    }, arg, {
        prop1: "hello"
    })); // U is "hello"
}
export { };
