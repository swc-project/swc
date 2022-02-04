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
const React = require('react');
const props = {
    a: 1,
    b: 1
};
const Foo = (props1)=>/*#__PURE__*/ React.createElement("div", null, props1.a)
;
// ok
const a1 = /*#__PURE__*/ React.createElement(Foo, _extends({}, props));
const a2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    d: 1
}, props));
// error
const b1 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1
}, props));
const b2 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    b: 2
}, props));
const b3 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    d: 1
}));
const b4 = /*#__PURE__*/ React.createElement(Foo, _extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
}));
export { };
