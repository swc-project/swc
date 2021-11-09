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
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class Poisoned extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("div", null, "Hello"));
    }
}
const obj = {
    x: "hello world",
    y: 2
};
// OK
let p = /*#__PURE__*/ React.createElement(Poisoned, _extends({
}, obj));
class EmptyProp extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("div", null, "Default hi"));
    }
}
// OK
let j;
let e1 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({
}, {
}));
let e2 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({
}, j));
let e3 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({
}, {
    ref: (input)=>{
        this.textInput = input;
    }
}));
let e4 = /*#__PURE__*/ React.createElement(EmptyProp, {
    "data-prop": true
});
let e5 = /*#__PURE__*/ React.createElement(EmptyProp, _extends({
}, {
    "data-prop": true
}));
export { };
