function _extends() {
    _extends = Object.assign || function(target) {
        for(var i1 = 1; i1 < arguments.length; i1++){
            var source = arguments[i1];
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
    let a1 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({}, arg, {
        "ignore-prop": 10
    }));
}
// Error
function Baz(arg) {
    let a0 = /*#__PURE__*/ React.createElement(ComponentSpecific1, _extends({}, arg));
}
// Error
function createLink(func) {
    let o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// Error
let i = /*#__PURE__*/ React.createElement(InferParamComponent, {
    values: [
        1,
        2,
        3,
        4
    ],
    selectHandler: (val)=>{}
});
export { };
