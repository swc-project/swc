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
var React = require('react');
// OK
function Baz(key1, value) {
    var a0 = /*#__PURE__*/ React.createElement(ComponentWithTwoAttributes, {
        key1: key1,
        value: value
    });
    var a1 = /*#__PURE__*/ React.createElement(ComponentWithTwoAttributes, _extends({
    }, {
        key1: key1,
        value: value
    }, {
        key: "Component"
    }));
}
// OK
function createLink(func) {
    var o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
function createLink1(func) {
    var o = /*#__PURE__*/ React.createElement(Link, {
        func: func
    });
}
// OK
var i1 = /*#__PURE__*/ React.createElement(InferParamComponent, {
    values: [
        1,
        2,
        3,
        4
    ],
    selectHandler: function(val) {
    }
});
export { };
