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
};
// OK
/*#__PURE__*/ React.createElement(Poisoned, _extends({
}, {
    x: "ok",
    y: "2"
}));
// Error
let p = /*#__PURE__*/ React.createElement(Poisoned, _extends({
}, obj));
let y = /*#__PURE__*/ React.createElement(Poisoned, null);
let z = /*#__PURE__*/ React.createElement(Poisoned, {
    x: true,
    y: true
});
let w = /*#__PURE__*/ React.createElement(Poisoned, _extends({
}, {
    x: 5,
    y: "2"
}));
let w1 = /*#__PURE__*/ React.createElement(Poisoned, _extends({
}, {
    x: 5,
    y: "2"
}, {
    X: "hi"
}));
export { };
