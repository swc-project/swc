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
// Error
function Bar(arg) {
    let a1 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({
    }, arg, {
        "ignore-prop": 10
    }));
}
// Error
function Baz(arg) {
    let a0 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({
    }, arg));
}
// Error
function createLink(func) {
    let o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// Error
let i1 = /*#__PURE__*/ React.createElement(InferParamComponent, {
    values: [
        1,
        2,
        3,
        4
    ],
    selectHandler: (val)=>{
    }
});
export { };
