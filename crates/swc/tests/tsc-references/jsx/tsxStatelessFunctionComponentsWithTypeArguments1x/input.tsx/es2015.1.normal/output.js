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
// OK
function Baz(key1, value) {
    let a0 = /*#__PURE__*/ React.createElement(ComponentWithTwoAttributes, {
        key1: key1,
        value: value
    });
    let a1 = /*#__PURE__*/ React.createElement(ComponentWithTwoAttributes, _extends({
    }, {
        key1,
        value: value
    }, {
        key: "Component"
    }));
}
// OK
function createLink(func) {
    let o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
function createLink1(func) {
    let o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// OK
let i = /*#__PURE__*/ React.createElement(InferParamComponent, {
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
