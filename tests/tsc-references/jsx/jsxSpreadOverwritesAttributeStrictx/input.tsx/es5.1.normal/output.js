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
// @strict: true
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var props1 = {
    a: 1,
    b: 1
};
var Foo = function(props) {
    /*#__PURE__*/ return React.createElement("div", null, props.a);
};
// ok
var a1 = /*#__PURE__*/ React.createElement(Foo, _extends({
}, props1));
var a2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    d: 1
}, props1));
// error
var b1 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1
}, props1));
var b2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    b: 2
}, props1));
var b3 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props1, {
    d: 1
}));
var b4 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props1, {
    a: 1,
    d: 1
}));
export { };
